import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { createClient } from '@libsql/client';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { action, url, type, tableName, columns, newTableName } = await request.json();

    if (!action || !url || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: action, url, type' },
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
            case 'CREATE_TABLE': {
              if (!tableName || !columns || !Array.isArray(columns)) {
                throw new Error('Table name and columns are required for CREATE_TABLE');
              }

              const columnDefs = columns.map(col => {
                let def = `${col.name} ${col.type}`;
                if (!col.nullable) def += ' NOT NULL';
                if (col.primaryKey) def += ' PRIMARY KEY';
                return def;
              }).join(', ');

              const createQuery = `CREATE TABLE ${tableName} (${columnDefs})`;
              await client.query(createQuery);
              result = { created: true, tableName };
              break;
            }

            case 'DROP_TABLE': {
              if (!tableName) {
                throw new Error('Table name is required for DROP_TABLE');
              }

              await client.query(`DROP TABLE IF EXISTS ${tableName}`);
              result = { deleted: true, tableName };
              break;
            }

            case 'ALTER_TABLE': {
              if (!tableName || !newTableName) {
                throw new Error('Table name and new table name are required for ALTER_TABLE');
              }

              await client.query(`ALTER TABLE ${tableName} RENAME TO ${newTableName}`);
              result = { renamed: true, oldName: tableName, newName: newTableName };
              break;
            }

            default:
              throw new Error(`Unsupported action: ${action}`);
          }

          await client.end();
          break;
        }

        case 'mysql': {
          const connection = await mysql.createConnection(url);

          switch (action) {
            case 'CREATE_TABLE': {
              if (!tableName || !columns || !Array.isArray(columns)) {
                throw new Error('Table name and columns are required for CREATE_TABLE');
              }

              const columnDefs = columns.map(col => {
                let def = `\`${col.name}\` ${col.type}`;
                if (!col.nullable) def += ' NOT NULL';
                if (col.primaryKey) def += ' PRIMARY KEY';
                return def;
              }).join(', ');

              const createQuery = `CREATE TABLE ${tableName} (${columnDefs})`;
              await connection.execute(createQuery);
              result = { created: true, tableName };
              break;
            }

            case 'DROP_TABLE': {
              if (!tableName) {
                throw new Error('Table name is required for DROP_TABLE');
              }

              await connection.execute(`DROP TABLE IF EXISTS ${tableName}`);
              result = { deleted: true, tableName };
              break;
            }

            case 'ALTER_TABLE': {
              if (!tableName || !newTableName) {
                throw new Error('Table name and new table name are required for ALTER_TABLE');
              }

              await connection.execute(`ALTER TABLE ${tableName} RENAME TO ${newTableName}`);
              result = { renamed: true, oldName: tableName, newName: newTableName };
              break;
            }

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
            case 'CREATE_TABLE': {
              if (!tableName || !columns || !Array.isArray(columns)) {
                throw new Error('Table name and columns are required for CREATE_TABLE');
              }

              const columnDefs = columns.map(col => {
                let def = `${col.name} ${col.type}`;
                if (!col.nullable) def += ' NOT NULL';
                if (col.primaryKey) def += ' PRIMARY KEY';
                return def;
              }).join(', ');

              const createQuery = `CREATE TABLE ${tableName} (${columnDefs})`;
              await client.execute(createQuery);
              result = { created: true, tableName };
              break;
            }

            case 'DROP_TABLE': {
              if (!tableName) {
                throw new Error('Table name is required for DROP_TABLE');
              }

              await client.execute(`DROP TABLE IF EXISTS ${tableName}`);
              result = { deleted: true, tableName };
              break;
            }

            case 'ALTER_TABLE': {
              if (!tableName || !newTableName) {
                throw new Error('Table name and new table name are required for ALTER_TABLE');
              }

              await client.execute(`ALTER TABLE ${tableName} RENAME TO ${newTableName}`);
              result = { renamed: true, oldName: tableName, newName: newTableName };
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