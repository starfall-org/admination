# Database Visualizer

A modern web application to connect and explore databases visually with full CRUD capabilities.

## ✨ Features

- 🔗 **Multi-Database Connection**: Support for PostgreSQL, MySQL, and Turso
- 🌐 **Multi-Language**: Vietnamese and English
- 📊 **Visualization**: Display tables and data visually
- ✏️ **Full CRUD Operations**: Create, Read, Update, Delete data directly in the interface
- 🔄 **Inline Editing**: Edit data directly in table cells with instant feedback
- ➕ **Add New Rows**: Add new records to any table
- 🗑️ **Delete Records**: Remove data with confirmation
- 💾 **Session Persistence**: Automatic login session caching
- 🎨 **Modern Interface**: Dark mode and responsive design
- ⚡ **High Performance**: Built with Next.js and TypeScript

## 🚀 Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🛠️ Technologies Used

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Database Support**: PostgreSQL, MySQL, Turso

## 📱 Usage

### Basic Operations
1. **Connect Database**: Enter your database URL and select database type
2. **Browse Tables**: Select tables from the sidebar to view data
3. **View Data**: Browse through table contents in a clean, organized format

### Data Editing
1. **Edit Existing Data**:
   - Click on any cell to start editing
   - Press Enter to save or Escape to cancel
   - Use the action buttons for more complex operations

2. **Add New Records**:
   - Click the "Thêm dòng" button in the table header
   - Fill in the new row data
   - Save or cancel as needed

3. **Delete Records**:
   - Click the "Xóa" button in the row actions
   - Confirm deletion in the popup dialog

4. **Row Actions**:
   - **Sửa**: Start editing the row
   - **Lưu**: Save changes (when editing)
   - **Hủy**: Cancel editing (when editing)
   - **Xóa**: Delete the record

### Session Management
- **Auto-save**: Login sessions are automatically cached
- **Persistent State**: Table selections and data are remembered
- **Clear Session**: Disconnect to clear all cached data

## 🗄️ Database Support

### PostgreSQL
```
postgresql://username:password@localhost:5432/database_name
```

### MySQL
```
mysql://username:password@localhost:3306/database_name
```

### Turso
```
libsql://username:password@your-db.turso.io
```

## 📦 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── DatabaseViewer.tsx  # Main interface
│   ├── LoginForm.tsx       # Login form
│   ├── TableList.tsx       # Table list
│   ├── DataTable.tsx       # Table data display with CRUD
│   ├── ConnectionInfo.tsx  # Connection information
│   ├── LanguageSelector.tsx # Language selector
│   ├── InlineEditCell.tsx  # Inline editing component
│   └── RowActions.tsx      # Row action buttons
├── lib/
│   ├── store.ts            # Zustand store with CRUD state
│   └── i18n.ts             # Internationalization system
└── public/                 # Static files
```

## 🎯 Key Features Implemented

### ✅ Completed Features
- [x] **Real database connection** - Full support for PostgreSQL, MySQL, Turso
- [x] **Inline data editing** - Click any cell to edit
- [x] **CRUD operations** - Create, Read, Update, Delete functionality
- [x] **Session persistence** - Automatic login and state caching
- [x] **Responsive design** - Works on desktop and mobile
- [x] **Multi-language support** - Vietnamese and English
- [x] **Modern UI** - Dark mode and professional interface
- [x] **Row management** - Add, edit, delete with confirmations
- [x] **Data validation** - Type-aware input validation

### 🔄 Advanced Features
- **Auto-save**: Changes are automatically saved
- **Keyboard shortcuts**: Enter to save, Escape to cancel
- **Visual feedback**: Editing states clearly indicated
- **Error handling**: Graceful error management
- **Loading states**: Visual feedback during operations

## 📄 License

MIT License
