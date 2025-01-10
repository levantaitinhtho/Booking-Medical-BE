require("dotenv").config();
const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
global.fetch = require("node-fetch");
global.Headers = require("node-fetch").Headers;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Thiết lập multer để lưu file tải lên vào thư mục 'uploads/'
const uploads = multer({ dest: "uploads/" });

if (!process.env.GEMINI_API_KEY) {
  console.log("Error: GEMINI_API_KEY is missing");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Danh sách từ khóa y tế
const medicalKeywords = [
  "bệnh", "triệu chứng", "chẩn đoán", "y tế", "thăm khám", "thuốc", "bệnh viện", "bác sĩ", "sức khỏe","cảm thấy","bị","đau","cách","điều trị","hướng dẫn","tư vấn","chuẩn đoán","chữa","nào"
];

// Hàm kiểm tra nếu nội dung người dùng có liên quan đến y tế
function isMedicalQuery(userInput) {
  return medicalKeywords.some(keyword => userInput.toLowerCase().includes(keyword.toLowerCase()));
}

// Cấu hình CORS chỉ cho phép truy cập từ localhost:3000
app.use(cors({
  origin: 'http://localhost:3000', // Chỉ cho phép yêu cầu từ localhost:3000
  methods: ['GET', 'POST'], // Các phương thức HTTP được cho phép
  allowedHeaders: ['Content-Type', 'Authorization'] // Các header được phép
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Đoạn mã kiểm tra trạng thái server
app.get("/api/check-status", (req, res) => {
  res.status(200).json({ message: "Gemini AI is running." });
});

// API xử lý yêu cầu với file và dữ liệu văn bản
// API xử lý yêu cầu với file và dữ liệu văn bản
app.post("/get", uploads.single("file"), async (req, res) => {
  const userInput = req.body.msg;  // Dữ liệu văn bản người dùng nhập
  const file = req.file;  // Kiểm tra xem có file tải lên không

  // Debugging: Kiểm tra dữ liệu gửi đi
  console.log("User Input:", userInput);
  console.log("File:", file);

  // Kiểm tra nếu nội dung không liên quan đến y tế
  if (!isMedicalQuery(userInput)) {
    return res.status(400).send("Vui lòng chỉ nhập câu hỏi hoặc yêu cầu liên quan đến y tế.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const contents = [];

    // Thêm nội dung văn bản vào "parts"
    if (userInput) {
      // Thêm context y tế vào yêu cầu
      const medicalContext = "Bạn là một chuyên gia về chăm sóc sức khỏe và tư vấn y tế. Bạn sẽ cung cấp câu trả lời chính xác và dễ hiểu cho bệnh nhân và thật ngắn gọn.";
      contents.push({
        parts: [{ text: `${medicalContext} ${userInput}` }]  // Kết hợp nội dung yêu cầu với bối cảnh chăm sóc sức khỏe
      });
    }

    // Nếu có file ảnh, thêm dữ liệu ảnh vào yêu cầu
    if (file) {
      const fileData = fs.readFileSync(file.path);
      const image = {
        inlineData: {
          data: Buffer.from(fileData).toString("base64"),  // Đảm bảo mã hóa file ảnh thành base64
          mimeType: file.mimetype,  // Đảm bảo mimeType đúng
        },
      };
      contents.push({
        parts: [{
          image
        }]
      });
    }

    // Nếu không có dữ liệu nội dung hoặc ảnh, gửi thông báo lỗi
    if (contents.length === 0) {
      return res.status(400).send("No valid content provided.");
    }

    // Gửi yêu cầu đến Google Generative AI với bối cảnh chăm sóc sức khỏe
    const response = await model.generateContent({ contents });
    res.send(response.response.text());  // Trả lại kết quả từ AI
  } catch (err) {
    console.error("Error response", err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Xóa file nếu có sau khi xử lý xong
    if (file) {
      fs.unlinkSync(file.path);
    }
  }
});


// Cấu hình port cho server
const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
