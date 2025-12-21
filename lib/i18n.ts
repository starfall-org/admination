import { create } from 'zustand';

export type Language = 'vi' | 'en';

export interface Translations {
  // Header
  admination: string;
  
  // Login
  loginSubtitle: string;
  databaseUrlPlaceholder: string;
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
  
  // CRUD Operations
  addRow: string;
  edit: string;
  save: string;
  cancel: string;
  delete: string;
  confirmDelete: string;
  deleteConfirm: string;
  deleteCancel: string;
  exportCsv: string;
  refresh: string;
  
  // Editing states
  editing: string;
  editMode: string;
  clickToEdit: string;
  saving: string;
  saved: string;
  
  // Data display
  noData: string;
  noColumns: string;
  nullValue: string;
  showingRows: string;
  rowsWithNew: string;
  
  // Messages
  editRowsCount: string;
  connectionFailed: string;
  loadTablesFailed: string;
  saveFailed: string;
  deleteFailed: string;
  noTableSelected: string;
  
  // Status
  rowsEditing: string;
  addNewRow: string;
  viewData: string;
  exportData: string;
  refreshData: string;
  
  // Table header
  actions: string;
  
  // Table management
  manageTables: string;
  createTable: string;
  editTable: string;
  deleteTable: string;
  tableName: string;
  columnName: string;
  columnType: string;
  nullable: string;
  primaryKey: string;
  addColumn: string;
  removeColumn: string;
  saveTable: string;
  cancelTable: string;
  confirmDeleteTable: string;
  deleteTableWarning: string;
  tableCreated: string;
  tableUpdated: string;
  tableDeleted: string;
  
  // Column types
  typeInteger: string;
  typeVarchar: string;
  typeText: string;
  typeBoolean: string;
  typeDecimal: string;
  typeDate: string;
  typeTimestamp: string;
  
  // Theme
  lightTheme: string;
  darkTheme: string;
  switchToLight: string;
  switchToDark: string;
  
  // SQL Shell
  sqlShell: string;
  openSqlShell: string;
  executeQuery: string;
  executing: string;
  clearHistory: string;
  noQueriesExecuted: string;
  queryPlaceholder: string;
  pressCtrlEnter: string;
  pressTab: string;
  error: string;
  queryHistory: string;
  showingResults: string;
  rowsAffected: string;
}

