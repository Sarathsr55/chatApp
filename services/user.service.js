const { ObjectId } = require('mongodb');
const { mongoConfig } = require('../config')
const MongoDB = require('./mongodb.service')

const getUserData = async(email)=>{
    try {
        let userObject = await MongoDB.db.collection(mongoConfig.collections.USERS).findOne({email})
        if(userObject){
            let {_id,username,email,phone,img} = userObject

            return{
                status: true,
                message:'User found successfully',
                data: {_id,username,email,phone,img}
            }
        }else{
            return{
                status: false,
                message:'No User found'
            }
        }
    } catch (error) {
        return{
            status: false,
            message: 'User finding failed',
            error: `User finding failed ${error?.message}`
        }
    }
}
const getUser = async(phone)=>{
    try {
        let userObject = await MongoDB.db.collection(mongoConfig.collections.USERS).findOne({phone})
        if(userObject){
            let {_id,username,email,phone} = userObject
            return {
                status: true,
                message:'User found successfully',
                data: {_id,username,email,phone}
            }
        }else{
            return{
                status: false,
                message:'No User found'
            }
        }
    } catch (error) {
        return{
            status: false,
            message: 'User finding failed',
            error: `User finding failed ${error?.message}`
        }
    }
}

const getAllUsers = async () => {
    try {
        const userResponse = await MongoDB.db.collection(mongoConfig.collections.USERS).aggregate([{$project:{password:0}}]).toArray()
        if(userResponse?.length>0){
            return userResponse
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

const getUserById = async(id)=>{
    try {
        const userResponse = await MongoDB.db.collection(mongoConfig.collections.USERS).findOne({_id:new ObjectId(id)})
        if(userResponse){
            let {_id,username,email,phone,lastseen,img} = userResponse

            return{
                status: true,
                message:'User found successfully',
                data: {_id,username,email,phone,lastseen,img}
            }
        }else{
            return{
                status: false,
                message:'No User found'
            }
        }
    } catch (error) {
        return{
            status: false,
            message: 'User finding failed',
            error: `User finding failed ${error?.message}`
        }
    }
}

module.exports = {getUserData,getAllUsers,getUser,getUserById}