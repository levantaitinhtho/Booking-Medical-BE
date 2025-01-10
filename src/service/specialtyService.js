const db = require("../models");

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra tham số đầu vào
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing Required Parameters !!",
        });
      } else {
        // Lưu thông tin vào cơ sở dữ liệu
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: "OKE",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll({});
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errMessage: "oke",
        errCode: 0,
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing Required Parameters !! ",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: {
            id: inputId,
          },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location,
              },
              attributes: ["doctorId", "provinceId"],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
        } else data = {};

        resolve({
          errMessage: "OKE",
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllSpecialtys = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll({});
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errMessage: "oke",
        errCode: 0,
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let updateSpecialtyData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("data", data);
      if (!data.id || !data.name) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let specialty = await db.Specialty.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (specialty) {
        specialty.name = data.name;

        if (data.avatar) {
          user.image = data.avatar;
        }
        console.log("specialy name", specialty);

        await specialty.save();

        resolve({
          errCode: 0,
          message: " Update Specialty Successfully !!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Specialty Not Found !!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteSpecialty = (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem phòng khám có tồn tại không
      let foundSpecialty = await db.Specialty.findOne({
        where: { id: specialtyId },
      });

      if (!foundSpecialty) {
        resolve({
          errCode: 2,
          errMessage: `Specialty doesn't exist`,
        });
      } else {
        // Xóa phòng khám
        await db.Specialty.destroy({
          where: { id: specialtyId },
        });

        resolve({
          errCode: 0,
          errMessage: `Specialty deleted successfully`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  getAllSpecialtys: getAllSpecialtys,
  updateSpecialtyData: updateSpecialtyData,
  deleteSpecialty: deleteSpecialty,
};
