

module.exports = (...roles) => {
   return  async  (req,res,next) => {
    let user = req.user
    if(!roles.includes(user.role)) {
        res.status(403).json({message:"this route is protected for admin"})
    }
    next()
}
}