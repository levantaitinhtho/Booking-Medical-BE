const db = require("../models")

let createClinic = (data)=>{
    return new Promise(async (resolve, reject) =>{
        try{
            if(!data.name || !data.address
                || !data.imageBase64
                || !data.descriptionMarkdown
                || !data.descriptionHTML
            ){
                resolve({
                    errCode: 1,
                    errMessage:"Missing Required Parameters !!"
                })
            }else{
                await db.Clinic.create({
                    name : data.name,
                    address: data.address,
                    image : data.imageBase64,
                    descriptionHTML : data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode:0,
                    errMessage:'OKE'
                })
            }
        }catch(e){
            reject(e)
        }
    })
}
let getAllClinic = () =>{
    return new Promise(async(resolve, reject) =>{
        try{
            let data = await db.Clinic.findAll({

            })
            if(data && data.length > 0){
                data.map(item =>{
                    item.image = new Buffer(item.image,'base64').toString('binary')
                    return item;
                })
            }
            resolve({
                errMessage:'oke',
                errCode:0,
                data: data

            })
        }catch(e){
            reject(e)
        }
        
    })
}
let getAllClinics = () =>{
    return new Promise(async(resolve, reject) =>{
        try{
            let data = await db.Clinic.findAll({

            })
            if(data && data.length > 0){
                data.map(item =>{
                    item.image = new Buffer(item.image,'base64').toString('binary')
                    return item;
                })
            }
            resolve({
                errMessage:'oke',
                errCode:0,
                data: data

            })
        }catch(e){
            reject(e)
        }
        
    })
}
let getDetailClinicById = (inputId)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage:"Missing Required Parameters !! "
                })
            }else{
                let data = await db.Clinic.findOne({
                    where:{
                        id:inputId
                    },
                    attributes:['name','address','descriptionHTML', 'descriptionMarkdown'],
                })
                if(data){
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                            where:{ clinicId: inputId },
                            attributes:['doctorId','provinceId'],
                        
                    })
                    data.doctorClinic = doctorClinic;
                }else data={}   

                resolve({
                    errMessage:'OKE',
                    errCode:0,
                    data
                })
            }
        }catch(e){
            reject(e);
        }
    })
}
let updateClinicData = (data) =>{
    return new Promise( async (resolve, reject) =>{
        try{
            if(!data.id || !data.address || !data.name){
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let clinic = await db.Clinic.findOne({
                where: { id: data.id },
                raw:false
            })
            if (clinic) {
                clinic.address = data.address,
                clinic.name = data.name
                if(data.avatar){
                    user.image = data.avatar;
                }

                await clinic.save();

                resolve({
                    errCode : 0,
                    message : ' Update Clinic Successfully !!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage:'Clinic Not Found !!!'
                });
            }
        }catch(e){
            reject(e)
        }
    })
}
let deleteClinic = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem phòng khám có tồn tại không
            let foundClinic = await db.Clinic.findOne({
                where: { id: clinicId }
            });

            if (!foundClinic) {
                resolve({
                    errCode: 2,
                    errMessage: `Clinic doesn't exist`
                });
            } else {
                // Xóa phòng khám
                await db.Clinic.destroy({
                    where: { id: clinicId }
                });

                resolve({
                    errCode: 0,
                    errMessage: `Clinic deleted successfully`
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};


module.exports={
    createClinic: createClinic,
    getAllClinic : getAllClinic,
    getDetailClinicById: getDetailClinicById,
    updateClinicData: updateClinicData,
    deleteClinic: deleteClinic,
    getAllClinics: getAllClinics
    
}