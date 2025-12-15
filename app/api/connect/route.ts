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

    let isConnected = false;
    let error = null;

    try {
      switch (type) {
        case 'postgresql': {
          const client = new Client({
            connectionString: url,
            ssl: url.includes('localhost') ? false : { rejectUnauthorized: false }
          });
          await client.connect();
          await client.query('SELECT 1');
          await client.end();
          isConnected = true;
          break;
        }

        case 'mysql': {
          const connection = await mysql.createConnection(url);
          await connection.execute('SELECT 1');
          await connection.end();
          isConnected = true;
          break;
        }

        case 'turso': {
          const client = createClient({
            url: url,
            authToken: url.includes('authToken=') ? 
              url.split('authToken=')[1].split('&')[0] : undefined
          });
          await client.execute('SELECT 1');
          await client.close();
          isConnected = true;
          break;
        }

        default:
          error = `Unsupported database type: ${type}`;
      }
    } catch (connError) {
      error = connError instanceof Error ? connError.message : 'Connection failed';
      isConnected = false;
    }

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Database connected successfully'
      });
    } else {
      return NextResponse.json(
        { error: error || 'Failed to connect to database' },
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