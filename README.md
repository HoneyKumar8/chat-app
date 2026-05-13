# Realtime Chat Application

A full-stack realtime chat application built using React.js, Node.js, Express.js, Socket.io, SQLite, and Sequelize.

---

## Live Demo

### Frontend
https://chat-app-beta-sandy-34.vercel.app

### Backend
https://chat-app-hm7c.onrender.com

---

## GitHub Repository

https://github.com/HoneyKumar8/chat-app

---

## Features

- User Authentication (JWT)
- Public Chat Rooms
- Direct Messaging
- Realtime Messaging with Socket.io
- Typing Indicators
- Online/Offline User Status
- Notifications
- Message Edit & Delete
- Read Receipts
- File Uploads
- Responsive UI
- Search Rooms & Users
- SQLite Database Integration

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- Socket.io
- Sequelize ORM
- SQLite

---

## Folder Structure

```bash
chat_app/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   ├── uploads/
│   ├── database.sqlite
│   └── package.json
│
└── README.md
```

---

## Installation & Setup

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Backend Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Frontend Environment Variables

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Realtime Features

- Room-based realtime messaging
- Direct messaging
- Typing indicators
- Online users
- Notifications
- Read receipts
- Realtime updates using Socket.io

---

## Database

SQLite database is used with Sequelize ORM.

### Main Tables

- Users
- Rooms
- Messages
- Conversations
- ConversationParticipants
- ReadReceipts

---

## Deployment

### Frontend Deployment
- Vercel

### Backend Deployment
- Render

---

## Future Improvements

- Emoji picker
- Voice messages
- Message reactions
- Better mobile responsiveness
- Persistent cloud database

---

## Author

Shyam Kumar