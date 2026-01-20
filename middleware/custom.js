module.exports = (req,res,next) => {
    console.log("custom middleware");
    next()
} 