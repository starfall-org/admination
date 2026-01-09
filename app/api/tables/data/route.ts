import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { createClient } from '@libsql/client';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { url, type, tableName } = await request.json();

    if (!url || !type || !tableName) {
      return NextResponse.json(
        { error: 'Missing required fields: url, type, tableName' },
        { status: 400 }
      );
    }

    let rows: any[] = [];

    try {
      switch (type) {
        case 'postgresql': {
          const client = new Client({
            connectionString: url,
            ssl: url.includes('localhost') ? false : { rejectUnauthorized: false }
          });
          await client.connect();
          
          const result = await client.query(`SELECT * FROM ${tableName} LIMIT 100`);
          rows = result.rows;
          
          await client.end();
          break;
        }

        case 'mysql': {
          const connection = await mysql.createConnection(url);
          
          const [dataRows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 100`);
          rows = dataRows as any[];
          
          await connection.end();
          break;
        }

        case 'turso': {
          const client = createClient({
            url: url,
            authToken: url.includes('authToken=') ? 
              url.split('authToken=')[1].split('&')[0] : undefined
          });
          
          const result = await client.execute(`SELECT * FROM ${tableName} LIMIT 100`);
          rows = result.rows;
          
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
        data: rows
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
