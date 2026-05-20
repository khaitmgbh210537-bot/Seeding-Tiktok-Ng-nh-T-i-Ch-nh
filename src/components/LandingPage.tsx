import React, { useState, useEffect } from "react";
import { 
  Rocket, 
  TrendingUp, 
  MessagesSquare, 
  WifiOff, 
  MessageCircle, 
  Frown, 
  Users, 
  Eye, 
  BadgeCheck, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Brain,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Send,
  Zap,
  Globe,
  CornerDownRight,
  ShieldCheck,
  X,
  Database,
  Share2,
  UserPlus,
  ShoppingBag,
  Video,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_TIKTOK_COMMENTS } from "../data";
import { StrategyResponse } from "../types";

interface LandingPageProps {
  onEnterDashboard: () => void;
}

const featuresList = [
  {
    title: "CHỨC NĂNG QUẢN LÝ",
    icon: Database,
    color: "#00f2ff",
    items: [
      "Quản lý tập trung toàn bộ tài khoản, nội dung, video và proxy trên cùng hệ thống",
      "Hỗ trợ phân loại, nhóm, đổi tên, theo dõi trạng thái hoạt động",
      "Lưu trữ và sắp xếp video, nội dung theo danh mục, chiến dịch",
      "Gắn proxy riêng cho từng tài khoản để tăng bảo mật, tránh checkpoint"
    ]
  },
  {
    title: "TĂNG TƯƠNG TÁC TÀI KHOẢN",
    icon: Share2,
    color: "#dcb8ff",
    items: [
      "Theo dõi bạn bè, người đã theo dõi hoặc theo UID chỉ định",
      "Tương tác livestream: xem, like, comment trong thời gian thực",
      "Tương tác bình luận và âm thanh để tăng độ tin cậy và đề xuất tài khoản"
    ]
  },
  {
    title: "CHỨC NĂNG ĐĂNG",
    icon: Video,
    color: "#6dff94",
    items: [
      "Đăng hàng loạt video lên nhiều tài khoản TikTok cùng lúc",
      "Tự động lên lịch đăng bài theo khung giờ cài đặt sẵn",
      "Lưu lại toàn bộ lịch sử và trạng thái các video đã đăng"
    ]
  },
  {
    title: "CHỨC NĂNG BÌNH LUẬN",
    icon: MessageSquare,
    color: "#3ba3ff",
    items: [
      "Tự động bình luận trên các bài viết hoặc video được chỉ định cụ thể (theo ID, nhóm, hoặc hồ sơ)",
      "Bình luận vào các bài viết, video hoặc chủ đề chứa từ khóa mục tiêu",
      "Bình luận trên các bài viết hoặc video có hashtag đang được quan tâm để tăng độ hiển thị",
      "Tự động phản hồi các bình luận trên bài viết/video để duy trì tương tác tự nhiên"
    ]
  },
  {
    title: "SEEDING TỰ ĐỘNG",
    icon: Zap,
    color: "#ffaa3b",
    items: [
      "Seeding video: Tăng lượt xem, like, bình luận cho video mục tiêu",
      "Seeding âm thanh: Đẩy tương tác cho video gắn nhạc xu hướng",
      "Seeding từ khóa: Tự động seeding theo chủ đề, sản phẩm hoặc hashtag",
      "Seeding livestream: Tăng mắt, tim, bình luận, chia sẻ giúp livestream sôi động",
      "Seeding UID: Tương tác trực tiếp theo danh sách người dùng mục tiêu"
    ]
  }
];

