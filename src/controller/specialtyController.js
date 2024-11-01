import specialtyService from '../service/specialtyService'
let createSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(infor); // Trả về kết quả
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error From The Server !'
        });
    }
}
let getAllSpecialty = async(req, res) =>{
    try{
        let infor = await specialtyService.getAllSpecialty();
        return res.status(200).json(
            infor
        )
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error From The Server !!'
        })
    }
}
module.exports = {
    createSpecialty:createSpecialty,
    getAllSpecialty: getAllSpecialty
}