const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = async (err, req, res, next) => {
  // console.log(err)
  // return res.status(500).json({ msg: 'Something went wrong, please try again' })

    //set default
    let customError = {
      statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg:err.message || "Something went wrong try again later."
    }
  
    if(err.name ==="ValidationError"){
      customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
      customError.statusCode = 400
    }
  
    if(err.code && err.code === 11000){
      customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, pleae choose another value`,
      customError.statusCode = 400
    }
  
    if(err.name === "CastError"){
      customError.msg = `No item foud with id : ${err.value}`,
      customError.statusCode =404
    }
  
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err })
    return res.status(customError.statusCode).json({ msg: customError.msg })
  

}

module.exports = errorHandlerMiddleware
