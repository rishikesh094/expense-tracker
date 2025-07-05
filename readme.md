# 💸 Expense Tracker

A personal finance tracking web application that helps users manage their expenses and income. Users can securely log in, add transactions, filter by category/date, and view a pie chart summary.


---

## 🛠 Technologies Used
- React.js
- Node.js (Express)
- MongoDB
- JWT Authentication
- Tailwind CSS
- Chart.js

---

## 🚀 Setup Instructions
1. Clone the repository
2. Backend:
   - `cd backend`
   - `npm install`
   - Set up `.env` with MongoDB URI & JWT Secret
   - `npm start`
3. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm start`
4. Visit [http://localhost:3000](http://localhost:3000)

---

## ✨ Features
- User registration & login (JWT secured)
- Add, edit, delete transactions
- Filter by category & date
- Pie chart for expense breakdown
- Total income, expenses, and balance summary
- Fully responsive design

---


## 📊 ER Diagram

> This ER diagram shows the relationship between User and Transaction.

![ER Diagram](./docs/er-diagram.png)

---

## 🌐 API Endpoints
| Method | Route                   | Description                   |
|--------|-------------------------|-------------------------------|
| POST   | `/api/auth/register`    | Register a new user           |
| POST   | `/api/auth/login`       | Login user                    |
| GET    | `/api/auth/logout`      | Logout user                   |
| GET    | `/api/transactions`     | Get all user transactions     |
| POST   | `/api/transactions`     | Add a new transaction         |
| PUT    | `/api/transactions/:id` | Update a transaction          |
| DELETE | `/api/transactions/:id` | Delete a transaction          |

---

## 🎥 Demo Video
👉 [Watch Demo](https://your-demo-video-link.com)

---

## 🌐 Live App
👉 [https://your-deployment-link.com](https://your-deployment-link.com)
