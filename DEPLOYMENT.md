# Smart Hospital Management System - Deployment Guide

This guide covers how to deploy the **Hospital Management System** to production using **Render** (Backend), **MongoDB Atlas** (Database), and **Vercel** (Frontend).

## Prerequisites

- GitHub Account
- [Render Account](https://render.com)
- [Vercel Account](https://vercel.com)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)

---

## 1. Database Setup (MongoDB Atlas)

1.  Log in to MongoDB Atlas and create a new **Cluster** (Shared/Free Tier is fine).
2.  Go to **Database Access** -> Create a new user (e.g., `admin`). **Remember the password**.
3.  Go to **Network Access** -> Add IP Address -> Allow Access from Anywhere (`0.0.0.0/0`).
4.  Go to **Database** -> Connect -> Drivers -> Copy the connection string.
    *   It looks like: `mongodb+srv://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<password>` with your actual password.

---

## 2. Backend Deployment (Render)

1.  Push your code to **GitHub**.
2.  Log in to **Render** and click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name:** `hospital-backend`
    *   **Root Directory:** `backend` (Important!)
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
5.  Scroll down to **Environment Variables** and add:
    *   `MONGO_URI`: Your MongoDB connection string from Step 1.
    *   `JWT_SECRET`: A long, random string (e.g., `mysecretkey12345`).
    *   `PORT`: `5000` (Render might override this, but good to have).
6.  Click **Create Web Service**.
7.  Wait for deployment. Once done, copy the **URL** (e.g., `https://hospital-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1.  Log in to **Vercel** and click **Add New** -> **Project**.
2.  Import your GitHub repository.
3.  Configure the project:
    *   **Framework Preset:** Vite
    *   **Root Directory:** `frontend` (Click Edit to select the frontend folder).
4.  Open **Environment Variables** and add:
    *   `VITE_API_URL`: The Backend URL from Step 2 (e.g., `https://hospital-backend.onrender.com`).
        *   **Note:** Do NOT add a trailing slash `/`.
5.  Click **Deploy**.

---

## 4. Final Validation

1.  Open your Vercel URL.
2.  Register a new account (Admin/Patient).
3.  Check if data persists (refresh page).
4.  Verify that API calls are going to your Render backend (Check Network Tab).

## Troubleshooting

-   **CORS Error:** If you get CORS errors, you might need to update `backend/server.js` to allow the Vercel domain in the `cors` configuration.
    *   Update `backend/server.js`:
        ```javascript
        app.use(cors({
            origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
            credentials: true
        }));
        ```
    *   Add `FRONTEND_URL` to your Render Environment Variables.

-   **White Screen:** Check the Vercel logs. Ensure `VITE_API_URL` is correct.

Congratulations! Your Smart Hospital System is now live! 🚀
