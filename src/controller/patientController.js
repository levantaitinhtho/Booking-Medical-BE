import patientService from '../service/patientService'

let postBookAppointment = async(req, res)=>{
    try{
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(
            infor
        )
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode : -1,
            errMessage:"Error From The Server !!"
        })
    }
}
let postVerifyBookAppointment = async (req, res)=>{
    try{
        let infor = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(
            infor
        )
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode :-1,
            errMessage:'Error From The Server !'
        })
    }
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}