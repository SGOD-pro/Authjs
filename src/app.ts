import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


var app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())


//routes
import userRouter from './routes/auth.routes.js'
app.use('./netlify/functions/api/user',userRouter)
app.get('./netlify/functions/api',(_,res)=>{
    res.send('Hello World')
})


export {app}