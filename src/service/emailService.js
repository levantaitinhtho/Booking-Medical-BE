require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) =>{
    let transporter = nodemailer.createTransport({
        host : "smtp.gmail.com",
        port: 587,
        secure : false,
        auth:{
            user: process.env.EMAIL_APP,
            pass : process.env.EMAIL_APP_PASSWORD
        },
    });

    let info = await transporter.sendMail({
        from: '"Bệnh Viện IT" <levantaitinhtho@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch khám bệnh tại Bệnh viện IT",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; color: #333;">
                <h2 style="text-align: center; color: #4CAF50;">Bệnh Viện IT</h2>
                <h3 style="text-align: center; color: #333;">Thông Tin Đặt Lịch Khám Bệnh</h3>
                <p>Xin chào, <strong>${dataSend.patientName}</strong>!</p>
                <p>Chúng tôi xin gửi thông tin lịch khám bệnh của bạn tại Bệnh viện IT như sau:</p>
    
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Họ và Tên:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${dataSend.patientName}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Bác sĩ:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${dataSend.doctorName}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Thời gian:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${dataSend.timeString || dataSend.time}</strong></td>
                    </tr>
                </table>
    
                <p>Vui lòng đến đúng giờ và mang theo các giấy tờ liên quan để thuận tiện cho quá trình khám.</p>
    
                <p style="text-align: center; color: #4CAF50; font-weight: bold;">
                    Cảm ơn bạn đã lựa chọn Bệnh viện IT!<br>
                    Chúc bạn có một buổi khám thuận lợi và nhanh chóng.
                </p>
    
                <div style="text-align: center; padding-top: 20px;">
                    <a href="${dataSend.redirectLink}" style="text-decoration: none; color: #fff; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">https://benhvienit.vn</a>
                </div>
    
                <hr style="margin-top: 30px;">
                <p style="font-size: 12px; color: #666; text-align: center;">
                    Bệnh viện IT, Tòa nhà A, Số 123 Đường IT, Quận 1, TP. Đà Nẵng<br>
                    Điện thoại: 0123 456 789 | Email: support@benhvienit.vn or levantai@danit.vn
                </p>
            </div>
        `
    });
    
}
module.exports ={
    sendSimpleEmail:sendSimpleEmail
}