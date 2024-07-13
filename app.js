const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')
const MongoDB = require('./services/mongodb.service')
var bodyParser = require('body-parser')

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

app.use(expressLayouts);
app.set('veiw engine', 'ejs')   

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