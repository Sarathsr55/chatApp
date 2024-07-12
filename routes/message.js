const express = require('express')
const { addMessage, getMessages } = require('../services/message.service')
const router = express.Router()

router.post('/', async(req,res)=>{
    const body = req.body
    try {
        const response = await addMessage(body)
        if(response){
            res.status(200).json(response)
        }
    } catch (error) {
        console.log(`error occured while adding message : ${error}`);
        res.status(500).json(error)
    }
    
    
})

router.get('/:chatId',async(req,res)=>{
    const id = req.params.chatId
    try {
        const response = await getMessages(id)
        if(response){
            res.status(200).json(response)
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;