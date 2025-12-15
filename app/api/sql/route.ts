import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { Pool } from 'pg';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { query, url, type } = await request.json();

    if (!query || !url || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    let result: any;

    if (type === 'turso') {
      // Turso/SQLite
      const client = createClient({ url });
      try {
        const isSelect = query.trim().toUpperCase().startsWith('SELECT');
        
        if (isSelect) {
          const rows = await client.execute(query);
          result = { data: rows.rows };
        } else {
          const rs = await client.execute(query);
          result = { data: { affectedRows: rs.rowsAffected } };
        }
      } finally {
        client.close();
      }
    } else if (type === 'postgresql') {
      // PostgreSQL
      const pool = new Pool({ connectionString: url });
      try {
        const isSelect = query.trim().toUpperCase().startsWith('SELECT');
        
        if (isSelect) {
          const { rows } = await pool.query(query);
          result = { data: rows };
        } else {
          const res = await pool.query(query);
          result = { data: { affectedRows: res.rowCount } };
        }
      } finally {
        await pool.end();
      }
    } else if (type === 'mysql') {
      // MySQL
      const connection = await mysql.createConnection(url);
      try {
        const isSelect = query.trim().toUpperCase().startsWith('SELECT');
        
        if (isSelect) {
          const [rows] = await connection.execute(query);
          result = { data: rows };
        } else {
          const [resultset] = await connection.execute(query);
          const affectedRows = (resultset as any).affectedRows;
          result = { data: { affectedRows } };
        }
      } finally {
        await connection.end();
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported database type' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('SQL execution error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}