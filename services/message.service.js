const MongoDb = require('./mongodb.service')
const {mongoConfig} = require('../config')

const addMessage = async(message)=>{
    const messageObject = {
        chatId : message?.chatId,
        senderId: message?.senderId,
        text: message?.text,
        date: new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),
        time: new Date().toLocaleTimeString(undefined,{timeZone:'Asia/Kolkata', hour12: true, hour:'2-digit',minute:'2-digit'})
    }
    const response = await MongoDb.db.collection(mongoConfig.collections.MESSAGES).insertOne(messageObject)
    if(response){
        return {
            status: true,
            message : 'message added successfully',
            result : response
        }
    }else{
        console.log('error occured while adding message');
    }
}

const getMessages = async(chatId)=>{
    const response = await MongoDb.db.collection(mongoConfig.collections.MESSAGES).find({chatId}).toArray()
    if(response){
        return {
            status : true,
            message :'messages founded successfully',
            messages: response
        }
    }else{
        console.log('error occured while finding messages');
    }
}

module.exports = {addMessage, getMessages}