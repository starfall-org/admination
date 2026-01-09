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

export interface EditingRow {
  rowIndex: number;
  originalData: any;
  editedData: any;
  isNew?: boolean;
}

const STORAGE_KEYS = {
  CONNECTION: 'database_connection',
  TABLES: 'database_tables',
  SELECTED_TABLE: 'selected_table'
};

// Helper function to get translated error messages
const getErrorMessage = (key: string, fallback: string): string => {
  // Simple fallback - in a real app you'd integrate with i18n system
  const translations: Record<string, string> = {
    'connectionFailed': 'Không thể kết nối database',
    'loadTablesFailed': 'Không thể tải dữ liệu bảng',
    'saveFailed': 'Không thể lưu dữ liệu',
    'deleteFailed': 'Không thể xóa dữ liệu'
  };
  
  return translations[key] || fallback;
};

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
  
  // Editing state
  editingRows: EditingRow[];
  isEditMode: boolean;
  
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
  loadTableData: (tableName: string) => Promise<void>;
  
  // Editing actions
  setEditMode: (enabled: boolean) => void;
  startEditing: (rowIndex: number, isNew?: boolean) => void;
  cancelEditing: (rowIndex: number) => void;
  saveEditing: (rowIndex: number) => Promise<void>;
  updateEditingValue: (rowIndex: number, columnName: string, value: any) => void;
  deleteRow: (rowIndex: number) => Promise<void>;
  addNewRow: () => void;
  getCurrentTableData: () => Table | null;
}

// Helper functions for localStorage
const getStoredConnection = (): DatabaseConnection | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONNECTION);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredTables = (): Table[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TABLES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredSelectedTable = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_TABLE);
  } catch {
    return null;
  }
};

const setStoredConnection = (connection: DatabaseConnection | null) => {
  if (typeof window === 'undefined') return;
  
  try {
    if (connection) {
      localStorage.setItem(STORAGE_KEYS.CONNECTION, JSON.stringify(connection));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CONNECTION);
    }
  } catch {
    // Ignore localStorage errors
  }
};

const setStoredTables = (tables: Table[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  } catch {
    // Ignore localStorage errors
  }
};

const setStoredSelectedTable = (tableName: string | null) => {
  if (typeof window === 'undefined') return;
  
  try {
    if (tableName) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_TABLE, tableName);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_TABLE);
    }
  } catch {
    // Ignore localStorage errors
  }
};

