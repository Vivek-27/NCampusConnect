
# Campus Connect - MERN Stack eCommerce

**Campus Connect** is a social platform for university students to buy and sell goods, especially when seniors graduate and need to sell their items to freshmen. The platform allows users to follow each other, chat using **Socket.IO**, and trade goods. It also includes features like **Google OAuth** for authentication, **JWT** for secure user sessions, **Redis** for caching, and **Cloudinary** for image storage.

## Technology Stack

- **Frontend**: React, Redux, Vite (for faster build and development)
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Google OAuth, JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.IO
- **Email Verification**: Nodemailer
- **Image Storage**: Cloudinary
- **State Management**: Redux
- **Caching**: Redis (to be implemented)

## Features

- **User Authentication**: Google OAuth for secure login and JWT for session management.
- **Item Listing**: Seniors can list their goods for sale, and freshmen can purchase them.
- **Following System**: Users can follow each other to get updates.
- **Real-time Chat**: Users can send messages and chat with each other using Socket.IO.
- **Image Upload**: Cloudinary integration for uploading images for products.
- **Email Verification**: Nodemailer used for email verification during registration.
- **State Management**: Redux for managing frontend application state.
- **Redis Caching**: Redis integration to be implemented for caching frequently accessed data.

## Project Structure

```bash
├── ecommerce-frontend/     # React + Vite Frontend
│   ├── public/             # Static files
│   ├── src/                # Source code for React app
│   ├── redux/              # Redux store and actions
│   ├── components/         # UI components (e.g., Navbar, Product, etc.)
│   ├── services/           # API calls and services
│   ├── vite.config.js      # Vite configuration for frontend
│   ├── package.json        # Frontend dependencies and scripts
│   └── .env                # Frontend environment variables
│
├── ecommerce-backend/      # Node.js + Express Backend
│   ├── controllers/        # Express route controllers (e.g., AuthController)
│   ├── models/             # MongoDB models (e.g., User, Product, Chat)
│   ├── routes/             # API routes (e.g., /auth, /products, /chat)
│   ├── services/           # External services (e.g., Google OAuth, Nodemailer)
│   ├── socket/             # Socket.IO for real-time communication
│   ├── config/             # Configuration files (e.g., JWT secret, Redis setup)
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies and scripts
│   └── .env                # Backend environment variables
└── README.md               # This file
```

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v14 or later)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or use a cloud solution like MongoDB Atlas)
- [Redis](https://redis.io/download) (for caching, to be implemented later)
- [Cloudinary Account](https://cloudinary.com/) (for image storage)

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/campus-connect.git
cd campus-connect
```

### Setup Frontend (React + Vite)

1. Navigate to the `ecommerce-frontend` directory:

```bash
cd ecommerce-frontend
```

2. Install the frontend dependencies:

```bash
npm install
```

3. Set up your environment variables for frontend in `.env` (e.g., backend URL):

```env
VITE_BACKEND_URL=http://localhost:5000
```

4. Run the frontend in development mode:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` by default.

### Setup Backend (Node.js + Express)

1. Navigate to the `ecommerce-backend` directory:

```bash
cd ecommerce-backend
```

2. Install the backend dependencies:

```bash
npm install
```

3. Set up your environment variables for backend in `.env` (including JWT secret, Google OAuth credentials, MongoDB URI, etc.):

```env
MONGO_URI=mongodb://localhost:27017/campus-connect
PORT=5000
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_URL=your-cloudinary-url
REDIS_URL=your-redis-url (for future Redis setup)
```

4. Run the backend server:

```bash
npm start
```

The backend API will be available at `http://localhost:5000` by default.

### Connecting Frontend and Backend

Make sure your backend is running on `http://localhost:5000`, and the frontend on `http://localhost:3000`.

To enable communication between the frontend and backend during development, you can set up a proxy in the Vite configuration (`vite.config.js`):

```js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000',  // Proxy API requests to the backend
    },
  },
};
```

### Using Redis (to be implemented)

For caching, Redis will be set up later to cache frequently accessed data, like product listings or user details.

## Available Scripts

### Frontend (React + Vite)

In the `ecommerce-frontend` folder, you can run the following commands:

- `npm run dev`: Starts the development server (Frontend).
- `npm run build`: Builds the production-ready version of the app.
- `npm run preview`: Preview the production build locally.

### Backend (Node.js + Express)

In the `ecommerce-backend` folder, you can run the following commands:

- `npm start`: Starts the backend server (API).
- `npm run dev`: Starts the backend server in development mode (using `nodemon` for auto-reload).

## Features in Development

- **Redis Integration**: For caching frequently accessed data (to be implemented in a future version).
- **Real-Time Chat**: Users can send real-time messages and interact with each other via WebSockets (Socket.IO).
- **Email Verification**: After signing up, users will receive a verification email to confirm their account.
- **Follow and Chat System**: Users can follow each other, and messaging will be available through Socket.IO.

## Contribution

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Notes:
- Make sure to replace placeholders like `your-username`, `your-jwt-secret`, `your-google-client-id`, and others with actual values.
- This README outlines the setup for both frontend and backend, along with an explanation of the core features such as authentication, image storage, chat system, etc.
