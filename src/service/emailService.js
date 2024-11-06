require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"IT Hopspital" <levantaitinhtho@gmail.com>',
    to: dataSend.reciverEmail,
    subject: "Thông tin đặt lịch khám bệnh tại Bệnh viện IT",
    html: getBodyHTMLEmail(dataSend),
  });
};
let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; color: #333;">
            <h2 style="text-align: center; color: #4CAF50;">Bệnh Viện IT</h2>
            <h3 style="text-align: center; color: #333;">Thông Tin Đặt Lịch Khám Bệnh</h3>
            <p>Xin chào, <strong>${dataSend.patientName}</strong>!</p>
            <p>Chúng tôi xin gửi thông tin lịch khám bệnh của bạn tại Bệnh viện IT như sau:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Họ và Tên:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
                      dataSend.patientName
                    }</strong></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Bác sĩ:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
                      dataSend.doctorName
                    }</strong></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Thời gian:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
                      dataSend.timeString || dataSend.time
                    }</strong></td>
                </tr>
            </table>

            <p>Vui lòng đến đúng giờ và mang theo các giấy tờ liên quan để thuận tiện cho quá trình khám.</p>

            <p style="text-align: center; color: #4CAF50; font-weight: bold;">
                Cảm ơn bạn đã lựa chọn Bệnh viện IT!<br>
                Chúc bạn có một buổi khám thuận lợi và nhanh chóng.
            </p>

            <div style="text-align: center; padding-top: 20px;">
                <a href="${
                  dataSend.redirectLink
                }" style="text-decoration: none; color: #fff; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">Xác nhận lịch hẹn</a>
            </div>

            <hr style="margin-top: 30px;">
            <p style="font-size: 12px; color: #666; text-align: center;">
                Bệnh viện IT, Tòa nhà A, Số 123 Đường IT, Quận 1, TP. Đà Nẵng<br>
                Điện thoại: 0123 456 789 | Email: support@benhvienit.vn or levantai@danit.vn
            </p>
        </div>
    `;
  }
  if (dataSend.language === "en") {
    result = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; color: #333;">
    <h2 style="text-align: center; color: #4CAF50;">IT Hospital</h2>
    <h3 style="text-align: center; color: #333;">Appointment Information</h3>
    <p>Hello, <strong>${dataSend.patientName}</strong>!</p>
    <p>We would like to share the details of your upcoming appointment at IT Hospital as follows:</p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Full Name:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
              dataSend.patientName
            }</strong></td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Doctor:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
              dataSend.doctorName
            }</strong></td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Time:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
              dataSend.timeString || dataSend.time
            }</strong></td>
        </tr>
    </table>

    <p>Please arrive on time and bring any relevant documents for a smooth check-in process.</p>

    <p style="text-align: center; color: #4CAF50; font-weight: bold;">
        Thank you for choosing IT Hospital!<br>
        We wish you a pleasant and efficient appointment experience.
    </p>

    <div style="text-align: center; padding-top: 20px;">
        <a href="${
          dataSend.redirectLink
        }" style="text-decoration: none; color: #fff; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">Confirm your appointment</a>
    </div>

    <hr style="margin-top: 30px;">
    <p style="font-size: 12px; color: #666; text-align: center;">
        IT Hospital, Building A, 123 IT Street, District 1, Da Nang City<br>
        Phone: 0123 456 789 | Email: support@benhvienit.vn or levantai@danit.vn
    </p>
</div>
`;
  }
  return result;
};
let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; color: #333;">
    <h2 style="text-align: center; color: #4CAF50;">Bệnh Viện IT</h2>
    <h3 style="text-align: center; color: #333;">Thông Báo Kết Quả Khám Bệnh</h3>
    <p>Xin chào, <strong>${dataSend.patientName}</strong>!</p>
    <p>Chúng tôi xin gửi thông báo rằng kết quả khám bệnh của bạn tại Bệnh viện IT đã sẵn sàng. Thông tin chi tiết như sau:</p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Họ và Tên:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
              dataSend.patientName
            }</strong></td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Bác sĩ:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
              dataSend.doctorName
            }</strong></td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Thời gian khám:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
              dataSend.timeString || dataSend.time
            }</strong></td>
        </tr>
    </table>

    <p>Vui lòng kiểm tra kết quả khám bệnh trong tệp đính kèm. Nếu có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>

    <p style="text-align: center; color: #4CAF50; font-weight: bold;">
        Cảm ơn bạn đã tin tưởng lựa chọn Bệnh viện IT!<br>
        Chúc bạn sức khỏe và sớm bình phục.
    </p>

    <div style="text-align: center; padding-top: 20px;">
        <a href="https://benhvienit.vn" style="text-decoration: none; color: #fff; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">Truy cập Website Bệnh Viện IT</a>
    </div>

    <hr style="margin-top: 30px;">
    <p style="font-size: 12px; color: #666; text-align: center;">
        Bệnh viện IT, Tòa nhà A, Số 123 Đường IT, Quận 1, TP. Đà Nẵng<br>
        Điện thoại: 0123 456 789 | Email: support@benhvienit.vn or levantai@danit.vn
    </p>
</div>
`;
  }
  if (dataSend.language === "en") {
    result =
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; color: #333;">
    <h2 style="text-align: center; color: #4CAF50;">IT Hospital</h2>
    <h3 style="text-align: center; color: #333;">Medical Examination Results Notification</h3>
    <p>Hello, <strong>${dataSend.patientName}</strong>!</p>
    <p>We are pleased to inform you that your examination results from IT Hospital are now available. Please find the details below:</p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Full Name:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
              dataSend.patientName
            }</strong></td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Doctor:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
              dataSend.doctorName
            }</strong></td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Examination Time:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${
              dataSend.timeString || dataSend.time
            }</strong></td>
        </tr>
    </table>

    <p>Please check the attached file for your examination results. If you have any questions, do not hesitate to reach out to us for assistance.</p>

    <p style="text-align: center; color: #4CAF50; font-weight: bold;">
        Thank you for choosing IT Hospital!<br>
        We wish you good health and a speedy recovery.
    </p>

    <div style="text-align: center; padding-top: 20px;">
        <a href="https://benhvienit.vn" style="text-decoration: none; color: #fff; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">Visit IT Hospital Website</a>
    </div>

    <hr style="margin-top: 30px;">
    <p style="font-size: 12px; color: #666; text-align: center;">
        IT Hospital, Building A, No. 123 IT Street, District 1, Da Nang City<br>
        Phone: +84 123 456 789 | Email: support@benhvienit.vn or levantai@danit.vn
    </p>
</div>
`;
  }

  return result;
};
let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });
      let info = await transporter.sendMail({
        from: '"Bệnh Viện IT Văn Tài" <levantaitinhtho@gmail.com>',
        to: dataSend.email,
        subject: "Kết quả đặt lịch khám bệnh",
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            filename: `VanTaiIT - ${
              dataSend.patientId
            }-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
};
