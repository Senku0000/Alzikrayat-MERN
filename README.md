# Alzikrayat — MERN Edition

## Description
A full-stack photo sharing application rebuilt from Project 1/2 on the
complete MERN stack: a React (Vite) frontend consuming a hand-written
Express REST API, backed by MongoDB via Mongoose. No meta-frameworks
(Next.js/NestJS), no pre-built admin dashboards, no ORMs other than
Mongoose.

## Technologies
- **Frontend:** React 18 (Vite), React Router, Axios, hand-written CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose (schema validation)
- **Auth:** bcryptjs password hashing (basic auth, no JWT — see note below)
- **Other:** Joi (server-side validation), Multer (file uploads), CORS, dotenv

## Project Structure
```
alzikrayat-mern/
├── server/
│   ├── models/        User.js, Photo.js, Comment.js
│   ├── routes/        authRoutes.js, photoRoutes.js
│   ├── controllers/   authController.js, photoController.js, commentController.js
│   ├── middleware/    validation.js, errorHandler.js, upload.js
│   ├── uploads/       uploaded image files (created at runtime)
│   ├── .env.example   copy to .env and fill in your values
│   └── server.js      Express entry point
└── client/
    ├── src/
    │   ├── api/client.js        Axios instance
    │   ├── context/AuthContext.jsx
    │   ├── components/          Navbar, PhotoCard, GridToggle, LoginForm, RegisterForm, CommentForm
    │   ├── pages/                Home, Gallery, PhotoDetail, LoginRegister, Upload
    │   ├── App.jsx                Route configuration (React Router)
    │   └── main.jsx                Entry point
    ├── index.html
    └── vite.config.js             Dev proxy to the Express API
```

## Environment Variables (`server/.env`)
Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `PORT` | Port the Express API listens on (default `5000`) |

`.env` is listed in `.gitignore` and must **never** be committed.

---

## How to Run

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB** running locally (`mongod`) **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Install dependencies
From the project root, install both the server and client packages:
```bash
cd server && npm install
cd ../client && npm install
```
(Or, from the root folder, run `npm run install:all` if you keep the
root `package.json` provided.)

### 2. Configure the server's environment
```bash
cd server
cp .env.example .env
```
Open `.env` and set `MONGODB_URI`:
- Local MongoDB: `mongodb://127.0.0.1:27017/alzikrayat`
- Atlas: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/alzikrayat`

### 3. Start MongoDB (if running locally)
```bash
mongod
```
(Skip this step if you're using Atlas.)

### 4. Start the backend
```bash
cd server
npm run dev
```
You should see:
```
Connected to MongoDB
Alzikrayat API running on http://localhost:5000
```

### 5. Start the frontend (in a separate terminal)
```bash
cd client
npm run dev
```
Vite will print a local URL, typically:
```
http://localhost:5173
```

### 6. Open the app
Visit `http://localhost:5173` in your browser. The Vite dev server
proxies `/api/*` and `/uploads/*` requests to the Express backend on
port 5000 automatically (see `client/vite.config.js`), so no extra
CORS configuration is needed in development.

### Optional: run both with one command
If you keep the root `package.json`:
```bash
npm install          # installs "concurrently" at the root
npm run install:all  # installs server + client dependencies
npm run dev           # runs both server and client together
```

---

## REST API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | — |
| POST | `/api/auth/login` | Log in | — |
| GET | `/api/photos` | List all photos | — |
| GET | `/api/photos/:id` | Get one photo | — |
| POST | `/api/photos` | Upload a photo (multipart: `title`, `description`, `userId`, `photo` file) | logged-in `userId` |
| DELETE | `/api/photos/:id` | Delete a photo (body: `{ userId }`) | owner only |
| GET | `/api/photos/:id/comments` | List comments for a photo | — |
| POST | `/api/photos/:id/comments` | Add a comment (body: `{ userId, comment }`) | logged-in `userId` |

## Notes on Authentication
Per the Project 3 spec, this is **basic authentication only** — no
JWT, no protected-route middleware, no refresh tokens. The client
stores the logged-in user's public profile in React Context
(`AuthContext`) and `localStorage`; write endpoints trust the
`userId` the client sends with each request. JWT-based auth is listed
as an optional upgrade in the Bonus Project 4.

## Features Implemented
- Register / Login with bcrypt-hashed passwords; dynamic navbar ("Hi
  `<firstName>`" + Logout, or "Please Login")
- Home page with banner, description, and About Us section
- Gallery with grid/list toggle, fetched via `useEffect` + Axios
- Photo upload (Multer), detail view (`/photos/:id` via `useParams`),
  and ownership-checked deletion
- Commenting engine with immediate UI updates (no page reload)
- Server-side validation with Joi on every write endpoint
- Responsive, hand-written CSS (no external CSS framework dependency)

## Still To Do Before Submission
- Push to GitHub with meaningful commit history for both `/client`
  and `/server`.
- If deploying, note the live client and API URLs in this README.
