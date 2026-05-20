import { Campaign, BotComment, ProxyNode } from "./types";

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_1",
    name: "Forex Scalping 101",
    host: "@TraderPro_VN",
    accountCount: 450,
    frequency: "12/phút",
    status: "Live",
    sentimentStyle: "Tập trung chuyên môn"
  },
  {
    id: "camp_2",
    name: "Crypto News Daily",
    host: "@MoonSeeker",
    accountCount: 280,
    frequency: "8/phút",
    status: "Live",
    sentimentStyle: "Khen ngợi bùng nổ"
  },
  {
    id: "camp_3",
    name: "TikTok Shop Live Sale",
    host: "@StoreVN_Official",
    accountCount: 890,
    frequency: "24/phút",
    status: "Live",
    sentimentStyle: "Chốt đơn liên tục"
  },
  {
    id: "camp_4",
    name: "Gold Trading Signal",
    host: "@XAU_Master",
    accountCount: 150,
    frequency: "5/phút",
    status: "Live",
    sentimentStyle: "Quản lý vốn chặt chẽ"
  }
];

export const INITIAL_PREVIEW_COMMENTS: BotComment[] = [
  {
    id: "prev_1",
    botName: "Bot_442",
    text: "Kèo này hold được không anh?",
    timeLabel: "Just now",
    sentiment: "positive",
    campaignName: "Gold Trading Signal"
  },
  {
    id: "prev_2",
    botName: "Bot_128",
    text: "SL đặt ở đâu tối ưu ạ?",
    timeLabel: "2s ago",
    sentiment: "neutral",
    campaignName: "Forex Scalping 101"
  },
  {
    id: "prev_3",
    botName: "Bot_901",
    text: "Uy tín quá sếp ơi, theo từ sáng giờ",
    timeLabel: "5s ago",
    sentiment: "positive",
    campaignName: "Crypto News Daily"
  },
  {
    id: "prev_4",
    botName: "Bot_012",
    text: "Vàng lên 2350 không anh em?",
    timeLabel: "8s ago",
    sentiment: "skeptical",
    campaignName: "Gold Trading Signal"
  }
];

export const INITIAL_TIKTOK_COMMENTS = [
  { id: "tk_1", name: "Quân Crypto", text: "Coin này còn vào được không anh? Thấy đang nén đẹp quá!", color: "text-[#00f2ff]", border: "border-[#00f2ff]" },
  { id: "tk_2", name: "Thanh Forex", text: "Lệnh này SL ở đâu sếp ơi? Sợ quét thanh khoản quá.", color: "text-[#dcb8ff]", border: "border-[#dcb8ff]" },
  { id: "tk_3", name: "Minh Gold", text: "Cảm ơn sếp, lệnh hồi sáng húp ngập mồm rồi!", color: "text-[#00f2ff]", border: "border-[#00f2ff]" },
  { id: "tk_4", name: "Trader X", text: "Sếp check hộ em con SOL với, target bao nhiêu ạ?", color: "text-[#ffe16d]", border: "border-[#ffe16d]" },
  { id: "tk_5", name: "Vinh Trading", text: "Live này bánh cuốn quá, học được bao nhiêu trick.", color: "text-[#dcb8ff]", border: "border-[#dcb8ff]" }
];

export const PROXY_NODES: ProxyNode[] = [
  { id: "node_1", name: "HCMC-VNG-Node-01", ip: "118.69.12.44", latency: 12, status: "online", location: "Việt Nam (Hồ Chí Minh)" },
  { id: "node_2", name: "HN-Viettel-Node-02", ip: "115.79.43.109", latency: 14, status: "online", location: "Việt Nam (Hà Nội)" },
  { id: "node_3", name: "SGP-DigitalOcean-Node-05", ip: "178.128.85.23", latency: 28, status: "online", location: "Singapore" },
  { id: "node_4", name: "HK-GCP-Node-09", ip: "34.96.143.12", latency: 32, status: "online", location: "Hong Kong" },
  { id: "node_5", name: "US-GCP-Node-Backup", ip: "34.22.112.55", latency: 185, status: "offline", location: "Hoa Kỳ" }
];
