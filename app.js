const path = require("path")
const express = require("express")
const morgan = require("morgan")
const dotenv = require("dotenv").config({path:"./config.env"})
const ProductsRouter = require("./routes/ProductsRoutes.js")
const userRouter = require("./routes/userRoutes.js")
const authRouter = require("./routes/authRoutes.js")
const custom = require("./middleware/custom.js")
const globalError = require("./middleware/globalError.js")
const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))
app.use(morgan("dev"))

app.use((req,res,next) => {
    console.log("hello from middleware");
    next()
})

// app.get("/products",ProductController.getAllProducts)

app.use("/products", ProductsRouter)
app.use("/users", userRouter)
app.use("/auth", authRouter)


app.use((req,res) => {
    res.status(404).sendFile(path.join(__dirname,"public","index.html"))
})

app.use(globalError)


module.exports = app