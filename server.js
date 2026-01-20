const app = require("./app.js")
const chalk = require("chalk") 
const dbConnect = require("./config/dbConnect.js")

dbConnect()

app.listen(process.env.PORT , () => {
    console.log(chalk.bgBlue(`the server is running at port ${process.env.PORT}`));
})