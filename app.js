const path = require("path")
const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const cors = require("cors")
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require("dotenv").config({path:"./config.env"})

const ProductsRouter = require("./routes/ProductsRoutes.js")
const userRouter = require("./routes/userRoutes.js")
const authRouter = require("./routes/authRoutes.js")

const globalError = require("./middleware/globalError.js")

const app = express()

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname,"public")))
app.use(morgan("dev"))
app.use(helmet())
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }))


  const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per window
  message:
    'Too many requests from this IP, please try again later',
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests
  message:
    'Too many authentication attempts, please try again later',
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/',limiter, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to E-commerce API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      products: '/products',
    },
  });
});

app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);



app.use("/products",limiter, ProductsRouter)
app.use("/users",limiter, userRouter)
app.use("/auth", authRouter)


app.use((req,res) => {
    res.status(404).sendFile(path.join(__dirname,"public","index.html"))
})

app.use(globalError)


module.exports = app