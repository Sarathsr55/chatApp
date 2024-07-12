const MongoDB = require('./mongodb.service')
const { mongoConfig, tokenSecret } = require('../config')
var ObjectID = require('mongodb').ObjectId
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name : 'douqsggz9',
    api_key : '755365171616182',
    api_secret : '7ysMgOlArbyr2PgA__ehi0rs5Us'
})

const createPost = async (post) => {
  
    const postObject = {
        mobile:post?.mobile,
        model:post?.model,
        problem:post?.problem,
        location:post?.location,
        district:post?.district,
        phone:post?.phone,
        postedBy:post?.postedBy,
        name:post?.name,
        status:post?.status,
        amount:post?.amount,
        techie:'',
        date: new Date().toLocaleDateString('en-GB'),
        time: new Date().toLocaleTimeString(undefined,{timeZone:'Asia/Kolkata'})
    }
   const response = await MongoDB.db.collection(mongoConfig.collections.POST).insertOne(postObject)
   if(response){
    return {
        status: true,
        message: 'post created successfully'
    }
   }else{
    console.log('error occured while posting');
   }
}

const getAllPosts = async () => {
    try {
        const postResponse = await MongoDB.db.collection(mongoConfig.collections.POST).find().toArray()
        if(postResponse?.length>0){
            return postResponse
        }
        else{
            console.log('error while fetching data');
        }
    } catch (error) {
        return {
            status: false,
            message: 'Post finding failed',
            error: `Post finding failed ${error?.message}`
        }
    }
}

const getPostByDate = async(date)=>{
    try {
        const postResponse = await MongoDB.db.collection(mongoConfig.collections.POST).find({date:date}).toArray()
        if(postResponse.length > 0){
            return postResponse
        }else{
            return {message:'no post found'}
        }

    } catch (error) {
        return {
            status: false,
            message: 'Post finding failed',
            error: `Post finding failed ${error?.message}`
        }
    }
}

const getMyPosts = async(id)=>{
    try {
        
        const postResponse = await MongoDB.db.collection(mongoConfig.collections.POST).find({postedBy:id}).toArray()
        console.log(postResponse);
        if(postResponse?.length > 0){
            return postResponse
        }
        else{
            return {message:'no post found'}
        }
    } catch (error) {
        return {
            status: false,
            message: 'Post finding failed',
            error: `Post finding failed ${error?.message}`
        }
    }
}

const deleteMyPost = async(id)=>{
    try {
        const postResponse = await MongoDB.db.collection(mongoConfig.collections.POST).deleteOne({_id:ObjectId(id)})
        if(postResponse){
             
             return {
                status:true,
                message: 'deletion done successfully.',
                data:postResponse
             }
        }else{
            console.log('else error');
        }
    } catch (error) {
        console.log(`error occured : ${error}`);
    }
}

const deleteCloudImage = async(product)=>{
    const deleting = await  cloudinary.v2.uploader.destroy(product?.publicId)
    if(deleting?.result === 'ok'){
  
        const updatingImages = await MongoDB.db.collection(mongoConfig.collections.PRODUCTS).updateOne(
          {_id : new ObjectId(product?.productId)},
          {
              $pull:   {
                  images : {publicId : product?.publicId}
              }
          }
        )
        console.log(updatingImages);
    }
    return {deleting}
  }

module.exports = { createPost, getAllPosts, getMyPosts, deleteMyPost, getPostByDate, deleteCloudImage }