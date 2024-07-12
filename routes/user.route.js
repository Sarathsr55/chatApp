var express = require('express')
const { getUserData, getAllUsers,getUser,getUserById } = require('../services/user.service')
var router = express.Router()

router.get('/get-user/:email',async(req,res)=>{
    let email = req.params.email
    let response = await getUserData(email)
    res.json(response)
})

router.get('/get_user/:phone',async(req,res)=>{
  let phone = req.params.phone
  let response = await getUser(phone)
  res.json(response)
})

router.get('/allusers',async(req,res)=>{
    try {
     const response = await getAllUsers()
     if(response){
       res.json(response)
     }
    } catch (error) {
     console.log(`error occured while getting posting : ${error}`);
    }
 })

 router.get('/getuserbyid/:id',async(req,res)=>{
  let id = req.params.id
  let response = await getUserById(id)
  res.json(response)
 })

module.exports = router