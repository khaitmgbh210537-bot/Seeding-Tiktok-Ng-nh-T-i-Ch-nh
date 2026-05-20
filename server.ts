import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy-initialize Gemini clean client to prevent startup runtime crashes
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
    return null;
  }
}

// Vietnamese authentic financial trading phrases for seeding fallback
const CRYPTO_FALLBACKS = [
  "Kèo này hold được không sếp? Em thấy nén chặt lắm rồi",
  "Target con SOL ngắn hạn bao nhiêu vậy sếp ơi?",
  "Uy tín quá sếp ơi, theo từ sáng giờ húp ngập mồm rồi!",
  "Sếp phân tích giùm con altcoin này rsi phân kỳ chưa ạ?",
  "Hôm nay có livestream bão tin altcoin không admin ơi?",
  "Cháy tài khoản nhiều lần quá, tìm được live sếp như tìm được phao cứu sinh vậy",
  "Sếp check hộ em xem xu hướng khung H4 con BTC với nha sếp",
  "Vào lệnh lúc nãy có bị trễ tàu không sếp ơi?",
  "Tín hiệu chất lượng thực sự, anh em follow lẹ kẻo lỡ đợt pump",
  "Nãy sếp kêu buy giá bao nhiêu ấy nhỉ, em vào trễ quá"
];

const FOREX_FALLBACKS = [
  "Cặp EU hôm nay dập dình quá, có tin tức gì mạnh không sếp?",
  "Lệnh này em lỡ đặt SL hơi gần, có dễ bị quét thanh khoản không ạ?",
  "Nghe sếp gồng lời chứ không gồng lỗ nữa, rút kinh nghiệm sâu sắc!",
  "Sếp ơi GBPUSD có nến pinbar đảo chiều chưa sếp?",
  "Chưa bao giờ trade nhàn như thế này, cảm ơn sếp nhiều nha",
  "Rung tay quá sếp ơi, có nên chốt non bớt một nửa volume không?",
  "Phương pháp quản lý vốn lệnh này thế nào là tối ưu nhất sếp?",
  "Hôm qua tin bão quét qua bay mất tài khoản demo, nay theo sếp gỡ gạc cơm gạo",
  "Sếp ơi livestream phân tích tin tức CPI tối nay mấy giờ bắt đầu thế ạ?",
  "Vừa khớp TP luôn, sếp vẽ nến đỉnh thực sự!"
];

const GOLD_FALLBACKS = [
  "Vàng lên nổi 2350 không sếp ơi? Thấy lực mua đang yếu dần",
  "Mới làm lệnh buy scalping Vàng theo sếp, target 3 giá thôi",
  "Bão vàng đi ác quá sếp gánh anh em nhé!",
  "Sếp ơi phân tích giùm em kháng cự cứng của XAU với",
  "Vàng đang sập mạnh, nến đỏ lòm rồi có nên cắt lỗ không sếp?",
  "Húp 50 pips vàng ngọt lịm buổi chiều, cảm ơn sếp yêu!",
  "Có kèo vàng tài khoản nhỏ không sếp em vốn chỉ 200 đô thôi",
  "Nay lướt sóng vàng sướng phát điên, cám ơn sếp dẫn đường chỉ lối"
];

const GENERIC_FALLBACKS = [
  "Livestream chất lượng thế này mà ít người xem uổng ghê",
  "Vào zoom trễ quá còn kèo nào không sếp?",
  "Phương pháp đỉnh cao thực sự, nghe thấm từng câu sếp ạ",
  "Kênh chính chủ ghim giùm em link đăng ký tài khoản với nha",
  "Cám ơn chia sẻ hữu ích của admin, thả tim mỏi tay luôn",
  "Đúng thị trường này thiếu kiến thức là nạp học phí hết sếp ơi",
  "Tài khoản của em bị âm 40% có cách nào cứu vãn không sếp",
  "Sếp rep ib hỗ trợ em vào nhóm VIP với nhé"
];

