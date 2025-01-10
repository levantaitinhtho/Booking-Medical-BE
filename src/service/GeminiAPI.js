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
app.post("/get", uploads.single("file"), async (req, res) => {
  const userInput = req.body.msg;  // Dữ liệu văn bản người dùng nhập
  const file = req.file;  // Kiểm tra xem có file tải lên không

  // Debugging: Kiểm tra dữ liệu gửi đi
  console.log("User Input:", userInput);
  console.log("File:", file);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Cấu trúc JSON yêu cầu đúng với API của Google
    const contents = [];

    // Thêm nội dung văn bản vào "parts"
    if (userInput) {
      contents.push({
        parts: [{ text: userInput }]  // Chắc chắn rằng "parts" có ít nhất 1 phần tử
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

    // Gửi yêu cầu đến Google Generative AI
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
