import { create } from 'zustand';

export type Language = 'vi' | 'en';

export interface Translations {
  // Header
  databaseVisualizer: string;
  
  // Login
  connectDatabase: string;
  databaseUrl: string;
  databaseType: string;
  connecting: string;
  tryWithSampleUrl: string;
  supportedDatabases: string;
  
  // Database viewer
  selectTableToViewData: string;
  chooseTableFromList: string;
  tables: string;
  columns: string;
  rows: string;
  dataTable: string;
  
  // Table list
  noTables: string;
  
  // Database types
  postgresql: string;
  mysql: string;
  turso: string;
  
  // Actions
  disconnect: string;
  connected: string;
  loading: string;
}

interface I18nStore {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const translations: Record<Language, Translations> = {
  vi: {
    databaseVisualizer: 'Database Visualizer',
    connectDatabase: 'Kết nối Database',
    databaseUrl: 'Database URL',
    databaseType: 'Loại Database',
    connecting: 'Đang kết nối...',
    tryWithSampleUrl: 'Thử với URL mẫu:',
    supportedDatabases: 'Hỗ trợ PostgreSQL, MySQL và Turso',
    selectTableToViewData: 'Chọn một bảng để xem dữ liệu',
    chooseTableFromList: 'Chọn bảng từ danh sách bên trái để bắt đầu khám phá dữ liệu',
    tables: 'Bảng dữ liệu',
    columns: 'cột',
    rows: 'dòng',
    dataTable: 'Bảng dữ liệu',
    noTables: 'Không có bảng nào',
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    turso: 'Turso',
    disconnect: 'Ngắt kết nối',
    connected: 'Đã kết nối',
    loading: 'Đang tải...'
  },
  en: {
    databaseVisualizer: 'Database Visualizer',
    connectDatabase: 'Connect Database',
    databaseUrl: 'Database URL',
    databaseType: 'Database Type',
    connecting: 'Connecting...',
    tryWithSampleUrl: 'Try with sample URL:',
    supportedDatabases: 'Support PostgreSQL, MySQL and Turso',
    selectTableToViewData: 'Select a table to view data',
    chooseTableFromList: 'Select a table from the list on the left to start exploring data',
    tables: 'Data Tables',
    columns: 'columns',
    rows: 'rows',
    dataTable: 'Data Table',
    noTables: 'No tables found',
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    turso: 'Turso',
    disconnect: 'Disconnect',
    connected: 'Connected',
    loading: 'Loading...'
  }
};

export const useI18nStore = create<I18nStore>((set, get) => ({
  language: 'vi',
  translations: translations.vi,
  
  setLanguage: (lang: Language) => {
    set({ 
      language: lang, 
      translations: translations[lang] 
    });
  },
  
  t: (key: keyof Translations) => {
    const { language, translations } = get();
    return translations[key] || key;
  }
}));