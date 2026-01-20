module.exports = fn => (req,res,next) => {
    Promise.resolve(fn(req,res,next)).catch(next)
}


/*
fn( async (req,res,next) => {
    
    
    }.catch(next))

    fn(fnc) {
    return async function(req,res,next) {
        Promise.resolve(fnc(req,res,next)).catch(next)
    }
    }

*/