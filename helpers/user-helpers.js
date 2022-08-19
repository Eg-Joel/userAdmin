var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('express')
const admin={
    name:'admin',
    email:'admin@gmail.com',
    password:'admin'
}
var objectId=require('mongodb').ObjectId
module.exports={
    doSignup:(userData)=>{
        var flag=null
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({$or: [{email:userData.email},{name:userData.name}]});
            if(userData.name==admin.name||userData.email==admin.email){
                isUnique=false
                resolve(isUnique)
            }else if(!user){
                userData.password = await bcrypt.hash(userData.password,10)
                // console.log(isUnique)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData)
                isUnique=true
                resolve(isUnique)    
            }
            // userData.password=await bcrypt.hash(userData.password,10)
            // db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
            //     resolve(data)   
            // })
            else if(user){
                flag=false
                resolve(flag)
            }
        })
           
        
    },
    doLogin:(userData)=>{
        let loginStatus=false
            let response={}
        return new Promise(async(resolve,reject)=>{
            
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            // console.log(userData.name)
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                       console.log("login success")
                       response.user=user
                       response.status=true
                       resolve(response)
                    }else{
                        console.log("login faild")
                        resolve({status:false})
                    }
                })
            }else  if(userData.email==admin.email&&userData.password==admin.password&&userData.email==admin.email) {
                console.log('Its the ADMIN!!!!!!')
                response.user="admin"
                resolve(response)
            }
            else
            
            {
                console.log("login failed")
                resolve({status:false})
            }
        })
    },
    addUser: (userData) => {
        return new Promise(async (resolve, reject) => {
            
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData)

            resolve(userData)
        })

    

    // addUser:(user,callback)=>{
        
    //     db.get().collection('user').insertOne(user).then((data)=>{
        
    //     callback(data)
    //     })
    },
    getAllUser:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response)=>{
             
                resolve(response)  
            })
        } )
    },
    getUser:(userId)=>{
        return new Promise((resolve,reject)=>{
         db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)}).then((user)=>{
            resolve(user)
         })   
        })
    },
    updateUser:(userId,userDetails)=>{
        var check=null
        return new Promise(async(resolve,reject)=>{
            var inp =await db.get().collection(collection.USER_COLLECTION).findOne({name:userDetails.name},{email:userDetails.email})
            if(userDetails.name==collection.adminName||userDetails.email==collection.adminEmail){
                check=false
                resolve(check)
            }else if(!inp){
                check=true
                let newp= await bcrypt.hash(userDetails.password,10)
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{
                    $set:{
                        name:userDetails.name,
                        email:userDetails.email,
                        password:newp
        
                    }
                 } ).then((response)=>{
                    resolve(check)
                 })
            }else{
                check=false
                resolve(check)
            }
        })
        
    }
}