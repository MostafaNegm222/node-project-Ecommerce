# Node E-Commerce API

A REST API for a small online store, built with Node.js, Express and MongoDB. It covers user accounts with email confirmation, role-based admin routes, and a product catalogue with search, filtering, sorting, pagination and image upload.

## What it does

**Authentication (`/auth`)**
- Sign up with name, email and password. The password is hashed with bcrypt and a 6-digit OTP is emailed to confirm the address.
- Confirm the email with the OTP, then log in. Login returns a JWT that expires in 7 days.
- Forgot / reset password using an emailed OTP.
- Request validation with Yup (name 6 to 20 characters, valid email, password at least 6 characters).
- Sign up and login are rate limited to 5 requests per 15 minutes per IP.

**Products (`/products`)**
- Public list with query features: filtering with operators (`price[gte]=100`), keyword search over title, name and description, sorting, field selection and pagination (default 10 per page).
- Category list and per-category statistics (count, min, max and average price).
- Admin only: create a product with an image (uploaded to Cloudinary, images only, max 10 MB), edit, soft delete, list soft-deleted items, delete permanently.
- Any logged-in user can view one product and list the products they created.

**Users (`/users`, admin only)**
- List, view, create, change role, soft delete and permanently delete users.

**General**
- Global error handler that turns JWT, duplicate-key, cast and Mongoose validation errors into clean JSON responses.
- Helmet, CORS (origin from `CLIENT_URL`, default `http://localhost:4200`), request size limit and a global rate limit of 100 requests per 10 minutes.

## Tech stack

Node.js, Express 5, MongoDB with Mongoose, JWT, bcrypt, Yup, Multer, Cloudinary, Nodemailer, Helmet, express-rate-limit, Jest.

## Project structure

```
├── app.js            # Express app: middleware and routes
├── server.js         # Entry point: connects to MongoDB and starts the server
├── config/           # MongoDB and Cloudinary setup
├── controllers/      # Request handlers (auth, products, users)
├── models/           # Mongoose models (User, Product)
├── routes/           # Route definitions
├── validators/       # Yup schemas
├── middleware/       # auth, restrictTo, validator, multer, global error handler
├── utils/            # ApiFeatures, AppError, async wrapper, email helpers
├── tests/            # Jest unit tests
└── Dockerfile
```

## Run it locally

You need Node.js and a MongoDB instance.

```bash
npm install
cp example.env config.env   # the app reads config.env, then fill in the values
npm start                   # runs server.js with nodemon
```

Variables used by the code: `PORT`, `LOCAL_DB` (MongoDB connection string), `SECRET_KEY` (JWT secret), `SALT_ROUND` (bcrypt rounds, for example 10), `CLIENT_URL` (optional), `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_MAIL`, `EMAIL_PASSWORD`, and the Cloudinary keys listed in `example.env`.

Then open `http://localhost:<PORT>/` for the welcome response listing the main routes.

### Docker

A `Dockerfile` is included (Node 20, listens on port 3000). It has not been verified end to end in this repo's history, so treat it as a starting point.

## Tests

```bash
npm install
npm test
```

26 unit tests with Jest cover the query builder (`ApiFeatures`), all four Yup validation schemas, the validator, error handling and role-check middleware, and the async error wrapper. They do not need a database or network access.

## Notes

- Controllers that talk to MongoDB, Cloudinary and the mail server are not covered by the unit tests.
- Uses `npm install`, not `npm ci`, because the lockfile has not been regenerated for the Jest dev dependency.
