const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const authRoute=require('./routes')
const cors=require('cors')
const app=express()
const PORT=5000
app.get('/',()=>{
    console.log("runnging on backend")
})

app.listen(PORT,()=>{
    console.log(`running on server ${PORT}`)
})
dotenv.config()
mongoose.connect(process.env.DB_CONNECT,{UseNewUrlParser:true},()=>{
    console.log("DB Connected")
})
app.use(express.json(),cors())
app.use('/app',authRoute)