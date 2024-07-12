var express = require('express');
var router = express.Router();
var cors = require('cors')
const {userRegister, createOTP,userCheck, userLogin, userNameUpdate, tokenRefresh, adminRegister,adminLogin, postUpdate, userLastSeenUpdate, userDpUpdate} = require('../services/authentication.service')

router.use(cors(
  {
    origin: '*'
  }
))

router.post('/add-admin',async(req,res,next)=>{
  let body = req.body
  try {
    let response = await adminRegister(body)
    res.json(response)
  } catch (error) {
    res.json(error)
  }
})

router.post('/register', async (req, res, next) => {
  let body = req.body
  try{

    let response = await userCheck(body);
    res.json(response)
    
  }catch(error){
    
    res.json(error)
  }
});

router.post('/postUpdate',async(req,res,next)=>{
  let body = req.body
  try {
    let response = await postUpdate(body)
    res.json({
      status: true,
      message: 'post updated successfully'
    })
  } catch (error) {
    res.json(error)
  }
})

router.post('/lastseen',async(req,res,next)=>{
  let body = req.body
  try {
    let response = await userLastSeenUpdate(body)
    res.json(response)
  } catch (error) {
    res.json(error)
  }
})

router.post('/userUpdate',async(req,res,next)=>{
  let body = req.body
  try {
    let response = await userNameUpdate(body)
    console.log(response);
    res.json('success')
  } catch (error) {
    res.json(error)
  }
})

router.post('/userDpUpdate',async(req,res)=>{
  let body = req.body
  try {
    let response = await userDpUpdate(body)
    console.log(response);
    if(response){
      res.json('Dp updated successfully')
    }
  } catch (error) {
    res.json(error)
  }
})

router.post('/admin-login',async(req,res,next)=>{
  let body = req.body
  try {
    let response = await adminLogin(body)
      res.json(response)
  } catch (error) {
      res.json(error)
  }
})

router.post('/login', async(req,res,next)=>{
  let body = req.body
  try{
    let response = await userLogin(body)
    res.json(response)
  }catch(error){
    res.json(error)
  }
})


router.post('/otp', async (req,res,next)=>{
  let body = req.body
  try{
    let response = await createOTP(body)
    res.json(response)
    
  }catch(error){
    res.json(error);
  }
  
})

router.post('/refresh-token',tokenRefresh)

module.exports = router;