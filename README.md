# Feecon App

Feecon is a modern, full-stack web application designed to provide a seamless user experience for authentication, product browsing, and AI-powered features. The project is built with a robust backend (Node.js/Express) and a responsive frontend (Next.js/React), following best practices for security, scalability, and maintainability.

---

## Features

### 🔒 Authentication & Authorization

- Secure user registration and login with hashed passwords
- Session management using HTTP-only cookies (JWT-based)
- Protected routes for authenticated users
- Password reset and recovery via email

### 🛒 Product Management

- Browse products and categories
- RESTful API endpoints for products and categories

### 🤖 AI Integration

- Generate AI-powered text content via integrated endpoint

### 📬 Contact & Messaging

- Contact form with backend email delivery (Nodemailer)

### 🧑‍💼 User Profile

- View and update user profile information
- Role-based access control (user/admin)

### 💡 Additional Highlights

- Responsive UI with modern design
- Toast notifications for user feedback
- Environment-based configuration for easy deployment
- Error handling and loading states throughout the app

---

## Tech Stack

- **Frontend:** Next.js, React, Axios, React Context API
- **Backend:** Node.js, Express, MongoDB, JWT, Nodemailer
- **Styling:** CSS Modules, Tailwind CSS (or similar)
- **Testing:** Jest (optional)
- **Deployment:** Easily deployable to Vercel, Heroku, or any cloud provider

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/feecon-app.git
cd feecon-app
```

### 2. Setup Environment Variables

#### Backend (`backend/.env`)

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL=your_email@example.com
PASSWORD=your_email_app_password
CLIENT_URL=http://localhost:3000
```

#### Frontend (`client/.env.local`)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 3. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 4. Run the Application

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm run dev
```

---

## Folder Structure

```
feecon-app/
│
├── backend/         # Express API server
│   ├── controllers/
│   ├── models/
│   ├── routers/
│   ├── utils/
│   └── ...
│
├── client/          # Next.js frontend
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── styles/
│   └── ...
│
└── README.md
```

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please contact [mail2feeconbehera@gmail.com](mailto:mail2feeconbehera@gmail.com).
