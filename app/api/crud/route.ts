import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { createClient } from '@libsql/client';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { action, url, type, tableName, data, whereClause, whereParams } = await request.json();

    if (!action || !url || !type || !tableName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let result;

    try {
      switch (type) {
        case 'postgresql': {
          const client = new Client({
            connectionString: url,
            ssl: url.includes('localhost') ? false : { rejectUnauthorized: false }
          });
          await client.connect();

          switch (action) {
            case 'CREATE':
              const columns = Object.keys(data);
              const values = Object.values(data);
              const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
              const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
              const insertResult = await client.query(insertQuery, values);
              result = insertResult.rows[0];
              break;

            case 'UPDATE':
              if (!whereClause) {
                throw new Error('WHERE clause is required for UPDATE operations');
              }
              const updateColumns = Object.keys(data);
              const updateValues = Object.values(data);
              const setClause = updateColumns.map((col, i) => `${col} = $${i + 1}`).join(', ');
              const whereClauseWithParams = whereClause.startsWith('WHERE') ? whereClause : `WHERE ${whereClause}`;
              const allUpdateParams = [...updateValues, ...(whereParams || [])];
              const updateQuery = `UPDATE ${tableName} SET ${setClause} ${whereClauseWithParams} RETURNING *`;
              const updateResult = await client.query(updateQuery, allUpdateParams);
              result = updateResult.rows[0];
              break;

            case 'DELETE':
              if (!whereClause) {
                throw new Error('WHERE clause is required for DELETE operations');
              }
              const deleteWhereClause = whereClause.startsWith('WHERE') ? whereClause : `WHERE ${whereClause}`;
              const deleteQuery = `DELETE FROM ${tableName} ${deleteWhereClause}`;
              await client.query(deleteQuery, whereParams || []);
              result = { deleted: true };
              break;

            default:
              throw new Error(`Unsupported action: ${action}`);
          }

          await client.end();
          break;
        }

        case 'mysql': {
          const connection = await mysql.createConnection(url);

          switch (action) {
            case 'CREATE':
              const columns = Object.keys(data);
              const values = Object.values(data);
              const placeholders = columns.map(() => '?').join(', ');
              const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
              const [insertResult] = await connection.execute(insertQuery, values);
              result = (insertResult as any).insertId ? { id: (insertResult as any).insertId, ...data } : data;
              break;

            case 'UPDATE':
              if (!whereClause) {
                throw new Error('WHERE clause is required for UPDATE operations');
              }
              const updateColumns = Object.keys(data);
              const setClause = updateColumns.map(col => `${col} = ?`).join(', ');
              const updateQuery = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
              const allUpdateParams = [...Object.values(data), ...(whereParams || [])];
              const [updateResult] = await connection.execute(updateQuery, allUpdateParams);
              result = { updated: true };
              break;

            case 'DELETE':
              if (!whereClause) {
                throw new Error('WHERE clause is required for DELETE operations');
              }
              const deleteQuery = `DELETE FROM ${tableName} WHERE ${whereClause}`;
              await connection.execute(deleteQuery, whereParams || []);
              result = { deleted: true };
              break;

            default:
              throw new Error(`Unsupported action: ${action}`);
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

          switch (action) {
            case 'CREATE': {
              const columns = Object.keys(data);
              const placeholders = columns.map(() => '?').join(', ');
              const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
              const paramArray = columns.map(col => data[col]);
              const insertResult = await client.execute(insertQuery);
              result = data;
              break;
            }

            case 'UPDATE': {
              if (!whereClause) {
                throw new Error('WHERE clause is required for UPDATE operations');
              }
              const updateColumns = Object.keys(data);
              const setClause = updateColumns.map(col => `${col} = ?`).join(', ');
              const updateQuery = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
              await client.execute(updateQuery);
              result = { updated: true };
              break;
            }

            case 'DELETE': {
              if (!whereClause) {
                throw new Error('WHERE clause is required for DELETE operations');
              }
              const deleteQuery = `DELETE FROM ${tableName} WHERE ${whereClause}`;
              await client.execute(deleteQuery);
              result = { deleted: true };
              break;
            }

            default:
              throw new Error(`Unsupported action: ${action}`);
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
        result
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