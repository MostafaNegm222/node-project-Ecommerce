# Node E-Commerce API

A REST API for an e-commerce platform with a clean layered structure. Ships with a Dockerfile.

## Tech Stack

- **Runtime/Framework:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT with bcrypt password hashing
- **Uploads:** Multer + Cloudinary
- **Security:** Helmet, express-rate-limit
- **Structure:** Controllers, models, routes, validators and middleware in separate layers

## Project Structure

```
├── controllers/  # Request handlers
├── models/       # Mongoose models
├── routes/       # API routes
├── validators/   # Request validation
├── middleware/   # Express middleware
├── config/       # Configuration
├── utils/        # Shared utilities
├── public/       # Static assets
└── Dockerfile    # Container image for the API
```

## Getting Started

```bash
npm install
cp example.env .env   # fill in the values
npm start
```