const pricingPlans = [
  {
    name: "GÓI 1 NĂM",
    price: "3.000.000đ",
    originalPrice: "4.500.000đ",
    period: "12 tháng sử dụng",
    description: "Giải pháp tối ưu cho cá nhân, nhà sáng tạo nội dung hoặc KOLs/KOCs mới bắt đầu xây dựng uy tín.",
    features: [
      "Đầy đủ tính năng Seeding & Auto interaction",
      "Quản lý không giới hạn tài khoản TikTok",
      "Tương tác livestream & video trực tiếp tự động",
      "Cài đặt kịch bản bình luận chống spam thông minh",
      "Hỗ trợ chuyên gia kỹ thuật 1-1 trong 1 tháng đầu",
      "Cập nhật tất cả tính năng mới hoàn toàn miễn phí"
    ],
    badge: "Phổ biến",
    badgeColor: "bg-[#00f2ff]/10 text-[#00f2ff] border-[#00f2ff]/30",
    glowColor: "shadow-[0_0_20px_rgba(0,242,255,0.1)] hover:shadow-[0_0_35px_rgba(0,242,255,0.25)] hover:border-[#00f2ff]/50",
    buttonBg: "bg-[#00f2ff] text-[#00363a] hover:bg-[#00d7e3]"
  },
  {
    name: "GÓI 5 NĂM",
    price: "7.000.000đ",
    originalPrice: "15.000.000đ",
    period: "60 tháng sử dụng",
    description: "Sự lựa chọn hoàn hảo của các doanh nghiệp, founders mảng Crypto/Forex cần duy trì ổn định & tiết kiệm tối đa.",
    features: [
      "Bao gồm toàn bộ tính năng Gói 1 Năm",
      "Tặng kho kịch bản seeding tài chính & crypto tối ưu sẵn",
      "Ưu tiên luồng kết nới Proxy siêu sạch tự động",
      "Tiết kiệm hơn 53% chi phí duy trì hàng năm",
      "Support đội ngũ kỹ thuật 24/7 suốt thời gian sử dụng",
      "Bảo hành tài khoản & tối ưu hệ thống định kỳ"
    ],
    badge: "Tiết kiệm 53%",
    badgeColor: "bg-[#dcb8ff]/15 text-[#dcb8ff] border-[#dcb8ff]/30",
    glowColor: "shadow-[0_0_25px_rgba(220,184,255,0.15)] hover:shadow-[0_0_40px_rgba(220,184,255,0.3)] hover:border-[#dcb8ff]/50",
    buttonBg: "bg-[#dcb8ff] text-[#2c0054] hover:bg-[#c99eff]"
  },
  {
    name: "GÓI 10 NĂM",
    price: "12.000.000đ",
    originalPrice: "30.000.000đ",
    period: "120 tháng sử dụng",
    description: "Đầu tư trọn đời cho dự án lớn. Cam kết đồng hành và phát triển bền vững cùng sự thịnh vượng của hệ sinh thái.",
    features: [
      "Toàn quyền truy cập tất cả tài nguyên MKT TIKPRO",
      "Sử dụng không giới hạn luồng, thiết bị & IP Proxy",
      "Tham gia Group kín VIP chia sẻ kịch bản chuyển đổi đỉnh cao",
      "Đặc quyền tùy biến kịch bản AI độc quyền theo thương hiệu",
      "Chuyên gia AI setup & tối ưu hóa vận hành trực tiếp",
      "Đầu tư một lần, tối ưu hóa lợi nhuận trọn đời"
    ],
    badge: "Trọn đời tốt nhất",
    badgeColor: "bg-[#ffe16d]/15 text-[#ffe16d] border-[#ffe16d]/30",
    glowColor: "shadow-[0_0_25px_rgba(255,225,109,0.12)] hover:shadow-[0_0_45px_rgba(255,225,109,0.25)] hover:border-[#ffe16d]/50",
    buttonBg: "bg-[#ffe16d] text-[#413600] hover:bg-[#ebd05d]"
  }
];

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  // Animated Live Viewers Count
  const [liveViewers, setLiveViewers] = useState(124);
  
  // comment streams list
  const [commentStream, setCommentStream] = useState(INITIAL_TIKTOK_COMMENTS.slice(0, 3));
  const [nextCommentIndex, setNextCommentIndex] = useState(3);

  // FAQ Expand Accordion States
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // AI Strategy Consultant Modal State
  const [isConsulting, setIsConsulting] = useState(false);
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState<"Crypto" | "Forex" | "Gold" | "Custom">("Crypto");
  const [targetViewer, setTargetViewer] = useState("Mới chơi, chưa có nhiều kinh nghiệm");
  const [isLoadingStrategy, setIsLoadingStrategy] = useState(false);
  const [strategyResult, setStrategyResult] = useState<StrategyResponse | null>(null);
  const [consultationError, setConsultationError] = useState("");

  // Live Viewers Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => {
        const delta = Math.floor(Math.random() * 15) - 7;
        const next = prev + delta;
        return next < 50 ? 55 : next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Comments Stream Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCommentStream(prev => {
        const nextCommentObj = INITIAL_TIKTOK_COMMENTS[nextCommentIndex % INITIAL_TIKTOK_COMMENTS.length];
        const uniqueComment = {
          ...nextCommentObj,
          id: `comment_dynamic_${Date.now()}`
        };
        const updated = [...prev, uniqueComment];
        if (updated.length > 3) {
          updated.shift();
        }
        return updated;
      });
      setNextCommentIndex(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [nextCommentIndex]);

  // Handle Strategy Generation
  const handleGenerateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setConsultationError("Vui lòng điền chủ đề/sản phẩm của bạn");
      return;
    }

    setIsLoadingStrategy(true);
    setConsultationError("");
    setStrategyResult(null);

    try {
      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, niche, targetViewer }),
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối với máy chủ AI");
      }

      const data = await response.json();
      setStrategyResult(data);
    } catch (err: any) {
      setConsultationError(err.message || "Đã xảy ra lỗi khi tạo chiến lược. Vui lòng thử lại!");
    } finally {
      setIsLoadingStrategy(false);
    }
  };

  return (
    <div id="landing-page" className="tech-grid min-h-screen relative text-[#dee1f7] bg-[#0e1322]">
      {/* Decorative Aurora background particles */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-[#00f2ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-[450px] h-[450px] bg-[#dcb8ff]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="fixed top-0 w-full z-40 bg-[#0e1322]/40 backdrop-blur-xl border-b border-[#3a494b]/20">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center h-20 px-6">
          <div className="flex items-center gap-3">
            <span className="text-[#00f2ff] p-2 bg-[#00f2ff]/10 rounded-lg animate-pulse">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="font-headline-xl text-2xl font-black tracking-tight text-[#00f2ff] uppercase">
              TikTokSeed.AI
            </span>
          </div>

          <nav className="hidden xl:flex items-center gap-6">
            <a href="#pain-points" className="text-sm font-semibold tracking-wide text-[#b9cacb] hover:text-[#00f2ff] transition-colors font-sans">THÁCH THỨC</a>
            <a href="#solutions" className="text-sm font-semibold tracking-wide text-[#b9cacb] hover:text-[#00f2ff] transition-colors font-sans">GIẢI PHÁP</a>
            <a href="#features" className="text-sm font-semibold tracking-wide text-[#b9cacb] hover:text-[#00f2ff] transition-colors font-sans">TÍNH NĂNG</a>
            <a href="#pricing" className="text-sm font-semibold tracking-wide text-[#b9cacb] hover:text-[#00f2ff] transition-colors font-sans text-[#ffe16d]">BẢNG GIÁ</a>
            <a href="#seeding-preview" className="text-sm font-semibold tracking-wide text-[#b9cacb] hover:text-[#00f2ff] transition-colors font-sans">XEM LIVE MOCKUP</a>
            <a href="#results" className="text-sm font-semibold tracking-wide text-[#b9cacb] hover:text-[#00f2ff] transition-colors font-sans">KẾT QUẢ</a>
            <a href="#faq" className="text-sm font-semibold tracking-wide text-[#b9cacb] hover:text-[#00f2ff] transition-colors font-sans">HỎI ĐÁP</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={onEnterDashboard}
              className="text-sm font-bold text-[#b9cacb] hover:text-[#00f2ff] transition-colors"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => {
                setIsConsulting(true);
                setStrategyResult(null);
                setTopic("");
              }}
              className="px-6 py-2.5 rounded-lg font-bold bg-gradient-to-r from-[#00f2ff] to-[#7701d0] text-[#00363a] glow-primary hover:scale-[1.03] transition-transform cursor-pointer active:scale-95"
            >
              Trải nghiệm thử AI
            </button>
          </div>
        </div>
      </header>

      {/* Section 1: Hero */}
      <section className="pt-32 pb-20 max-w-[1280px] mx-auto px-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00f2ff]/10 border border-[#480081]/30 text-[#00f2ff] font-mono text-xs">
              <Rocket className="h-4.5 w-4.5 text-[#00f2ff] animate-bounce" />
              <span className="font-bold tracking-wider uppercase text-[10px]">INSTITUTIONAL GRADE AI SEEDING</span>
            </div>

            <h1 className="font-headline-xl text-4xl lg:text-5xl font-black text-[#dee1f7] leading-tight">
              Tăng Độ Uy Tín TikTok Cho <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#efdbff] drop-shadow-[0_0_15px_rgba(0,242,255,0.2)]">Crypto & Forex</span>
            </h1>

            <p className="text-[#b9cacb] text-base lg:text-lg leading-relaxed max-w-lg">
              Giúp livestream và video tài chính trở nên đông người, nhiều tương tác và đáng tin hơn trên TikTok bằng hệ thống Seeding thông minh 4.0.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => {
                  setIsConsulting(true);
                  setStrategyResult(null);
                  setTopic("");
                }}
                className="px-8 py-4 font-bold text-base rounded-xl bg-[#00f2ff] text-[#00363a] shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_35px_rgba(0,242,255,0.5)] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                Nhận tư vấn chiến lược AI
              </button>
              <button 
                onClick={onEnterDashboard}
                className="px-8 py-4 font-bold text-base rounded-xl bg-slate-900/40 text-[#dee1f7] border border-[#b9cacb]/20 hover:border-[#00f2ff]/60 hover:bg-[#1a1f2f]/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                Vào Command Center →
              </button>
            </div>

            <div className="flex items-center gap-5 pt-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#0e1322] bg-[#1a1f2f] flex items-center justify-center font-bold text-xs text-[#00f2ff]">F</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0e1322] bg-[#25293a] flex items-center justify-center font-bold text-xs text-[#dcb8ff]">T</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0e1322] bg-[#2f3445] flex items-center justify-center font-bold text-xs text-[#ffe16d]">C</div>
              </div>
              <p className="text-xs font-bold font-sans text-[#b9cacb] uppercase tracking-widest bg-slate-950/40 px-3 py-1.5 rounded-md border border-slate-800">
                Được tin dùng bởi 200+ Crypto & Forex Founders
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Soft grid lighting */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00f2ff]/10 via-transparent to-[#dcb8ff]/10 rounded-3xl filter blur-xl" />
            
            <div className="glass-card rounded-2xl p-5 border border-slate-700/30 shadow-2xl overflow-hidden relative group">
              <img 
                alt="Báo cáo SeedAI"
                className="rounded-xl w-full h-[380px] lg:h-[420px] object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                src="/src/assets/images/financial_chart_bg_1779245566502.png"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0e1322] via-[#0e1322]/40 to-transparent" />
              
              {/* Dynamic Floating overlays */}
              <div className="absolute top-8 -left-6 glass-card px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg border-l-4 border-l-[#00f2ff] animate-bounce" style={{ animationDuration: '4s' }}>
                <Eye className="h-5 w-5 text-[#00f2ff]" />
                <div>
                  <p className="text-[10px] text-[#b9cacb] uppercase tracking-wider font-mono">Live Viewers</p>
                  <p className="font-mono text-base font-bold text-[#00f2ff]">{liveViewers} Mắt</p>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 glass-card px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg border-r-4 border-r-[#dcb8ff]">
                <MessageSquare className="h-5 w-5 text-[#dcb8ff]" />
                <div>
                  <p className="text-[10px] text-[#b9cacb] uppercase tracking-wider font-mono">AI Activity</p>
                  <p className="font-mono text-base font-bold text-[#dcb8ff]">842 bình luận/phút</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Pain Points */}
      <section id="pain-points" className="py-20 max-w-[1280px] mx-auto px-6 border-t border-slate-800/40">
        <div className="text-center mb-16 space-y-3">
          <h2 className="font-headline-xl text-3xl lg:text-4xl font-extrabold text-[#dee1f7] tracking-tight">
            Thách Thức Của Trader & KOL Tài Chính
          </h2>
          <p className="text-[#b9cacb] max-w-xl mx-auto text-base">
            Sự vắng vẻ trên kênh truyền thông là rào cản lớn nhất khiến bạn không thể chốt đơn đăng ký sàn hoặc xây dựng uy tín cá nhân.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl border-l-4 border-l-[#ffb4ab] bg-[#1a1f2f]/10">
            <div className="p-3 bg-[#ffb4ab]/10 rounded-lg w-fit text-[#ffb4ab] mb-6">
              <WifiOff className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-[#dee1f7] mb-3">Live Forex vắng vẻ làm nản lòng?</h3>
            <p className="text-[#b9cacb] leading-relaxed text-sm">
              Tâm lý đám đông là chìa khóa. Một phòng livestream chỉ lẹt đẹt 5-10 người xem sẽ khiến kiến thức phân tích kỹ thuật triệu đô của bạn trông thật "rẻ tiền" và thiếu sức hút.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border-l-4 border-l-[#dcb8ff] bg-[#1a1f2f]/10">
            <div className="p-3 bg-[#dcb8ff]/10 rounded-lg w-fit text-[#dcb8ff] mb-6">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-[#dee1f7] mb-3">Video Crypto không thấy comment?</h3>
            <p className="text-[#b9cacb] leading-relaxed text-sm">
              Video đăng lên không có tương tác thắc mắc từ cộng đồng sẽ bị thuật toán TikTok rà quét và giới hạn phân phối. Mọi nỗ lực quay chụp và dựng video của bạn bị vứt xó.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border-l-4 border-l-[#00f2ff] bg-[#1a1f2f]/10">
            <div className="p-3 bg-[#00f2ff]/10 rounded-lg w-fit text-[#00f2ff] mb-6">
              <Frown className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-[#dee1f7] mb-3">Người xem khép lòng, hoài nghi?</h3>
            <p className="text-[#b9cacb] leading-relaxed text-sm">
              Trong thị trường Forex & Crypto đầy cam go, "Trải nghiệm và sự uy tín" là tiền bạc. Thiếu feeback tài khoản có lãi, thiếu cộng đồng hỏi đáp, khách hàng tiềm năng sẽ lập tức rời đi.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Solutions */}
      <section id="solutions" className="py-20 bg-slate-950/30 border-t border-slate-800/40">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                alt="Giải pháp Seeding AI" 
                className="rounded-2xl border border-slate-800 shadow-2xl w-full h-[360px] lg:h-[400px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkwnCurFnT_Olgz5zwbfAIlsIR_henZy4SGg17MrzxOT9ZVKC0yRSa1Oua7pj0Gg1SKVtOVzkQWwhd3OL37BXyRDTGdpbSUadpeFoU-mf3IG6coWXWWR0vRxbqKp2d71ZxPpjTP7-My48LFIs5VKOPExiKyEO9iNzIz7s9PUNiznzSLg-NcQAW5ynNxZThuvZ99jk4a5gUitHB1SoOa9n9mVrw2wzDgX8P1fOutJgo8kVSB-KOp5vATV49gSU_AN3cG7cW8eYZ6Q"
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-widest text-[#00f2ff] uppercase bg-[#00f2ff]/10 px-3 py-1 rounded-md">PRO SYSTEM</span>
                <h2 className="font-headline-xl text-3xl font-heading text-[#dee1f7] leading-tight">
                  Giải Pháp Seeding Đỉnh Cao Thế Hệ Mới
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-[#00f2ff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00f2ff] transition-all duration-300">
                    <Users className="h-6 w-6 text-[#00f2ff] group-hover:text-[#00363a]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#dee1f7] mb-1">Tạo hiệu ứng đám đông FOMO</h4>
                    <p className="text-sm text-[#b9cacb] leading-relaxed">
                      Kích thích người xem thật chủ động tham gia thảo luận sâu thông qua hệ thống tài khoản seeding được huấn luyện tâm lý hành vi.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-[#dcb8ff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#dcb8ff] transition-all duration-300">
                    <Eye className="h-6 w-6 text-[#dcb8ff] group-hover:text-[#480081]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#dee1f7] mb-1">Tự động tăng mắt Livestream, đẩy xu hướng</h4>
                    <p className="text-sm text-[#b9cacb] leading-relaxed">
                      Giữ chân người xem bằng các kịch bản tương tác ngắt quãng cực kỳ thực tế, kích hoạt thuật toán ưu ái đẩy live của bạn lên tab Xu hướng.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-[#ffe16d]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ffe16d] transition-all duration-300">
                    <BadgeCheck className="h-6 w-6 text-[#ffe16d] group-hover:text-[#221b00]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#dee1f7] mb-1">Xây dựng vị thế chuyên gia tối thượng</h4>
                    <p className="text-sm text-[#b9cacb] leading-relaxed">
                      Điều hướng suy nghĩ đám đông theo chủ đích, làm nổi bật kết quả lãi ròng, kích hoạt động cơ click vào link giới thiệu sàn giao dịch của bạn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Live Mock Seeding Visualizer */}
      <section id="seeding-preview" className="py-20 max-w-[1280px] mx-auto px-6 border-b border-slate-800/40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="font-headline-xl text-3xl font-extrabold text-[#dee1f7]">
              Seeding Khoa Học, <span className="text-[#dcb8ff] underline decoration-wavy">Không Phải Spam Vô Nghĩa</span>
            </h2>
            <p className="text-[#b9cacb] leading-relaxed text-sm">
              Chúng tôi không sử dụng các bot rập khuôn vô hồn gửi tin nhắn nhảm nhí. Hệ thống Seeding thông minh áp dụng AI tiên tiến nhất hiện tại để thiết kế câu từ đúng ngôn thói, đúng hệ tư tưởng trader chuyên nghiệp.
            </p>

            <ul className="space-y-4 pt-2">
              <li className="flex items-center gap-3">
                <span className="p-1 rounded-full bg-[#00f2ff]/10 text-[#00f2ff]">
                  <CheckCircle className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-[#dee1f7]">Tự thiết kế kịch bản cá nhân hóa cho từng thị trường tiền tệ</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="p-1 rounded-full bg-[#dcb8ff]/10 text-[#dcb8ff]">
                  <CheckCircle className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-[#dee1f7]">Tài khoản nuôi có đầy đủ profile ảnh đại diện cực kỳ tự nhiên</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="p-1 rounded-full bg-[#ffe16d]/10 text-[#ffe16d]">
                  <CheckCircle className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-[#dee1f7]">Giãn cách chu kỳ phản hồi từ động và mượt mà, chống chặn</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1a1f2f]/20 rounded-2xl p-6 border border-slate-800 relative shadow-inner overflow-hidden">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#b9cacb] mb-4 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#00f2ff] animate-ping" />
              TIN NHẮN CHẠY THỬ TRÊN STREAM (LIVE SIMULATOR)
            </h3>

            <div className="h-[250px] flex flex-col justify-end gap-3 pointer-events-none">
              <AnimatePresence initial={false}>
                {commentStream.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/40 flex items-start gap-3 shadow"
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-[#b9cacb]">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${item.color} mb-0.5`}>{item.name}</p>
                      <p className="text-sm text-[#dee1f7]">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Results */}
      <section id="results" className="py-20 max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <h2 className="font-headline-xl text-3xl lg:text-4xl font-extrabold text-[#dee1f7] tracking-tight uppercase">
            Kết Quả Đo Lường Được
          </h2>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="glass-card p-6 md:p-8 rounded-xl border border-slate-800/60 bg-[#161b2b]/30 hover:border-[#00f2ff]/40 hover:bg-[#1a2035]/40 transition-all text-center flex flex-col justify-center items-center h-40">
            <h3 className="font-headline-xl text-4xl font-extrabold text-[#00f2ff] drop-shadow-[0_0_12px_rgba(0,242,255,0.3)] mb-2">+320%</h3>
            <p className="text-xs font-bold tracking-wide text-[#b9cacb] uppercase">Tăng thời gian xem</p>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-xl border border-slate-800/60 bg-[#161b2b]/30 hover:border-[#dcb8ff]/40 hover:bg-[#1a2035]/40 transition-all text-center flex flex-col justify-center items-center h-40">
            <h3 className="font-headline-xl text-4xl font-extrabold text-[#dcb8ff] drop-shadow-[0_0_12px_rgba(220,184,255,0.3)] mb-2">5.4x</h3>
            <p className="text-xs font-bold tracking-wide text-[#b9cacb] uppercase">Ti lệ Inbox</p>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-xl border border-slate-800/60 bg-[#161b2b]/30 hover:border-[#ffe16d]/40 hover:bg-[#1a2035]/40 transition-all text-center flex flex-col justify-center items-center h-40">
            <h3 className="font-headline-xl text-4xl font-extrabold text-[#ffe16d] drop-shadow-[0_0_12px_rgba(255,225,109,0.3)] mb-2">88%</h3>
            <p className="text-xs font-bold tracking-wide text-[#b9cacb] uppercase">Niềm tin thương hiệu</p>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-xl border border-slate-800/60 bg-[#161b2b]/30 hover:border-slate-750 hover:bg-[#1a2035]/40 transition-all text-center flex flex-col justify-center items-center h-40">
            <h3 className="font-headline-xl text-4xl font-extrabold text-white mb-2">12k+</h3>
            <p className="text-xs font-bold tracking-wide text-[#b9cacb] uppercase">Lượt tương tác/ngày</p>
          </div>
        </div>

        {/* Real-time Growth Analytics Chart */}
        <div className="mt-8 glass-card rounded-2xl p-6 md:p-8 border border-slate-800 bg-[#111625]/40 backdrop-blur-md shadow-2xl relative w-full h-[260px] md:h-[350px] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-6 left-8 z-10">
            <span className="text-xs font-mono font-bold tracking-wider text-[#00f2ff] drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]">
              REAL-TIME GROWTH ANALYTICS
            </span>
          </div>

          {/* SVG Glowing Curve Chart */}
          <div className="w-full h-full pt-10 relative flex items-end">
            {/* Grid Lines */}
            <div className="absolute inset-0 pt-10 flex flex-col justify-between pointer-events-none opacity-25">
              <div className="w-full border-t border-dashed border-[#00f2ff]/20"></div>
              <div className="w-full border-t border-dashed border-[#00f2ff]/20"></div>
              <div className="w-full border-t border-dashed border-[#00f2ff]/20"></div>
              <div className="w-full border-t border-[#00f2ff]/10"></div>
            </div>

            {/* Glowing SVG Path */}
            <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
              <defs>
                {/* Gradient Fill under Path */}
                <linearGradient id="chartGlowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#00f2ff" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
                </linearGradient>

                {/* Drop shadow glow filter */}
                <filter id="neonStrokeGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Gradient Area Fill */}
              <path 
                d="M 10 210 C 140 200, 200 170, 260 170 C 340 170, 420 145, 520 130 C 620 115, 680 80, 790 70 L 790 240 L 10 240 Z" 
                fill="url(#chartGlowGradient)" 
              />

              {/* Neon Glow Curve path */}
              <path 
                d="M 10 210 C 140 200, 200 170, 260 170 C 340 170, 420 145, 520 130 C 620 115, 680 80, 790 70" 
                fill="none"
                stroke="#00f2ff" 
                strokeWidth="4.5" 
                strokeLinecap="round"
                filter="url(#neonStrokeGlow)"
              />

              {/* Glowing Dots with Pulsating Ring overlays */}
              {/* Dot 1 */}
              <g className="cursor-pointer group">
                <circle cx="260" cy="170" r="10" fill="#00f2ff" fillOpacity="0.3" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="260" cy="170" r="5" fill="#ffffff" />
                <circle cx="260" cy="170" r="3" fill="#00f2ff" />
              </g>

              {/* Dot 2 */}
              <g className="cursor-pointer group">
                <circle cx="520" cy="130" r="10" fill="#00f2ff" fillOpacity="0.3" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                <circle cx="520" cy="130" r="5" fill="#ffffff" />
                <circle cx="520" cy="130" r="3" fill="#00f2ff" />
              </g>

              {/* Dot 3 Peak */}
              <g className="cursor-pointer group">
                <circle cx="790" cy="70" r="11" fill="#00f2ff" fillOpacity="0.4" className="animate-ping" style={{ animationDuration: '2s' }} />
                <circle cx="790" cy="70" r="6" fill="#ffffff" />
                <circle cx="790" cy="70" r="3.5" fill="#00f2ff" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 5.5: Software Detailed Features (MKT TIKPRO) */}
      <section id="features" className="py-24 max-w-[1280px] mx-auto px-6 border-t border-slate-800/40 relative">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#00f2ff]/3 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-[450px] h-[450px] bg-[#dcb8ff]/3 rounded-full blur-[130px] pointer-events-none" />

        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00f2ff]/10 border border-[#480081]/30 text-[#00f2ff] font-mono text-xs">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span className="font-bold tracking-widest uppercase text-[10px]">TẤT CẢ TRONG MỘT HỆ THỐNG</span>
          </div>
          <h2 className="font-headline-xl text-3xl lg:text-5xl font-extrabold tracking-tight uppercase text-[#dee1f7]">
            Tính năng phần mềm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#ffe16d]">MKT TIKPRO</span>
          </h2>
          <p className="text-[#b9cacb] max-w-2xl mx-auto text-sm md:text-base">
            Tối ưu hóa phễu chuyển đổi tài chính, cày view livestream, đẩy đề xuất nội dung và kiểm soát tự động hàng trăm tài khoản TikTok cùng lúc chỉ với một bảng điều khiển.
          </p>
        </div>

        {/* 3-Column Bento Board with center physical product preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 2 Features */}
          <div className="lg:col-span-4 space-y-6">
            {featuresList.slice(0, 2).map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="glass-card p-6 rounded-2xl border border-slate-800 bg-[#161b2b]/15 hover:border-slate-700/60 transition-all relative group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: feature.color }} />
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800" style={{ color: feature.color }}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="font-headline-xl font-bold text-sm tracking-wide text-white uppercase">{feature.title}</h3>
                  </div>
                  <ul className="space-y-3 pl-1">
                    {feature.items.map((item, idy) => (
                      <li key={idy} className="flex gap-2.5 items-start text-xs text-[#b9cacb] leading-relaxed">
                        <span className="text-[12px] leading-none mt-0.5" style={{ color: feature.color }}>✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Center Column: 3D Product Box Visual Mockup */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-6">
            <div className="absolute w-[280px] h-[280px] rounded-full bg-[#00f2ff]/10 blur-[50px] -z-10 animate-pulse" />
            
            <div className="relative group flex justify-center items-center">
              {/* Spinning/pulsating glowing border */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00f2ff] to-[#7701d0] rounded-2xl blur opacity-30 group-hover:opacity-65 transition duration-1000 group-hover:duration-200 animate-tilt pointer-events-none" />
              
              <img 
                alt="Product Mockup MKT TikPro" 
                src="/src/assets/images/mkt_tikpro_box_1779246268726.png"
                className="w-[260px] md:w-[290px] h-auto object-contain rounded-2xl relative shadow-2xl transform hover:scale-[1.04] transition-all duration-700 select-none referrer-policy"
                referrerPolicy="no-referrer"
              />

              {/* Floating feature badglets */}
              <div className="absolute -top-4 -right-6 bg-slate-900/90 border border-[#00f2ff]/30 text-[#00f2ff] px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase shadow-lg backdrop-blur">
                Auto-Backup Proxy
              </div>

              <div className="absolute -bottom-4 -left-6 bg-slate-900/90 border border-[#ffe16d]/30 text-[#ffe16d] px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase shadow-lg backdrop-blur">
                X40 Speed Seeding
              </div>
            </div>

            <div className="mt-8 text-center space-y-2 max-w-[280px]">
              <h4 className="font-headline-xl font-extrabold text-sm text-slate-100 tracking-wide">MKT TIKPRO SYSTEM</h4>
              <p className="text-[11px] text-[#b9cacb] leading-relaxed">
                Được lập trình mượt mà, tối ưu tài nguyên máy tính cá nhân, tích hợp sẵn các giải pháp nuôi tài khoản cấp độ chuyên sâu.
              </p>
            </div>
          </div>

          {/* Right Column: 3 Remaining Features */}
          <div className="lg:col-span-4 space-y-6">
            {featuresList.slice(2).map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="glass-card p-6 rounded-2xl border border-slate-800 bg-[#161b2b]/15 hover:border-slate-700/60 transition-all relative group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: feature.color }} />
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800" style={{ color: feature.color }}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="font-headline-xl font-bold text-sm tracking-wide text-white uppercase">{feature.title}</h3>
                  </div>
                  <ul className="space-y-3 pl-1">
                    {feature.items.map((item, idy) => (
                      <li key={idy} className="flex gap-2.5 items-start text-xs text-[#b9cacb] leading-relaxed">
                        <span className="text-[12px] leading-none mt-0.5" style={{ color: feature.color }}>✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Section 5.6: Premium Price Packages (Báo Giá) */}
      <section id="pricing" className="py-24 max-w-[1280px] mx-auto px-6 border-t border-slate-800/40 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7701d0]/2 to-transparent pointer-events-none" />
        
        <div className="text-center mb-16">
          <h2 className="font-headline-xl text-3xl lg:text-5xl font-extrabold tracking-tight uppercase text-[#dee1f7]">
            Chi Phí Phần Mềm
          </h2>
        </div>

        {/* Responsive Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`glass-card rounded-3xl p-8 border border-slate-800 bg-[#111524]/50 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${plan.glowColor}`}
            >
              {/* Header Info */}
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="font-headline-xl font-extrabold text-lg text-slate-100 uppercase tracking-wider">{plan.name}</span>
                  <span className={`text-[10px] font-mono tracking-widest font-black uppercase px-2.5 py-1 rounded-full border ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>

                <div className="mb-6 flex items-baseline gap-2 flex-nowrap overflow-hidden">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline-xl text-white tracking-tight shrink-0 whitespace-nowrap">
                    {plan.price}
                  </span>
                  <div className="space-y-0.5 min-w-0 shrink">
                    <span className="text-xs text-slate-400 line-through block leading-none whitespace-nowrap">
                      {plan.originalPrice}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#b9cacb] block leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                      / {plan.period}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-medium text-[#b9cacb] leading-relaxed mb-8 min-h-[48px]">
                  {plan.description}
                </p>

                {/* Divider */}
                <div className="h-px bg-slate-800/60 w-full mb-8" />

                {/* Features list */}
                <div className="space-y-4 mb-10">
                  <p className="text-[11px] font-mono font-bold tracking-widest text-[#00f2ff] uppercase">QUYỀN LỢI ĐẶC QUYỀN:</p>
                  <ul className="space-y-3.5">
                    {plan.features.map((feat, idy) => (
                      <li key={idy} className="flex items-start gap-3 text-xs text-slate-300">
                        <CheckCircle className="h-4.5 w-4.5 text-[#00f2ff] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => {
                  setIsConsulting(true);
                  setStrategyResult(null);
                  setTopic(`Mình quan tâm đến ${plan.name} giá ${plan.price}`);
                }}
                className={`w-full py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all uppercase flex justify-center items-center gap-2 cursor-pointer ${plan.buttonBg}`}
              >
                <span>Nhận Tư Vấn Gói Này</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Micro Pricing Alert Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#b9cacb]/80">
            Bạn cần hỗ trợ tùy chỉnh gói đại lý hoặc nhiều tài khoản lớn? 
            Hãy liên hệ trực tiếp <a href="https://t.me/minhkhaimkt" target="_blank" rel="noopener noreferrer" className="text-[#00f2ff] font-bold hover:underline">Chuyên viên tư vấn</a> của hệ thống MKT TikPro.
          </p>
        </div>
      </section>
      <section id="faq" className="py-20 bg-slate-950/20 border-t border-slate-800/40">
        <div className="max-w-[800px] mx-auto px-6 space-y-12">
          <h2 className="font-headline-xl text-3xl font-extrabold text-center text-[#dee1f7]">Hỏi Đáp & Tràn Trề Thắc Mắc</h2>
          
          <div className="space-y-4">
            {[
              {
                q: "Seeding số lượng nhiều có sợ bị quét hạn chế live không?",
                a: "Hoàn toàn không. Hệ thống SeedAI vận hành bằng phương thức kết nối proxy Việt Nam (VNG, Viettel) sạch, các tài khoản liên tục ngắt quãng hoạt động giãn cách thông minh, mô phỏng đúng 100% người dùng thực sắm vai gồng lỗ, gồng lãi."
              },
              {
                q: "Ngách tài chính nhạy cảm thì kịch bản Seeding AI làm cách nào tối ưu?",
                a: "Hệ thống AI của chúng tôi sở hữu tính năng vượt rào kiểm duyệt tự động lọc bỏ các từ khóa bị cấm (như 'rút tiền', 'nạp sàn', 'đòn bẩy cực cao...') mà chuyển sang dạng từ lóng chuyên dụng nhưng người thật đọc vẫn dễ dàng định hình và tự tin hành động."
              },
              {
                q: "Chi phí vận hành SeedAI Pro có đắt đỏ không?",
                a: "Bạn có thể khởi động ngay với các gói miễn phí khởi tạo kịch bản AI ngay tại Command Center hoặc lựa chọn nâng cấp gói proxy chuyên dụng chỉ bằng một phần rất nhỏ so với chi phí tự build máy chủ cày cơm truyền thống."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="glass-card rounded-xl p-5 border border-slate-800 bg-[#1a1f2f]/5 cursor-pointer"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="flex justify-between items-center gap-4 text-sm font-bold text-[#dee1f7]">
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="h-4 w-4 text-[#00f2ff]" /> : <ChevronDown className="h-4 w-4 text-[#b9cacb]" />}
                </div>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3 text-xs leading-relaxed text-[#b9cacb]"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA & Footer Contact */}
      <section className="py-20 max-w-[1280px] mx-auto px-6 text-center">
        <div className="glass-card rounded-3xl p-12 lg:p-16 border border-[#00f2ff]/20 bg-gradient-to-br from-[#0e1322] via-[#1a1f2f]/30 to-[#0e1322] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#00f2ff]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <h2 className="font-headline-xl text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[# efdbff] mb-4">
            Đừng Để Kênh TikTok Tài Chính Của Bạn Cô Đơn Lạnh Lẽo!
          </h2>
          <p className="text-[#b9cacb] max-w-xl mx-auto text-sm leading-relaxed mb-8">
            Mỗi giây trôi qua phòng livestream của bạn vắng khách là hàng tá khách hàng VIP rời đi đóng tài khoản sàn khác. Hãy bắt đầu kích hoạt Seeding thông minh ngay hôm nay.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => {
                setIsConsulting(true);
                setStrategyResult(null);
                setTopic("");
              }}
              className="px-8 py-4 font-bold rounded-xl bg-gradient-to-r from-[#00f2ff] to-[#7701d0] text-[#00363a] glow-primary hover:scale-105 transition-transform"
            >
              HỎI Ý KIẾN CHUYÊN GIA AI NGAY MIỄN PHÍ
            </button>
            <button 
              onClick={onEnterDashboard}
              className="px-8 py-4 font-bold rounded-xl bg-slate-900 border border-slate-700 text-[#dee1f7] hover:bg-slate-800 hover:border-[#00f2ff] transition-all"
            >
              Xem Command Center
            </button>
          </div>
        </div>

        {/* Contact Links */}
        <div className="mt-16 flex flex-col md:flex-row gap-6 justify-center items-center">
          <a 
            href="https://t.me/minhkhaimkt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#24A1DE]/10 hover:bg-[#24A1DE]/25 px-8 py-4 rounded-xl border border-[#24A1DE]/30 transition-all w-fit"
          >
            <img 
              alt="Telegram" 
              className="w-8 h-8 rounded-lg" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS4C3YMEprjJp6p0gn1ovYw1uYwe59FzksPE8g8--AzJaSV1vkIoatjPlqwCJfvHZiMp03B-jaw3eO4tZFVQaZyyuew8bibUgGXPNZEh_y9ncabHEDs4h5bw9IMhVroWe9KGJMBnk-aL9Fo_rraj5hwxjB6KQH7KINsqfLtj0VCoXJj5TEsUOUGF_4sBevJLaPjH0kAI1Mv_-3buMDt0xg_XHMc_RC1u879TYWNVH7_zVQpaG6DrcLXLuzC_wZ-CiMuUNjWattVA" 
            />
            <div className="text-left font-sans">
              <p className="text-[10px] uppercase font-extrabold text-[#24A1DE]">Telegram Channel</p>
              <p className="text-[#dee1f7] font-bold text-sm">@minhkhaimkt</p>
            </div>
          </a>

          <a 
            href="https://zalo.me/84399036609" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#0068FF]/10 hover:bg-[#0068FF]/25 px-8 py-4 rounded-xl border border-[#0068FF]/30 transition-all w-fit"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0068FF] font-black text-xs text-white flex items-center justify-center">ZALO</div>
            <div className="text-left font-sans flex-1">
              <p className="text-[10px] uppercase font-extrabold text-[#0068FF]">Zalo Support 24/7</p>
              <p className="text-[#dee1f7] font-bold text-sm">0399.036.609</p>
            </div>
          </a>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="py-8 border-t border-slate-800 bg-slate-950/40 text-center text-[#b9cacb] text-xs">
        <p>© 2026 TikTokSeed.AI. Kiến tạo độ tin cậy đỉnh cao cho Crypto & Forex.</p>
      </footer>

      {/* AI Strategy Consultant Modal (Gemini Backend Integration) */}
      <AnimatePresence>
        {isConsulting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl border border-[#00f2ff]/30 p-6 max-h-[90vh] overflow-y-auto max-w-lg w-full bg-[#1a1f2f]/95 shadow-2xl relative scroll-hide"
            >
              <button 
                onClick={() => setIsConsulting(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#b9cacb] hover:text-[#ffb4ab]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <Brain className="h-6 w-6 text-[#00f2ff] animate-pulse" />
                <h3 className="text-xl font-bold text-[#dee1f7] uppercase tracking-wide">
                  Tấn công phễu khách hàng bằng AI Seeding
                </h3>
              </div>

              {!strategyResult ? (
                <form onSubmit={handleGenerateStrategy} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#b9cacb] uppercase mb-1">Chọn Ngách (Product Niche)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["Crypto", "Forex", "Gold", "Custom"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNiche(type)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                            niche === type 
                              ? "bg-[#00f2ff]/20 text-[#00f2ff] border-[#00f2ff]" 
                              : "bg-slate-900/60 border-slate-850 text-[#b9cacb] hover:border-slate-700"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#b9cacb] uppercase mb-1">Chủ đề video / Livestream</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Lướt sóng BTC, Trade Vàng thế giới, Review Altcoin"
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-4 py-3 text-sm text-[#dee1f7] focus:outline-none focus:border-[#00f2ff]"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#b9cacb] uppercase mb-1">Đối tượng mục tiêu</label>
                    <input 
                      type="text" 
                      placeholder="Mới chơi, chuyên nghiệp gỡ gạ, chị em văn phòng..."
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-4 py-3 text-sm text-[#dee1f7] focus:outline-none focus:border-[#00f2ff]"
                      value={targetViewer}
                      onChange={(e) => setTargetViewer(e.target.value)}
                    />
                  </div>

                  {consultationError && (
                    <div className="p-3 bg-red-950/40 border border-[#ffb4ab]/30 rounded-lg text-[#ffb4ab] text-xs">
                      {consultationError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoadingStrategy}
                    className="w-full py-4 text-center font-bold text-sm text-[#00363a] bg-[#00f2ff] rounded-xl cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    {isLoadingStrategy ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Đang phân tích và sáng tạo...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 fill-current" />
                        Xây dựng kịch bản seeding AI ngay
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-950/20 border border-emerald-800/20 rounded-xl">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Mục tiêu cảm xúc đề xuất</h4>
                    <p className="text-sm text-[#dee1f7]">{strategyResult.sentimentGoal}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#00f2ff] uppercase mb-2">Mẫu bình luận AI tự nhiên</h4>
                    <div className="space-y-2">
                      {strategyResult.recommendedScript.map((script, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/60 rounded-lg text-sm text-[#dee1f7] border border-slate-850 flex gap-2 items-start">
                          <CornerDownRight className="h-4 w-4 text-[#00f2ff] flex-shrink-0 mt-0.5" />
                          <span>"{script}"</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#dcb8ff] uppercase mb-2">Cột trụ nội dung (Content Pillars)</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {strategyResult.contentPillars.map((pillar, idx) => (
                        <div key={idx} className="bg-slate-900/40 rounded-lg p-3 border border-slate-800">
                          <p className="text-xs font-bold text-[#efdbff] mb-1">{pillar.title}</p>
                          <p className="text-xs text-[#b9cacb] leading-relaxed">{pillar.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-950/20 border border-amber-800/20 rounded-xl flex gap-3 items-start">
                    <ShieldCheck className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-0.5">Mẹo An Toàn & Bảo Mật</h4>
                      <p className="text-xs text-[#b9cacb] leading-relaxed">{strategyResult.safetyTip}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStrategyResult(null)}
                      className="flex-1 py-3 text-center border border-slate-750 rounded-xl text-xs font-bold hover:bg-slate-900 text-[#b9cacb]"
                    >
                      Thiết kế lại chủ đề mới
                    </button>
                    <button
                      onClick={() => {
                        setIsConsulting(false);
                        onEnterDashboard();
                      }}
                      className="flex-1 py-3 text-center rounded-xl bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] text-xs font-bold cursor-pointer"
                    >
                      Áp dụng trong Dashboard
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
