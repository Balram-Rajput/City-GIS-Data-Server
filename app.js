require("dotenv").config()
require("express-async-errors")

// extra security packages
const helemt = require('helmet');
const cors = require('cors');
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


const express = require('express')
const app = express()

const notFoundMiddleware = require("./middleware/not-found")
const errorMiddleware = require("./middleware/error-handler")

const connectDB  = require("./db/connect")
const GeoDataRouter = require("./routes/indiacounty")
const pinCoderRouter = require("./routes/indiaPinCode")


app.use(express.json())

// extra packages
app.set('trust proxy',1)
// app.use(rateLimiter({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// 	// store: ... , // Use an external store for consistency across multiple server instances.
// }))
app.use(helemt())
app.use(cors())
app.use(xss())




// routes
app.use("/api/v1/india_county",GeoDataRouter)
app.use("/api/v1/india_pincode",pinCoderRouter)

app.get("/",(req,res)=>{
    res.send('<h1>GIS API</h1> <a href="/api/v1/india_county">India County and City GIS Data route</a> <br> <a href="/api/v1/india_pincode">India Pincode route</a>')
})


// middleware 
app.use(notFoundMiddleware)
app.use(errorMiddleware)


const port = process.env.PORT || 3000
// const port = 3000;

const start = async ()=>{
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listing on PORT : ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()