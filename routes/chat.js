const express = require('express')
const { createChat, userChat, findChat } = require('../services/chat.service')
const router = express.Router()

router.post('/', async(req,res,next)=>{
    const body = req.body
    try {
        const response = await createChat(body)
        if(response){
            res.json(response)
        }
    } catch (error) {
            console.log(`error occured while creating chat : ${error}`);
    }
})

router.get('/:userId', async(req,res)=>{
    const body = req.params.userId
    try {
        const response = await userChat(body)
        if(response){
            res.json(response)
        }
    } catch (error) {
        console.log(`error occured while finding chat : ${error}`);
    }
})

router.get('/find/:firstId/:secondId', async(req,res)=>{
    const id1 = req.params.firstId
    const id2 = req.params.secondId
    try {
        const response = await findChat(id1,id2)
        if(response){
            res.json(response)
        }
    } catch (error) {
        console.log(`error occured while finding chat : ${error}`);
    }

})

module.exports = router;