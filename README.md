# Node E-Commerce API

## 1. Description

A REST API for a small online store, built with Node.js, Express and MongoDB. It covers the parts every small shop backend needs: user accounts with email confirmation, role-based admin routes, and a product catalogue with search, filtering, sorting, pagination and image upload.

## 2. Technologies and Versions

- Node.js with Express ^5.2.1
- MongoDB with Mongoose ^9.1.1
- JWT ^9.0.3 (auth), bcrypt ^6.0.0 (password hashing), nanoid ^5.1.6
- Yup ^1.7.1 (request validation)
- Multer ^2.0.2 and Cloudinary ^2.9.0 (product image upload)
- Nodemailer ^7.0.12 (confirmation and reset emails)
- Helmet ^8.1.0, express-rate-limit ^8.2.1, cors ^2.8.5, cookie-parser ^1.4.7, morgan ^1.10.1
- Jest ^30.5.2 (tests), nodemon ^3.1.11 (dev), Dockerfile included

## 3. Requirements and Dependencies

- Node.js installed
- A MongoDB instance (local or Atlas)
- A Cloudinary account and an email account for outgoing mail (for the related features)
- Dependencies are installed with `npm install` (see `package.json`)

## 4. Installation and Run Steps

```bash
git clone https://github.com/MostafaNegm222/node-project-Ecommerce.git
cd node-project-Ecommerce
npm install
cp example.env config.env   # the app reads config.env, not .env
# fill in the values in config.env (see section 5)
npm start                   # nodemon server.js
```

A `Dockerfile` is included for building a container image of the API.

## 5. Environment Variables

Listed in `example.env`; copy it to `config.env` and fill in real values (no secrets are stored in the repo):

| Variable | Purpose |
| --- | --- |
| `PORT` | Port the API listens on |
| `LOCAL_DB` / `DATABASE` | MongoDB connection strings (local / production) |
| `SECRET_KEY` | Secret used to sign JWTs |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_MAIL`, `EMAIL_PASSWORD` | SMTP settings for confirmation and reset emails |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_PUBLIC_KEY`, `CLOUDINARY_SECRET_KEY` | Cloudinary image storage |
| `CLIENT_URL` | Allowed CORS origin (defaults to `http://localhost:4200`) |

## 6. Usage and Main Features

- **Authentication (`/auth`)**: sign up (bcrypt-hashed password, 6-digit OTP emailed to confirm the address), confirm email, log in (JWT valid 7 days), forgot/reset password by OTP. Request validation with Yup (name 6-20 characters, valid email, password at least 6). Sign-up and login are rate limited to 5 requests per 15 minutes per IP.
- **Products (`/products`)**: public list with operator filtering (`price[gte]=100`), keyword search over title, name and description, sorting, field selection and pagination (default 10 per page); category list and per-category statistics (count, min, max and average price). Admins can create products with an image (Cloudinary, images only, max 10 MB), edit, soft delete, list soft-deleted items and delete permanently. Logged-in users can view one product and list the products they created.
- **Users (`/users`, admin only)**: list, view, create, change role, soft delete and permanently delete users.
- **General**: global error handler (clean JSON for JWT, duplicate-key, cast and validation errors), Helmet, CORS from `CLIENT_URL`, request size limit, global rate limit of 100 requests per 10 minutes.

## 7. Screenshots / Demo

No live demo; the API runs locally.

## 8. Running Tests

```bash
npm test
```

Jest unit tests live in `tests/`.
