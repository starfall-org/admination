import { create } from 'zustand';

export interface DatabaseConnection {
  url: string;
  type: 'postgresql' | 'mysql' | 'turso';
  connected: boolean;
}

export interface Table {
  name: string;
  columns: Column[];
  rows: any[];
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

interface DatabaseStore {
  // Connection state
  connection: DatabaseConnection | null;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Database structure
  tables: Table[];
  selectedTable: string | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setConnection: (connection: DatabaseConnection) => void;
  setTables: (tables: Table[]) => void;
  setSelectedTable: (tableName: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConnectionError: (error: string | null) => void;
  connect: (url: string, type: DatabaseConnection['type']) => Promise<void>;
  disconnect: () => void;
  loadTables: () => Promise<void>;
}

export const useDatabaseStore = create<DatabaseStore>((set, get) => ({
  // Initial state
  connection: null,
  isConnecting: false,
  connectionError: null,
  tables: [],
  selectedTable: null,
  isLoading: false,
  error: null,
  
  // Actions
  setConnection: (connection) => set({ connection }),
  
  setTables: (tables) => set({ tables }),
  
  setSelectedTable: (tableName) => set({ selectedTable: tableName }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setConnectionError: (error) => set({ connectionError: error }),
  
  connect: async (url: string, type: DatabaseConnection['type']) => {
    set({ isConnecting: true, connectionError: null });
    
    try {
      // Simulate connection validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const connection: DatabaseConnection = {
        url,
        type,
        connected: true
      };
      
      set({ connection, isConnecting: false });
    } catch (error) {
      set({ 
        connectionError: 'Không thể kết nối database', 
        isConnecting: false 
      });
    }
  },
  
  disconnect: () => {
    set({ 
      connection: null, 
      tables: [], 
      selectedTable: null,
      connectionError: null 
    });
  },
  
  loadTables: async () => {
    const { connection } = get();
    if (!connection) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Simulate loading tables - trong thực tế sẽ gọi API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTables: Table[] = [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'INTEGER', nullable: false },
            { name: 'username', type: 'VARCHAR(50)', nullable: false },
            { name: 'email', type: 'VARCHAR(100)', nullable: false },
            { name: 'created_at', type: 'TIMESTAMP', nullable: false }
          ],
          rows: [
            { id: 1, username: 'admin', email: 'admin@example.com', created_at: '2024-01-01 10:00:00' },
            { id: 2, username: 'user1', email: 'user1@example.com', created_at: '2024-01-02 11:30:00' }
          ]
        },
        {
          name: 'products',
          columns: [
            { name: 'id', type: 'INTEGER', nullable: false },
            { name: 'name', type: 'VARCHAR(200)', nullable: false },
            { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
            { name: 'stock', type: 'INTEGER', nullable: true }
          ],
          rows: [
            { id: 1, name: 'Laptop', price: 999.99, stock: 50 },
            { id: 2, name: 'Mouse', price: 29.99, stock: 200 }
          ]
        }
      ];
      
      set({ tables: mockTables, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Không thể tải dữ liệu bảng', 
        isLoading: false 
      });
    }
  }
}));