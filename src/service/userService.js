import bcrypt from 'bcryptjs'
import db from "../models/index"
import { where } from 'sequelize';
const salt = bcrypt.genSaltSync(10);


let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            let hashPassword = await bcrypt.hash(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};
let handleUserLogin = (email,password) =>{
    return new Promise (async (resolve,reject)=>{
        try{
            let userData={};

            let isExist = await checkUserEmail(email);
            if(isExist) {

                let user = await db.User.findOne({
                    attributes: ['id','email','roleid','password','firstName','lastName'],
                    where: {email : email},
                    raw: true,
                   
                });

                if (user){
                   let check = await bcrypt.compareSync(password, user.password); 
                   if(check){
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password
                        userData.user = user;
                   }else{
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                   }

                }else{
                    userData.errCode = 2;
                    userData.errMessage = `User isn't exits`;
                }

            }else{
                userData.errCode = 1;
                userData.errMessage = `The email does not exist in the system`
                
            }   
            resolve(userData)
        }catch(e){
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
                raw: true,
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};


let getAllUsers = (userId) =>{
    return new Promise( async(resolve,reject)=>{
        try{
            let users = ''
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id : userId},
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }catch(e){
            reject(e);
        }
    })
}

let createNewUser = (data) =>{
    return new Promise( async (resolve,reject) =>{
        try{

            let check = await checkUserEmail(data.email);
            if(check === true){
                resolve({
                    errCode:1,
                    errMessage:'Your Email is already exits, Plz try another email !!'
                })
            }else{
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender,
                phoneNumber: data.phoneNumber,
                roleId: data.roleId,
                positionId: data.positionId,
                image:data.avatar
            })
            resolve({
                    errCode:0,
                    message:'OKE'
            })
            }
        }catch(e){
            reject(e)
        }
    })
}


let deleteUser = (userId) =>{
    return new Promise(async (resolve,reject) =>{
        let foundUser = await db.User.findOne({
            where : {id : userId}
        })
        if(!foundUser){
            resolve({
                errCode:2 ,
                errMessage: `User isn't exits`
            })
        }
        await db.User.destroy({
            where : {id : userId}
        })
        resolve({
            errCode:0 ,
            errMessage: `User is delete successfully `
        })
    })
}

let updateUserData = (data) =>{
    return new Promise( async (resolve, reject) =>{
        try{
            if(!data.id || !data.roleId || !data.positionId || !data.gender){
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw:false
            })
            if (user) {
                user.firstName = data.firstName,
                user.lastName = data.lastName,
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender= data.gender;
                user.phoneNumber = data.phoneNumber;
                if(data.avatar){
                    user.image = data.avatar;
                }

                await user.save();

                resolve({
                    errCode : 0,
                    message : ' Update User Successfully !!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage:'User Not Found !!!'
                });
            }
        }catch(e){
            reject(e)
        }
    })
}
let getAllCodeService = (typeInput) =>{
    return new Promise(async (resolve,reject) =>{
        try{
            if(!typeInput){
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters !!!'
                })
            }else{
                let res = {};
                let allcode = await db.Allcode.findAll({
                        where:{ type:typeInput}
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        }catch(e){
            reject(e)
        }
    })
}
module.exports={
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser : deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService
}