var express = require('express');
var router = express.Router()
const { createPost, getAllPosts, getMyPosts, deleteMyPost, getPostByDate, deleteCloudImage } = require('../services/post.service');



router.post('/createpost', async (req, res, next) => {
    const body = req.body
    try {
      const response = await createPost(body)
      if(response){
        res.json(response)
      }
    } catch (error) {
      console.log(`error occured while posting : ${error}`);
    }
})

router.get('/allpost',async(req,res)=>{
   try {
    const response = await getAllPosts()
    if(response){
      res.json(response)
    }
   } catch (error) {
    console.log(`error occured while getting posting : ${error}`);
   }
})

router.get('/mypost/:id',async(req,res)=>{
  let id = req.params.id
  try {
    
    console.log(id);
    const response = await getMyPosts(id)
    if(response){
      res.json(response)
    }
  } catch (error) {
    console.log(`error occured while getting post: ${error}`)
  }
})

router.get('/postbydate',async(req,res)=>{
  let date = req.body
  try {
    const response = await getPostByDate(date)
    console.log(response);
    if(response){
      res.json(response)
    }
  } catch (error) {
    console.log(`error occured while getting post: ${error}`)
  }
})

router.delete('/deletepost/:postId',async(req,res)=>{
  let id = req.params.postId
  try {
    const response = await deleteMyPost(id)
    if(response){
      res.json(response)
    }
  } catch (error) {
    console.log(`error in deleting post ${error} `);
  }
})

router.delete('/deleteimage',async(req,res)=>{
  let body = req.body
  try {
      let response = await deleteCloudImage(body)
      if(response){
          console.log(response);
          res.status(200).json(response)
      }else{
          console.log('error');
      }
  } catch (error) {
      console.log(`error due to : ${error}`);
  }
})


  module.exports = router;