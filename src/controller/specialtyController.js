import specialtyService from "../service/specialtyService";
let createSpecialty = async (req, res) => {
  try {
    let infor = await specialtyService.createSpecialty(req.body);
    return res.status(200).json(infor); // Trả về kết quả
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error From The Server !",
    });
  }
};
let getAllSpecialty = async (req, res) => {
  try {
    let infor = await specialtyService.getAllSpecialty();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error From The Server !!",
    });
  }
};
let getDetailSpecialtyById = async (req, res) => {
  try {
    let infor = await specialtyService.getDetailSpecialtyById(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error From The Server !!",
    });
  }
};
let handleEditSpecialty = async (req, res) => {
  let data = req.body;
  console.log(data);
  let message = await specialtyService.updateSpecialtyData(data);
  return res.status(200).json(message);
};
let handleDeleteSpecialty = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: " Missing required parameters !!!",
    });
  }
  let message = await specialtyService.deleteSpecialty(req.body.id);
  return res.status(200).json(message);
};
let handleGetAllSpecialtys = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      specialtys: [],
    });
  }
  let specialtys = await specialtyService.getAllSpecialtys(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "OKE",
    specialtys,
  });
};
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  handleEditSpecialty: handleEditSpecialty,
  handleGetAllSpecialtys: handleGetAllSpecialtys,
  handleDeleteSpecialty: handleDeleteSpecialty,
};
