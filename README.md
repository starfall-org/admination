# Database Visualizer

Một ứng dụng web hiện đại để kết nối và khám phá database một cách trực quan.

## ✨ Tính năng

- 🔗 **Kết nối đa database**: Hỗ trợ PostgreSQL, MySQL và Turso
- 🌐 **Đa ngôn ngữ**: Tiếng Việt và tiếng Anh
- 📊 **Visualization**: Hiển thị bảng và dữ liệu một cách trực quan
- 🎨 **Giao diện hiện đại**: Dark mode và responsive design
- ⚡ **Hiệu suất cao**: Built với Next.js và TypeScript

## 🚀 Cài đặt

```bash
# Clone repository
git clone <repository-url>

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 16 với App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Database Support**: PostgreSQL, MySQL, Turso

## 📱 Sử dụng

1. **Kết nối Database**: Nhập URL database của bạn
2. **Chọn loại Database**: PostgreSQL, MySQL hoặc Turso
3. **Khám phá dữ liệu**: Chọn bảng từ danh sách để xem dữ liệu
4. **Chuyển đổi ngôn ngữ**: Sử dụng selector ngôn ngữ ở góc trên

## 🗄️ Hỗ trợ Database

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

## 📦 Cấu trúc dự án

```
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Trang chủ
├── components/
│   ├── DatabaseViewer.tsx  # Giao diện chính
│   ├── LoginForm.tsx       # Form đăng nhập
│   ├── TableList.tsx       # Danh sách bảng
│   ├── DataTable.tsx       # Hiển thị dữ liệu bảng
│   ├── ConnectionInfo.tsx  # Thông tin kết nối
│   └── LanguageSelector.tsx # Chọn ngôn ngữ
├── lib/
│   ├── store.ts            # Zustand store
│   └── i18n.ts             # Hệ thống đa ngôn ngữ
└── public/                 # Static files
```

## 🎯 Tính năng sắp tới

- [ ] Kết nối thực tế với database
- [ ] Query editor
- [ ] Xuất dữ liệu (CSV, JSON)
- [ ] Quản lý schema
- [ ] Backup và restore

## 📄 License

MIT License