export const useDatabaseStore = create<DatabaseStore>((set, get) => ({
  // Initial state - load from localStorage if available
  connection: getStoredConnection(),
  isConnecting: false,
  connectionError: null,
  tables: getStoredTables(),
  selectedTable: getStoredSelectedTable(),
  isLoading: false,
  error: null,
  editingRows: [],
  isEditMode: false,
  
  // Actions
  setConnection: (connection) => {
    set({ connection });
    setStoredConnection(connection);
  },
  
  setTables: (tables) => {
    set({ tables });
    setStoredTables(tables);
  },
  
  setSelectedTable: (tableName) => {
    set({ selectedTable: tableName });
    setStoredSelectedTable(tableName);
  },
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setConnectionError: (error) => set({ connectionError: error }),
  
  connect: async (url: string, type: DatabaseConnection['type']) => {
    set({ isConnecting: true, connectionError: null });
    
    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, type }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Connection failed');
      }

      const connection: DatabaseConnection = {
        url,
        type,
        connected: true
      };
      
      set({ connection, isConnecting: false });
      setStoredConnection(connection);
    } catch (error) {
      set({
        connectionError: error instanceof Error ? error.message : getErrorMessage('connectionFailed', 'Không thể kết nối database'),
        isConnecting: false
      });
    }
  },
  
  disconnect: () => {
    set({
      connection: null,
      tables: [],
      selectedTable: null,
      connectionError: null,
      editingRows: [],
      isEditMode: false
    });
    // Clear localStorage
    setStoredConnection(null);
    setStoredTables([]);
    setStoredSelectedTable(null);
  },
  
  loadTables: async () => {
    const { connection } = get();
    if (!connection) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: connection.url, type: connection.type }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load tables');
      }

      // Transform the data to match our Table interface
      const tables: Table[] = result.tables.map((table: any) => ({
        name: table.name,
        columns: table.columns,
        rows: table.rows
      }));
      
      set({ tables, isLoading: false });
      setStoredTables(tables);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : getErrorMessage('loadTablesFailed', 'Không thể tải dữ liệu bảng'),
        isLoading: false
      });
    }
  },
  
  loadTableData: async (tableName: string) => {
    const { connection, tables } = get();
    if (!connection) return;
    
    const tableIndex = tables.findIndex(t => t.name === tableName);
    if (tableIndex === -1) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/tables/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: connection.url, 
          type: connection.type,
          tableName
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load table data');
      }

      const newTables = [...tables];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        rows: result.data || []
      };
      
      set({ tables: newTables, isLoading: false });
      setStoredTables(newTables);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : getErrorMessage('loadTablesFailed', 'Không thể tải dữ liệu bảng'),
        isLoading: false
      });
    }
  },
  
  // Editing actions
  setEditMode: (enabled) => set({ isEditMode: enabled }),
  
  startEditing: (rowIndex: number, isNew = false) => {
    const { tables, selectedTable, editingRows } = get();
    const table = tables.find(t => t.name === selectedTable);
    
    if (!table) return;
    
    const existingEditing = editingRows.find(e => e.rowIndex === rowIndex);
    if (existingEditing) return;
    
    const rowData = isNew ?
      {} :
      { ...table.rows[rowIndex] };
    
    const newEditingRow: EditingRow = {
      rowIndex,
      originalData: isNew ? null : { ...table.rows[rowIndex] },
      editedData: { ...rowData },
      isNew
    };
    
    set({
      editingRows: [...editingRows, newEditingRow],
      isEditMode: true
    });
  },
  
  cancelEditing: (rowIndex: number) => {
    const { editingRows } = get();
    const newEditingRows = editingRows.filter(e => e.rowIndex !== rowIndex);
    
    set({
      editingRows: newEditingRows,
      isEditMode: newEditingRows.length > 0
    });
  },
  
  saveEditing: async (rowIndex: number) => {
    const { connection, tables, selectedTable, editingRows } = get();
    const editingRow = editingRows.find(e => e.rowIndex === rowIndex);
    
    if (!editingRow || !selectedTable || !connection) return;
    
    try {
      const action = editingRow.isNew ? 'CREATE' : 'UPDATE';
      
      // Build where clause for update operations
      let whereClause = '';
      let whereParams: any[] = [];
      
      if (!editingRow.isNew) {
        // For updates, we need to identify the row by its original data
        const primaryKey = Object.keys(editingRow.originalData)[0]; // Assuming first column is primary key
        whereClause = `${primaryKey} = ?`;
        whereParams = [editingRow.originalData[primaryKey]];
      }

      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          url: connection.url,
          type: connection.type,
          tableName: selectedTable,
          data: editingRow.editedData,
          whereClause,
          whereParams
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Save failed');
      }

      const tableIndex = tables.findIndex(t => t.name === selectedTable);
      if (tableIndex === -1) return;
      
      const newTables = [...tables];
      
      if (editingRow.isNew) {
        // Add new row with the result from database
        newTables[tableIndex].rows.push(editingRow.editedData);
      } else {
        // Update existing row
        newTables[tableIndex].rows[rowIndex] = { ...editingRow.editedData };
      }
      
      set({
        tables: newTables,
        editingRows: editingRows.filter(e => e.rowIndex !== rowIndex),
        isEditMode: editingRows.filter(e => e.rowIndex !== rowIndex).length > 0
      });
      setStoredTables(newTables);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : getErrorMessage('saveFailed', 'Không thể lưu dữ liệu') });
    }
  },
  
  updateEditingValue: (rowIndex: number, columnName: string, value: any) => {
    const { editingRows } = get();
    const editingRowIndex = editingRows.findIndex(e => e.rowIndex === rowIndex);
    
    if (editingRowIndex === -1) return;
    
    const newEditingRows = [...editingRows];
    newEditingRows[editingRowIndex] = {
      ...newEditingRows[editingRowIndex],
      editedData: {
        ...newEditingRows[editingRowIndex].editedData,
        [columnName]: value
      }
    };
    
    set({ editingRows: newEditingRows });
  },
  
  deleteRow: async (rowIndex: number) => {
    const { connection, tables, selectedTable } = get();
    if (!selectedTable || !connection) return;
    
    try {
      // Get the row data to identify it for deletion
      const table = tables.find(t => t.name === selectedTable);
      if (!table || !table.rows[rowIndex]) return;
      
      const rowData = table.rows[rowIndex];
      
      // Build where clause to identify the row
      const primaryKey = Object.keys(rowData)[0]; // Assuming first column is primary key
      const whereClause = `${primaryKey} = ?`;
      const whereParams = [rowData[primaryKey]];

      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'DELETE',
          url: connection.url,
          type: connection.type,
          tableName: selectedTable,
          data: {},
          whereClause,
          whereParams
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Delete failed');
      }
      
      const tableIndex = tables.findIndex(t => t.name === selectedTable);
      if (tableIndex === -1) return;
      
      const newTables = [...tables];
      newTables[tableIndex].rows = newTables[tableIndex].rows.filter((_, index) => index !== rowIndex);
      
      // Remove from editing if exists
      const { editingRows } = get();
      const newEditingRows = editingRows.filter(e => e.rowIndex !== rowIndex);
      
      set({
        tables: newTables,
        editingRows: newEditingRows,
        isEditMode: newEditingRows.length > 0
      });
      setStoredTables(newTables);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : getErrorMessage('deleteFailed', 'Không thể xóa dữ liệu') });
    }
  },
  
  addNewRow: () => {
    const { tables, selectedTable } = get();
    if (!selectedTable) return;
    
    const table = tables.find(t => t.name === selectedTable);
    if (!table) return;
    
    const newRowIndex = table.rows.length;
    const emptyRow: Record<string, any> = {};
    
    // Initialize empty values for each column
    table.columns.forEach(column => {
      emptyRow[column.name] = '';
    });
    
    const { editingRows } = get();
    const newEditingRow: EditingRow = {
      rowIndex: newRowIndex,
      originalData: null,
      editedData: emptyRow,
      isNew: true
    };
    
    set({
      editingRows: [...editingRows, newEditingRow],
      isEditMode: true
    });
  },
  
  getCurrentTableData: () => {
    const { tables, selectedTable } = get();
    return tables.find(t => t.name === selectedTable) || null;
  }
}));