// 1. API - Check health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. API - Generate Strategy (AI consultation based on chosen niche/topic)
app.post("/api/generate-strategy", async (req, res) => {
  const { topic, niche = "Crypto", targetViewer = "Mới tham gia thị trường" } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // If Gemini client is not initialized, return a highly-polished mock strategy in Vietnamese
    const contentPillars = [
      {
        title: "Minh bạch kết quả giao dịch (Result-Oriented)",
        description: `Tập trung chia sẻ kết quả lợi nhuận thực tế thu được trong quá trình seeding, tạo sự uy tín tuyệt đối cho chủ đề ${topic}.`
      },
      {
        title: "Xóa tan nỗi sợ hãi mất tiền (Anti-FUD & Risk Mitigation)",
        description: "Bot seeding đặt câu hỏi thông minh khơi gợi kỹ thuật quản lý vốn, vị trí dừng lỗ (SL), khuyên bảo trader không nên FOMO."
      },
      {
        title: "Tương tác giáo dục kỹ năng (Educational Seeding)",
        description: "Các kịch bản bot gửi thắc mắc liên quan tới mẫu nến, chỉ báo kỹ thuật, giúp KOL có cơ hội giảng giải ngay trên livestream."
      },
      {
        title: "Hỏi đáp kích hoạt phễu khách hàng (Funnel Trigger)",
        description: "Đặt những câu hỏi dẫn dắt về nhóm tín hiệu VIP, khóa học chuyên sâu, thúc đẩy người xem click vào Bio Link/Zalo/Telegram."
      }
    ];

    const recommendedScript = niche === "Crypto" ? CRYPTO_FALLBACKS.slice(0, 5) : 
                              niche === "Forex" ? FOREX_FALLBACKS.slice(0, 5) : 
                              niche === "Gold" ? GOLD_FALLBACKS.slice(0, 5) : 
                              GENERIC_FALLBACKS.slice(0, 5);

    return res.json({
      recommendedScript,
      contentPillars,
      sentimentGoal: "Cực kỳ tích cực (90%+), hướng đến sự biết ơn chuyên môn & thúc đẩy lòng trung thành thương hiệu.",
      safetyTip: "Giãn cách thời gian seeding thông minh từ 10 - 20 giây tránh spam và giữ tỷ lệ rủi ro bằng 0% đối với tài khoản Tiktok chính."
    });
  }

  try {
    const prompt = `Bạn là chuyên gia tăng trưởng và định hướng dư luận (Growth Specialist) xuất sắc cho các kênh tài chính Tiktok.
Hãy xây dựng một kế hoạch seeding thông minh bằng Tiếng Việt cho chủ đề: "${topic}" thuộc ngách "${niche}" nhắm tới đối tượng "${targetViewer}".
Kế hoạch phải bao gồm:
1. 5 mẫu bình luận seeding cực kỳ tự nhiên, dùng đúng thuật ngữ/tiếng lóng trader Việt Nam (như sếp, buy, sell, gồng, cháy, SL, húp, cơm gạo, tàu, fud,...).
2. 4 cột trụ nội dung seeding chủ chốt (content pillars) để KOL tương tác dễ dàng.
3. Mục tiêu cảm xúc (sentimentGoal) cần đạt được của chiến dịch.
4. Lưu ý bảo mật an toàn tài khoản tránh bị quét spam.

Bạn PHẢI phản hồi chính xác dưới dạng cấu trúc JSON sau:
{
  "recommendedScript": ["comment1", "comment2", "comment3", "comment4", "comment5"],
  "contentPillars": [
    { "title": "Tiêu đề cột trụ 1", "description": "Mô tả chi tiết 1" },
    { "title": "Tiêu đề cột trụ 2", "description": "Mô tả chi tiết 2" },
    { "title": "Tiêu đề cột trụ 3", "description": "Mô tả chi tiết 3" },
    { "title": "Tiêu đề cột trụ 4", "description": "Mô tả chi tiết 4" }
  ],
  "sentimentGoal": "Mục tiêu cảm xúc của seeding",
  "safetyTip": "Lưu ý an toàn"
}
Hãy chỉ trả về duy nhất chuỗi JSON hợp lệ, không chứa ký tự markdown hay văn bản ngoài lề.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedScript: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            contentPillars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            },
            sentimentGoal: { type: Type.STRING },
            safetyTip: { type: Type.STRING }
          },
          required: ["recommendedScript", "contentPillars", "sentimentGoal", "safetyTip"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json(parsedData);
  } catch (error) {
    console.error("Gemini strategy generation failed:", error);
    // Fallback if Gemini request fails parsing
    return res.json({
      recommendedScript: CRYPTO_FALLBACKS.slice(0, 5),
      contentPillars: [
        { title: "Kỹ thuật thực chiến", description: "Hỏi về điểm vào lệnh (Entry) và các mẫu hình nến cốt lõi." },
        { title: "Xác thực uy tín", description: "Feedback gặt hái lợi nhuận từ các kèo lướt sóng của KOL." }
      ],
      sentimentGoal: "Tin tưởng & Tri ân sâu sắc chuyên môn của chuyên gia.",
      safetyTip: "Nên sử dụng mạng Proxy sạch để giãn cách đồng đều hành vi."
    });
  }
});

// 3. API - Generate Live Seeding Comments based on campaign context
app.post("/api/generate-seeds", async (req, res) => {
  const { campaignName, host, style = "tích cực", quantity = 5 } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Generate clean localized mock fallbacks matching campaign style
    let sourcePool = GENERIC_FALLBACKS;
    if (campaignName.toLowerCase().includes("forex")) {
      sourcePool = FOREX_FALLBACKS;
    } else if (campaignName.toLowerCase().includes("gold") || campaignName.toLowerCase().includes("vàng")) {
      sourcePool = GOLD_FALLBACKS;
    } else if (campaignName.toLowerCase().includes("crypto") || campaignName.toLowerCase().includes("btc") || campaignName.toLowerCase().includes("scalping")) {
      sourcePool = CRYPTO_FALLBACKS;
    }

    // Shuffle and pick quantity
    const shuffled = [...sourcePool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(quantity, shuffled.length));

    const comments = selected.map((comment, index) => ({
      id: `bot_lbl_${Math.floor(Math.random() * 900) + 100}_${index}`,
      botName: `Bot_${Math.floor(Math.random() * 900) + 100}`,
      text: comment.replace("@host", host),
      timeLabel: "Just now",
      sentiment: style === "hoài nghi" ? "skeptical" : style === "trung lập" ? "neutral" : "positive",
      campaignName
    }));

    return res.json({ comments });
  }

  try {
    const prompt = `Bạn đang vận hành hệ thống seeding tự động chất lượng cao cho Tiktok Live. 
Hãy tạo ra ${quantity} mẫu bình luận seeding cho chiến dịch live livestream "${campaignName}" của streamer "${host}".
Phong cách bình luận yêu cầu: "${style}". 
Lưu ý:
- Phải cực kỳ giống người thật đang xem livestream tài chính tại Việt Nam.
- Sử dụng thuật ngữ tài chính tiếng lóng tự nhiên của giới trader (cháy, gồng, SL, TP, entry, zoom, sếp, húp, cơm gạo,...).
- Đừng dùng các từ chào hỏi rập khuôn vô nghĩa. Hãy tập trung hỏi đáp khôn khéo hoặc khen ngợi thực tế.

Trả về kết quả dưới định dạng JSON chính xác:
{
  "comments": [
    {
      "botName": "Tên bot ngẫu nhiên (chữ và số gọn gàng, ví dụ: Bot_392, Bot_Kha, Bot_Trader9x)",
      "text": "Nội dung bình luận seeding tự nhiên",
      "sentiment": "positive hoặc neutral hoặc skeptical tương ứng phong cách"
    }
  ]
}
Chỉ xuất ra JSON, không thêm văn bản ngoài lề.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  botName: { type: Type.STRING },
                  text: { type: Type.STRING },
                  sentiment: { type: Type.STRING }
                },
                required: ["botName", "text", "sentiment"]
              }
            }
          },
          required: ["comments"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    // Add runtime IDs and clean labels
    const comments = parsedData.comments.map((comment: any, idx: number) => ({
      id: `bot_lbl_ai_${Math.floor(Math.random() * 900) + 100}_${idx}`,
      botName: comment.botName || `Bot_${Math.floor(Math.random() * 900) + 100}`,
      text: comment.text,
      timeLabel: "Just now",
      sentiment: comment.sentiment === "skeptical" ? "skeptical" : comment.sentiment === "neutral" ? "neutral" : "positive",
      campaignName
    }));

    return res.json({ comments });
  } catch (error) {
    console.error("Gemini seeding generation failed, falling back:", error);
    return res.json({
      comments: [
        {
          id: `bot_err_1`,
          botName: "Bot_901",
          text: `Uy tín quá sếp ơi, theo kèo ${campaignName} từ chiều húp đậm`,
          timeLabel: "Just now",
          sentiment: "positive",
          campaignName
        },
        {
          id: `bot_err_2`,
          botName: "Bot_128",
          text: "Sếp cho xin điểm vào lệnh tối ưu nhất ạ?",
          timeLabel: "Just now",
          sentiment: "neutral",
          campaignName
        }
      ]
    });
  }
});


// Vite Dev Server Integration Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SeedAI Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
