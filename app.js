import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectDB from './config/connectDb.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'

const app=express()
const port=process.env.PORT
const DATABASE_URL=process.env.DATABASE_URL

//cors
app.use(cors())

//database connection
connectDB(DATABASE_URL)

//Json
app.use(express.json())

//load routes
app.use("/api/user",userRoutes)
app.use("/api/product",productRoutes)
app.use("/api/category",categoryRoutes)

app.listen(port,()=>{
    console.log(`Server is listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  
    res.send('Hello');
    
  });