import { sendToGeminiAI } from '../service/GeminiAPI'; // Import đúng hàm sendToGeminiAI từ service

// Controller xử lý gửi tin nhắn và nhận phản hồi từ Gemini AI
let sendMessageToGemini = async (req, res) => {
  try {
    const userMessage = req.body.query; // Lấy tin nhắn người dùng từ body của yêu cầu

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' }); // Kiểm tra nếu không có tin nhắn
    }

    // Gọi service để gửi tin nhắn đến Gemini AI
    const response = await sendToGeminiAI(userMessage); // Gọi đúng hàm từ service

    // Trả về kết quả phản hồi từ Gemini AI
    res.status(200).json({ reply: response });
  } catch (error) {
    console.error('Error in sendMessageToGemini:', error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

module.exports = {
  sendMessageToGemini
};
