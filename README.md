# Sweet Shop Management System

A full-stack Sweet Shop Management System built using **Node.js**, **Express**, and **React**.  
The application supports **role-based access** for admins and users, enabling inventory management, purchasing, and search functionality.

---

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Admin / User)

### Admin Capabilities
- Add new sweets to inventory
- Restock existing sweets
- Delete sweets from inventory

### User Capabilities
- View available sweets
- Search sweets by name, category, and price range
- Purchase sweets with real-time stock updates

### UI & UX
- Clean, centered layout with card-based sections
- Clear separation of admin and user actions
- Interactive feedback messages for actions
- Disabled actions with contextual hints (e.g., out of stock)

---

## Tech Stack

### Backend
- Node.js
- Express.js
- JWT Authentication
- Jest & Supertest (Testing)

### Frontend
- React
- Fetch API
- Inline styling for simplicity and clarity

---

## Project Structure

```text
sweet-shop/
├── backend/
│   ├── src/
│   │   ├── middleware/        # Authentication middleware
│   │   ├── routes/            # Auth and sweets routes
│   │   ├── tests/             # Jest & Supertest API tests
│   │   │   ├── auth.test.js
│   │   │   └── sweets.test.js
│   │   ├── app.js             # Express app configuration
│   │   ├── db.js              # SQLite database setup
│   │   └── server.js          # Server entry point
│   ├── sweetshop.db           # SQLite database
│   └── package.json
├── frontend/
│   └── sweetshop/
│       ├── src/
│       │   └── App.js         # Main React application
│       └── package.json
└── README.md
```


---

## Testing Approach

- Backend APIs are tested using **Jest** and **Supertest**
- Authentication workflows and sweets inventory operations are covered
- Tests validate both success and failure scenarios (e.g., out-of-stock purchase)
- Tests were added incrementally to validate core business logic

Run tests using:

```bash
cd backend
npm test
```
## Testing:

  <img width="894" height="475" alt="image" src="https://github.com/user-attachments/assets/d62204db-04bb-4b02-afe8-6c0442efa4f1" />

Run Backend using :

```bash
cd backend
node src/server.js
```

Run Frontend using:

```bash
cd frontend/sweetshop
npm start
```

## Login Screen

<img width="1296" height="1170" alt="image" src="https://github.com/user-attachments/assets/6d6323e9-f234-4c12-882b-4cd93090c84f" />

---

## Admin Console

<img width="1222" height="1857" alt="image" src="https://github.com/user-attachments/assets/637496ca-791b-4f9e-822f-a0ed08b6181f" />

---

## User Console

<img width="1253" height="1764" alt="image" src="https://github.com/user-attachments/assets/837fdadf-7eb7-4298-84bb-4bfbc4533f18" />