interface I18nStore {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const translations: Record<Language, Translations> = {
  vi: {
    admination: 'admination',
    loginSubtitle: 'Kết nối và khám phá database của bạn',
    databaseUrlPlaceholder: 'Nhập database URL của bạn...',
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
    loading: 'Đang tải...',
    addRow: 'Thêm dòng',
    edit: 'Sửa',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    confirmDelete: 'Xác nhận xóa',
    deleteConfirm: 'Xóa',
    deleteCancel: 'Hủy',
    exportCsv: 'Xuất CSV',
    refresh: 'Làm mới',
    editing: 'Đang chỉnh sửa',
    editMode: 'Chế độ chỉnh sửa',
    clickToEdit: 'Click để chỉnh sửa',
    saving: 'Đang lưu...',
    saved: 'Đã lưu',
    noData: 'Không có dữ liệu',
    noColumns: 'Không có cột dữ liệu',
    nullValue: 'NULL',
    showingRows: 'Hiển thị',
    rowsWithNew: 'mới',
    editRowsCount: 'dòng đang chỉnh sửa',
    connectionFailed: 'Không thể kết nối database',
    loadTablesFailed: 'Không thể tải dữ liệu bảng',
    saveFailed: 'Không thể lưu dữ liệu',
    deleteFailed: 'Không thể xóa dữ liệu',
    noTableSelected: 'Không có bảng được chọn',
    rowsEditing: 'Có',
    addNewRow: 'Thêm dòng mới',
    viewData: 'Xem dữ liệu',
    exportData: 'Xuất dữ liệu',
    refreshData: 'Làm mới dữ liệu',
    actions: 'Hành động',
    manageTables: 'Quản lý bảng',
    createTable: 'Tạo bảng mới',
    editTable: 'Chỉnh sửa bảng',
    deleteTable: 'Xóa bảng',
    tableName: 'Tên bảng',
    columnName: 'Tên cột',
    columnType: 'Kiểu dữ liệu',
    nullable: 'Cho phép NULL',
    primaryKey: 'Khóa chính',
    addColumn: 'Thêm cột',
    removeColumn: 'Xóa cột',
    saveTable: 'Lưu bảng',
    cancelTable: 'Hủy',
    confirmDeleteTable: 'Xác nhận xóa bảng',
    deleteTableWarning: 'Bạn có chắc chắn muốn xóa bảng này? Hành động này không thể hoàn tác.',
    tableCreated: 'Đã tạo bảng thành công',
    tableUpdated: 'Đã cập nhật bảng thành công',
    tableDeleted: 'Đã xóa bảng thành công',
    typeInteger: 'Số nguyên',
    typeVarchar: 'Chuỗi ký tự',
    typeText: 'Văn bản',
    typeBoolean: 'Boolean',
    typeDecimal: 'Số thập phân',
    typeDate: 'Ngày',
    typeTimestamp: 'Ngày giờ',
    
    // Theme
    lightTheme: 'Sáng',
    darkTheme: 'Tối',
    switchToLight: 'Chuyển sang chế độ sáng',
    switchToDark: 'Chuyển sang chế độ tối',
    
    // SQL Shell
    sqlShell: 'SQL Shell',
    openSqlShell: 'Mở SQL Shell',
    executeQuery: 'Thực thi',
    executing: 'Đang thực thi...',
    clearHistory: 'Xóa lịch sử',
    noQueriesExecuted: 'Chưa có query nào được thực thi',
    queryPlaceholder: 'Nhập câu lệnh SQL... (Ctrl+↑/↓ để xem lịch sử, Tab để tự động hoàn thành)',
    pressCtrlEnter: 'Nhấn Ctrl+Enter để thực thi',
    pressTab: 'Tab để tự động hoàn thành',
    error: 'Lỗi',
    queryHistory: 'Lịch sử query',
    showingResults: 'Hiển thị kết quả',
    rowsAffected: 'dòng bị ảnh hưởng'
  },
  en: {
    admination: 'admination',
    loginSubtitle: 'Connect and explore your database',
    databaseUrlPlaceholder: 'Enter your database URL...',
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
    loading: 'Loading...',
    addRow: 'Add Row',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmDelete: 'Confirm Delete',
    deleteConfirm: 'Delete',
    deleteCancel: 'Cancel',
    exportCsv: 'Export CSV',
    refresh: 'Refresh',
    editing: 'Editing',
    editMode: 'Edit Mode',
    clickToEdit: 'Click to edit',
    saving: 'Saving...',
    saved: 'Saved',
    noData: 'No data',
    noColumns: 'No columns data',
    nullValue: 'NULL',
    showingRows: 'Showing',
    rowsWithNew: 'new',
    editRowsCount: 'rows editing',
    connectionFailed: 'Cannot connect to database',
    loadTablesFailed: 'Cannot load table data',
    saveFailed: 'Cannot save data',
    deleteFailed: 'Cannot delete data',
    noTableSelected: 'No table selected',
    rowsEditing: 'There are',
    addNewRow: 'Add New Row',
    viewData: 'View Data',
    exportData: 'Export Data',
    refreshData: 'Refresh Data',
    actions: 'Actions',
    manageTables: 'Manage Tables',
    createTable: 'Create Table',
    editTable: 'Edit Table',
    deleteTable: 'Delete Table',
    tableName: 'Table Name',
    columnName: 'Column Name',
    columnType: 'Data Type',
    nullable: 'Nullable',
    primaryKey: 'Primary Key',
    addColumn: 'Add Column',
    removeColumn: 'Remove Column',
    saveTable: 'Save Table',
    cancelTable: 'Cancel',
    confirmDeleteTable: 'Confirm Delete Table',
    deleteTableWarning: 'Are you sure you want to delete this table? This action cannot be undone.',
    tableCreated: 'Table created successfully',
    tableUpdated: 'Table updated successfully',
    tableDeleted: 'Table deleted successfully',
    typeInteger: 'Integer',
    typeVarchar: 'Varchar',
    typeText: 'Text',
    typeBoolean: 'Boolean',
    typeDecimal: 'Decimal',
    typeDate: 'Date',
    typeTimestamp: 'Timestamp',
    
    // Theme
    lightTheme: 'Light',
    darkTheme: 'Dark',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    
    // SQL Shell
    sqlShell: 'SQL Shell',
    openSqlShell: 'Open SQL Shell',
    executeQuery: 'Execute',
    executing: 'Executing...',
    clearHistory: 'Clear History',
    noQueriesExecuted: 'No queries executed yet',
    queryPlaceholder: 'Enter SQL query... (Ctrl+↑/↓ for history, Tab for autocomplete)',
    pressCtrlEnter: 'Press Ctrl+Enter to execute',
    pressTab: 'Tab for autocomplete',
    error: 'Error',
    queryHistory: 'Query History',
    showingResults: 'Showing results',
    rowsAffected: 'rows affected'
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