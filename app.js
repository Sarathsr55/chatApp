const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')
const MongoDB = require('./services/mongodb.service')
var bodyParser = require('body-parser')
var ejs = require('ejs')

app.use(cors({
    origin:'*'
}))



MongoDB.connectToMongoDB()

var indexRouter = require('./routes/index');
var authenticationRouter = require('./routes/authentication');
var userRouter = require('./routes/user.route')
var postRouter = require('./routes/post')
var chatRouter = require('./routes/chat')
var messageRouter = require('./routes/message')

app.set("view engine", "ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.json({limit: '50mb'}))
app.use('*',require('./services/authentication.service').tokenVerification)
app.use('/', indexRouter);
app.use('/api', authenticationRouter);
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)





app.listen(PORT,(req,resp)=>{
    console.log(`Server is running on ${PORT}`);
    
})