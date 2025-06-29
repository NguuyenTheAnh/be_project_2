# Restaurant Table Ordering System - Backend API

Hệ thống API backend cho ứng dụng đặt đồ ăn tại bàn nhà hàng, được xây dựng bằng NestJS và TypeORM.

## 🚀 Tổng quan dự án

Đây là hệ thống backend cho một ứng dụng đặt đồ ăn tại bàn nhà hàng. Hệ thống cho phép khách hàng đặt món ăn trực tiếp tại bàn mà không cần gọi nhân viên, đồng thời cung cấp các tính năng quản lý cho nhà hàng.

## 🛠️ Công nghệ sử dụng

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT + Passport
- **Language**: TypeScript
- **Runtime**: Node.js

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 16
- PostgreSQL
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình môi trường
Tạo file `.env` với các biến sau:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=restaurant_db
DB_SYNC=true
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## 🚀 Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## 🏗️ Kiến trúc dự án

### Core Modules

#### 1. **Authentication & Authorization**
- **JWT Authentication**: Xác thực người dùng admin
- **Guest Authentication**: Hệ thống xác thực riêng cho khách hàng
- **Guards**: Bảo vệ các endpoint quan trọng

#### 2. **Restaurant Management**
- **Table Module**: Quản lý bàn ăn
  - Tạo, cập nhật, xóa bàn
  - Theo dõi trạng thái bàn (Available/Unavailable)
  - Quản lý trạng thái thanh toán (Paid/Unpaid)
  - Phân trang và tìm kiếm

- **Dish Module**: Quản lý món ăn
  - CRUD operations cho món ăn
  - Phân loại món (Chicken/Water)
  - Quản lý trạng thái món ăn
  - Upload và quản lý hình ảnh
  - Tìm kiếm và lọc món ăn

#### 3. **Order Management**
- **Order Module**: Xử lý đơn hàng
  - Tạo đơn hàng mới
  - Theo dõi trạng thái đơn (Pending/Completed)
  - Lịch sử đơn hàng

- **Cart Module**: Giỏ hàng
  - Tạo giỏ hàng cho khách
  - Quản lý session giỏ hàng

- **Cart Item Module**: Chi tiết giỏ hàng
  - Thêm/xóa/cập nhật món trong giỏ
  - Quản lý số lượng

#### 4. **Customer Management**
- **Guest Module**: Quản lý khách hàng
  - Đăng ký khách tạm thời
  - Liên kết với bàn ăn
  - Xem menu và đặt món

- **Account Module**: Quản lý tài khoản admin
  - Đăng ký/đăng nhập admin
  - Quản lý thông tin tài khoản

#### 5. **Payment & Transaction**
- **Transaction Module**: Xử lý giao dịch
  - Lưu trữ lịch sử thanh toán
  - Theo dõi doanh thu

### Database Schema

#### Entities chính:
- **Table**: Thông tin bàn ăn (ID, tên, sức chứa, trạng thái)
- **Dish**: Món ăn (ID, tên, giá, mô tả, hình ảnh, danh mục)
- **Guest**: Khách hàng (liên kết với bàn)
- **Order**: Đơn hàng
- **Cart**: Giỏ hàng
- **CartItem**: Chi tiết giỏ hàng (món ăn + số lượng)
- **Transaction**: Giao dịch thanh toán

## 🔐 API Authentication

### Admin Authentication
- **POST** `/auth/login` - Đăng nhập admin
- **POST** `/auth/register` - Đăng ký admin
- **GET** `/auth/refresh` - Làm mới token

### Guest Authentication
- Hệ thống riêng cho khách hàng tại bàn
- Không yêu cầu đăng ký phức tạp

## 📁 File Upload

Hệ thống hỗ trợ upload hình ảnh món ăn:
- **File Module**: Xử lý upload file
- **Static Assets**: Phục vụ hình ảnh từ thư mục `public/`
- **Multer Configuration**: Cấu hình upload file

## 🛡️ Security Features

- **Global Guards**: Bảo vệ toàn bộ API
- **Validation Pipes**: Validate dữ liệu đầu vào
- **Transform Interceptor**: Chuẩn hóa response
- **CORS**: Cấu hình Cross-Origin Resource Sharing
- **Cookie Parser**: Xử lý cookie cho authentication

## 📊 API Features

- **Pagination**: Phân trang cho tất cả danh sách
- **Filtering**: Lọc theo nhiều tiêu chí
- **Sorting**: Sắp xếp dữ liệu
- **Search**: Tìm kiếm theo từ khóa
- **Standardized Response**: Chuẩn hóa format response

## 🎯 Workflow hoạt động

1. **Khách hàng vào bàn**: Quét QR code hoặc nhập mã bàn
2. **Xem menu**: Browse danh sách món ăn với hình ảnh
3. **Thêm vào giỏ**: Chọn món và số lượng
4. **Đặt hàng**: Xác nhận đơn hàng
5. **Theo dõi**: Xem trạng thái đơn hàng
6. **Thanh toán**: Thực hiện thanh toán

## 🔧 Development

### Cấu trúc thư mục
```
src/
├── auth/                 # Authentication module
├── config/              # Database & app configuration
├── core/                # Core interceptors
├── decorator/           # Custom decorators
├── file/                # File upload module
├── helper/              # Utility helpers
└── modules/             # Business modules
    ├── account/         # Admin account management
    ├── cart/            # Shopping cart
    ├── cart-item/       # Cart items
    ├── dish/            # Menu items
    ├── guest/           # Guest management
    ├── order/           # Order processing
    ├── table/           # Table management
    └── transaction/     # Payment transactions
```

### Scripts có sẵn
```bash
npm run build          # Build production
npm run start          # Start production
npm run dev           # Development with watch
npm run lint          # Run ESLint
npm run test          # Run tests
npm run test:watch    # Watch mode tests
```

## 📝 API Documentation

API endpoints được tổ chức theo modules:

- `/auth/*` - Authentication endpoints
- `/table/*` - Table management
- `/dish/*` - Menu management  
- `/order/*` - Order processing
- `/cart/*` - Shopping cart
- `/guest/*` - Guest management
- `/transaction/*` - Payment processing

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

Dự án này thuộc quyền sở hữu riêng tư (UNLICENSED).

---

**Developed with ❤️ using NestJS**