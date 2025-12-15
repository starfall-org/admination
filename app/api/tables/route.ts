import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { createClient } from '@libsql/client';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { url, type } = await request.json();

    if (!url || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: url, type' },
        { status: 400 }
      );
    }

    let tables = [];

    try {
      switch (type) {
        case 'postgresql': {
          const client = new Client({
            connectionString: url,
            ssl: url.includes('localhost') ? false : { rejectUnauthorized: false }
          });
          await client.connect();
          
          // Get table list
          const tableResult = await client.query(`
            SELECT table_name, table_type 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
          `);

          // Get table data
          for (const tableRow of tableResult.rows) {
            const tableName = tableRow.table_name;
            
            // Get column info
            const columnsResult = await client.query(`
              SELECT column_name, data_type, is_nullable 
              FROM information_schema.columns 
              WHERE table_name = $1 
              AND table_schema = 'public'
              ORDER BY ordinal_position
            `, [tableName]);

            const countResult = await client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
            const rowCount = parseInt(countResult.rows[0].count);

            // Get sample data (first 100 rows)
            const dataResult = await client.query(`SELECT * FROM ${tableName} LIMIT 100`);
            
            tables.push({
              name: tableName,
              columns: columnsResult.rows.map(col => ({
                name: col.column_name,
                type: col.data_type,
                nullable: col.is_nullable === 'YES'
              })),
              rows: dataResult.rows,
              rowCount
            });
          }

          await client.end();
          break;
        }

        case 'mysql': {
          const connection = await mysql.createConnection(url);
          
          // Get table list
          const [tableRows] = await connection.execute(`
            SELECT table_name, table_type 
            FROM information_schema.tables 
            WHERE table_schema = DATABASE()
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
          `);

          for (const tableRow of tableRows as any[]) {
            const tableName = tableRow.table_name;
            
            // Get column info
            const [columnRows] = await connection.execute(`
              SELECT column_name, data_type, is_nullable 
              FROM information_schema.columns 
              WHERE table_name = ? 
              AND table_schema = DATABASE()
              ORDER BY ordinal_position
            `, [tableName]);

            // Get row count
            const [countRows] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
            const rowCount = (countRows as any[])[0].count;

            // Get sample data
            const [dataRows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 100`);
            
            tables.push({
              name: tableName,
              columns: (columnRows as any[]).map(col => ({
                name: col.column_name,
                type: col.data_type,
                nullable: col.is_nullable === 'YES'
              })),
              rows: dataRows as any[],
              rowCount
            });
          }

          await connection.end();
          break;
        }

        case 'turso': {
          const client = createClient({
            url: url,
            authToken: url.includes('authToken=') ? 
              url.split('authToken=')[1].split('&')[0] : undefined
          });
          
          // Get table list
          const tableResult = await client.execute(`
            SELECT name FROM sqlite_master 
            WHERE type='table' 
            AND name NOT LIKE 'sqlite_%'
            ORDER BY name
          `);

          for (const tableRow of tableResult.rows) {
            const tableName = (tableRow as any).name;
            
            // Get column info
            const columnsResult = await client.execute(`PRAGMA table_info(${tableName})`);
            
            // Get sample data
            const dataResult = await client.execute(`SELECT * FROM ${tableName} LIMIT 100`);
            
            // Get row count
            const countResult = await client.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
            
            tables.push({
              name: tableName,
              columns: columnsResult.rows.map(col => ({
                name: (col as any).name,
                type: (col as any).type,
                nullable: (col as any).notnull === 0
              })),
              rows: dataResult.rows,
              rowCount: (countResult.rows[0] as any).count
            });
          }

          await client.close();
          break;
        }

        default:
          return NextResponse.json(
            { error: `Unsupported database type: ${type}` },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        tables
      });

    } catch (dbError) {
      return NextResponse.json(
        { error: dbError instanceof Error ? dbError.message : 'Database error' },
        { status: 500 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}