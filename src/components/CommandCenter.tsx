import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  UserCog, 
  Tv, 
  Brain, 
  LineChart, 
  Activity, 
  Settings, 
  Search, 
  Bell, 
  Server, 
  MessageSquare, 
  Zap, 
  Plus, 
  ArrowLeft, 
  Play, 
  Pause, 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  Send,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Clock,
  ExternalLink,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Campaign, BotComment, ProxyNode } from "../types";
import { INITIAL_CAMPAIGNS, INITIAL_PREVIEW_COMMENTS, PROXY_NODES } from "../data";

interface CommandCenterProps {
  onBackToLanding: () => void;
}

export default function CommandCenter({ onBackToLanding }: CommandCenterProps) {
  // Sidebar Active Option
  const [activeTab, setActiveTab] = useState<"dashboard" | "proxies" | "scripts" | "strategy" | "analytics" | "logs">("dashboard");

  // State storage
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [selectedCampId, setSelectedCampId] = useState<string>("camp_1");
  const [commentsFeed, setCommentsFeed] = useState<BotComment[]>(INITIAL_PREVIEW_COMMENTS);
  const [proxyNodes, setProxyNodes] = useState<ProxyNode[]>(PROXY_NODES);
  
  // Real-time server diagnostics
  const [uptime, setUptime] = useState("02:14:52");
  const [cpuUsage, setCpuUsage] = useState(14);
  const [latency, setLatency] = useState(24);

  // New campaign modal state
  const [isNewCampOpen, setIsNewCampOpen] = useState(false);
  const [newCampName, setNewCampName] = useState("");
  const [newHost, setNewHost] = useState("@");
  const [newAccounts, setNewAccounts] = useState(100);
  const [newFreq, setNewFreq] = useState("10/phút");
  const [newSentiment, setNewSentiment] = useState("Tích cực");

  // AI manual script writer state
  const [manualText, setManualText] = useState("");
  const [generatingSeeds, setGeneratingSeeds] = useState(false);
  const [seedStyle, setSeedStyle] = useState<string>("tích cực");

  // Content Pillars Strategy Planner Inside Tab State
  const [aiIdeaTopic, setAiIdeaTopic] = useState("");
  const [aiIdeaNiche, setAiIdeaNiche] = useState<"Crypto" | "Forex" | "Gold">("Crypto");
  const [planningResult, setPlanningResult] = useState<any>(null);
  const [planningLoading, setPlanningLoading] = useState(false);

  // Filter parameters
  const [searchQuery, setSearchQuery] = useState("");

  // Live Server ticks
  useEffect(() => {
    const timer = setInterval(() => {
      // simulate latency shifts
      setLatency(prev => {
        const delta = Math.floor(Math.random() * 6) - 3;
        const next = prev + delta;
        return next < 10 ? 12 : next > 50 ? 24 : next;
      });

      // simulate CPU usage fluctuations
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 8) - 4;
        const next = prev + delta;
        return next < 5 ? 6 : next > 45 ? 18 : next;
      });

      // increment uptime ticks
      setUptime(prev => {
        const [h, m, s] = prev.split(":").map(Number);
        let nextS = s + 1;
        let nextM = m;
        let nextH = h;
        if (nextS >= 60) {
          nextS = 0;
          nextM += 1;
        }
        if (nextM >= 60) {
          nextM = 0;
          nextH += 1;
        }
        return [
          String(nextH).padStart(2, "0"),
          String(nextM).padStart(2, "0"),
          String(nextS).padStart(2, "0")
        ].join(":");
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCampaignObj = campaigns.find(c => c.id === selectedCampId) || campaigns[0];

  // Disconnect/Reconnect Proxy Node Toggle Interaction
  const handleToggleProxy = (nodeId: string) => {
    setProxyNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const isOnline = node.status === "online";
        return {
          ...node,
          status: isOnline ? "offline" : "online",
          latency: isOnline ? 0 : Math.floor(Math.random() * 25) + 10
        };
      }
      return node;
    }));
  };

  // Add campaign handler
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim() || !newHost.trim()) return;

    const newCamp: Campaign = {
      id: `camp_${Date.now()}`,
      name: newCampName,
      host: newHost.startsWith("@") ? newHost : `@${newHost}`,
      accountCount: newAccounts,
      frequency: newFreq,
      status: "Live",
      sentimentStyle: newSentiment
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setSelectedCampId(newCamp.id);
    setIsNewCampOpen(false);

    // Reset fields
    setNewCampName("");
    setNewHost("@");
    setNewAccounts(100);
    setNewFreq("10/phút");
  };

  // Manual seed sender
  const handleSendManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    const customComment: BotComment = {
      id: `manual_seed_${Date.now()}`,
      botName: `AdminBot_${Math.floor(Math.random() * 80) + 10}`,
      text: manualText,
      timeLabel: "Just now",
      sentiment: "positive",
      campaignName: activeCampaignObj.name
    };

    setCommentsFeed(prev => [customComment, ...prev]);
    setManualText("");
  };

  // Generate seeds utilizing Gemini API on Node backend
  const handleTriggerAiSeeding = async () => {
    setGeneratingSeeds(true);
    try {
      const response = await fetch("/api/generate-seeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: activeCampaignObj.name,
          host: activeCampaignObj.host,
          style: seedStyle,
          quantity: 4
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      
      setCommentsFeed(prev => [...data.comments, ...prev]);
    } catch (e) {
      console.error("AI comment creation failed, using realistic fallback client-side");
      const backupComment: BotComment = {
        id: `back_c_${Date.now()}`,
        botName: `Bot_${Math.floor(Math.random()*899)+100}`,
        text: seedStyle === "hoài nghi" ? "Kèo này sếp kêu sớm thế, liệu SL xa thế có cháy tài khoản không?" : "Uy tín quá sếp ơi, theo cơm gạo lúa về ngập mồm rồi sếp!",
        timeLabel: "Just now",
        sentiment: seedStyle === "hoài nghi" ? "skeptical" : "positive",
        campaignName: activeCampaignObj.name
      };
      setCommentsFeed(prev => [backupComment, ...prev]);
    } finally {
      setGeneratingSeeds(false);
    }
  };

  // Plan content pillar strategy within tabs (Gemini Node client)
  const handlePlanIdeaStrategy = async () => {
    if (!aiIdeaTopic.trim()) return;
    setPlanningLoading(true);
    setPlanningResult(null);
    try {
      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiIdeaTopic,
          niche: aiIdeaNiche,
          targetViewer: "Cộng đồng trader mong muốn nâng cao kỹ năng giao dịch"
        })
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setPlanningResult(data);
    } catch {
      setPlanningResult({
        recommendedScript: ["Anh phân tích mượt quá, theo kèo từ tối đến giờ", "Xin điểm entry cặp này sếp ơi"],
        contentPillars: [
          { title: "Dẫn dắt Phân Tích", description: "Hỏi đáp sâu về xu hướng trung và dài hạn." },
          { title: "Giải mã Thuật Ngữ", description: "Kích hoạt sự hiếu kỳ của người mới." }
        ],
        sentimentGoal: "Cân bằng tích cực (Trung tính & Tích cực hướng đến gặt hái kết quả).",
        safetyTip: "Nên dùng 3-5 Proxy độc lập chia ranh giới địa bàn."
      });
    } finally {
      setPlanningLoading(false);
    }
  };

  return (
    <div id="command-center" className="min-h-screen bg-[#0b0e1b] text-slate-100 flex font-body-md flex-col md:flex-row select-none">
      {/* Dynamic Aurora particle */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#00f2ff]/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Modern Horizontal Navigation / Dashboard Header for mobile view */}
      <div className="visible md:hidden flex justify-between items-center bg-[#13192e] px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#00f2ff]" />
          <span className="font-bold text-sm tracking-widest text-[#00f2ff]">SEEDAI PRO</span>
        </div>
        <button 
          onClick={onBackToLanding}
          className="p-1 px-3 border border-slate-700 rounded text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3 w-3" />
          Landing App
        </button>
      </div>

      {/* Sidebar Panel Left */}
      <aside className="w-full md:w-64 bg-[#0e1322] border-r border-slate-800/80 flex flex-col flex-shrink-0">
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-800/50">
          <span className="p-1.5 bg-[#00f2ff]/10 rounded-lg text-[#00f2ff]">
            <Zap className="h-5 w-5 fill-current" />
          </span>
          <span className="font-headline-xl text-lg font-black tracking-widest text-[#00f2ff] uppercase">
            SEEDAI PRO
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scroll-hide">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">QUẢN LÝ COMMAND</p>
          
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 font-bold"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/30"
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
            Vận hành Seeding
          </button>

          <button
            onClick={() => setActiveTab("proxies")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "proxies"
                ? "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 font-bold"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/30"
            }`}
          >
            <Server className="h-4.5 w-4.5" />
            Proxy Matrix
          </button>

          <button
            onClick={() => setActiveTab("scripts")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "scripts"
                ? "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 font-bold"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/30"
            }`}
          >
            <MessageSquare className="h-4.5 w-4.5" />
            Kịch bản & Emulator
          </button>

          <button
            onClick={() => setActiveTab("strategy")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "strategy"
                ? "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 font-bold"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/30"
            }`}
          >
            <Brain className="h-4.5 w-4.5" />
            Chiến lược nội dung AI
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "analytics"
                ? "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 font-bold"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/30"
            }`}
          >
            <LineChart className="h-4.5 w-4.5" />
            Phân tích số liệu
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "logs"
                ? "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 font-bold"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/30"
            }`}
          >
            <Activity className="h-4.5 w-4.5" />
            Node Health Logs
          </button>
        </nav>

        {/* Back to Landing bottom controller */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
          <button 
            onClick={onBackToLanding}
            className="w-full py-2.5 border border-slate-700/60 rounded-xl hover:border-[#00f2ff] hover:text-[#00f2ff] text-slate-400 transition-all font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại Landing Page
          </button>
        </div>
      </aside>

      {/* Main Content Workspace Content Pane */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Panel */}
        <header className="px-6 h-20 bg-[#0e1322] border-b border-slate-850 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#00f2ff]" />
              {activeTab === "dashboard" && "Bàn Làm Việc Seeding Live"}
              {activeTab === "proxies" && "Ma Trận Proxy & DNS Nodes"}
              {activeTab === "scripts" && "Ủy thác chatbot & Phản hồi"}
              {activeTab === "strategy" && "Tư vấn cấu trúc phễu nội dung"}
              {activeTab === "analytics" && "Phân tích tăng trưởng & Sentiment"}
              {activeTab === "logs" && "Core Node Real-time Telemetry"}
            </h1>
          </div>

          {/* Diagnostic Stats Bar */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-slate-500" />
              <span className="text-xs text-slate-400 font-mono">CPU: <b className="text-[#00f2ff]">{cpuUsage}%</b></span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-slate-500" />
              <span className="text-xs text-slate-400 font-mono">MS Latency: <b className="text-emerald-400">{latency}ms</b></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-slate-500" />
              <span className="text-xs text-slate-400 font-mono">Uptime: <b className="text-indigo-400">{uptime}</b></span>
            </div>
            <div className="h-4 w-0.5 bg-slate-700" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-300">Quản trị viên</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Enterprise Premium</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-800 border border-[#00f2ff]/30 flex items-center justify-center font-bold text-xs text-[#00f2ff]">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Tab workspace renders dynamically based on selection */}
        <div className="p-6 flex-1">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Dynamic Campaigns Section */}
              <div className="xl:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm chiến dịch..."
                      className="w-full bg-[#13192e] border border-slate-800/80 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00f2ff]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => setIsNewCampOpen(true)}
                    className="px-5 py-3 rounded-xl bg-[#00f2ff] text-[#00363a] font-bold text-sm hover:scale-[1.02] cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    Bắt đầu chiến dịch mới
                  </button>
                </div>

                {/* Campaigns List Card */}
                <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden bg-[#161b2b]/30">
                  <div className="px-6 py-4 border-b border-slate-850 flex justify-between items-center bg-[#13192e]/40">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Danh sách chiến dịch seeding đang chạy</h3>
                    <span className="px-2 py-1 rounded bg-[#00f2ff]/10 text-[#00f2ff] font-mono text-[10px] uppercase font-bold">
                      {campaigns.length} Tổng số
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-[#101424]/40">
                          <th className="px-6 py-4">Tên chiến dịch</th>
                          <th className="px-6 py-4">Chủ Kênh TikTok</th>
                          <th className="px-6 py-4 text-center">Tài khoản (Bot)</th>
                          <th className="px-6 py-4 text-center">Tần số log</th>
                          <th className="px-6 py-4">Trạng thái</th>
                          <th className="px-6 py-4 text-right">Lựa chọn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-sm">
                        {filteredCampaigns.map((camp) => (
                          <tr 
                            key={camp.id}
                            onClick={() => setSelectedCampId(camp.id)}
                            className={`transition-colors cursor-pointer ${
                              selectedCampId === camp.id 
                                ? "bg-[#00f2ff]/5 text-[#dee1f7]" 
                                : "hover:bg-slate-900/20 text-slate-300"
                            }`}
                          >
                            <td className="px-6 py-4 font-bold">{camp.name}</td>
                            <td className="px-6 py-4">
                              <span className="text-indigo-400 font-semibold font-mono">{camp.host}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-mono text-xs bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-indigo-300 font-bold">
                                {camp.accountCount} Bot
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center text-xs font-mono font-medium text-slate-400">
                              {camp.frequency}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950/40 text-emerald-400 border border-emerald-900/40">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                                {camp.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, status: c.status === 'Live' ? 'Paused' : 'Live' } : c));
                                }}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  camp.status === 'Live' 
                                    ? "bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 border-[#ffb4ab]/30 text-[#ffb4ab]" 
                                    : "bg-emerald-950/40 hover:bg-emerald-950 border-emerald-900/40 text-emerald-400"
                                }`}
                              >
                                {camp.status === 'Live' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Dashboard analytics highlights card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-6 bg-[#161b2b]/30">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#00f2ff] mb-4">Sentiment Distribution</h4>
                    <div className="flex items-center gap-6 justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-[#00f2ff]" />
                          <span className="text-xs font-bold text-slate-300">Tích cực (VN): <b>72%</b></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-indigo-500" />
                          <span className="text-xs font-bold text-slate-300">Trung lập (VN): <b>20%</b></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-amber-500" />
                          <span className="text-xs font-bold text-slate-300">Hoài nghi (GIẢ): <b>8%</b></span>
                        </div>
                      </div>

                      {/* Pure HTML visual circular graph for representation */}
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          {/* Positive */}
                          <circle cx="48" cy="48" r="38" stroke="rgba(0, 242, 255, 0.1)" strokeWidth="8" fill="transparent" />
                          <circle cx="48" cy="48" r="38" stroke="#00f2ff" strokeWidth="8" strokeDasharray="238" strokeDashoffset="60" fill="transparent" />
                          
                          {/* Neutral */}
                          <circle cx="48" cy="48" r="28" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="6" fill="transparent" />
                          <circle cx="48" cy="48" r="28" stroke="#6366f1" strokeWidth="6" strokeDasharray="175" strokeDashoffset="45" fill="transparent" />
                        </svg>
                        <span className="absolute text-[10px] font-bold font-mono text-slate-400">72% +</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6 bg-[#1a1f30]/20 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Lời Khuyên Chiến Lược AI</h4>
                      <p className="text-xs text-[#b9cacb] leading-relaxed">
                        Chủ đề <b>{activeCampaignObj.name}</b> đang mang lại sự thảo luận tích cực tốt. Hãy đẩy mạnh seeding kiểu <b>"Tò mò chuyên sâu"</b> để kích thích người theo dõi tham gia Zalo link Bio.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex gap-2 justify-end">
                      <span className="text-[10px] font-bold tracking-wider text-[#00f2ff] px-2 py-1 rounded bg-[#00f2ff]/10">SUGGESTION LIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seeding Emulator Panel (right visual pane) */}
              <div className="space-y-6">
                <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[520px] bg-[#161b2b]/30 relative">
                  <div className="p-4 bg-[#13192e]/80 border-b border-slate-850 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#00f2ff]">AI SEEDING EMULATOR</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Chiến dịch: {activeCampaignObj.name}</p>
                    </div>

                    <div className="flex gap-2">
                      <select 
                        value={seedStyle} 
                        onChange={(e) => setSeedStyle(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded p-1 text-[10px] font-bold text-slate-300 focus:outline-none"
                      >
                        <option value="tích cực">Mẫu tích cực</option>
                        <option value="hoài nghi">Cụm hoài nghi</option>
                        <option value="trung lập">Mẫu hỏi đáp</option>
                      </select>
                      
                      <button 
                        onClick={handleTriggerAiSeeding}
                        disabled={generatingSeeds}
                        className="p-1 px-2.5 bg-[#00f2ff]/20 text-[#00f2ff] hover:bg-[#00f2ff] hover:text-[#00363a] font-bold rounded text-[10px] flex items-center gap-1 transition-all"
                      >
                        {generatingSeeds ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            AI Generating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3" />
                            Chạy comment AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Scrolled chat queue */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col scroll-hide">
                    {commentsFeed
                      .filter(com => com.campaignName === activeCampaignObj.name)
                      .map((com, index) => (
                        <div key={com.id || index} className="p-3.5 rounded-xl border border-slate-800 bg-[#0e1322]/80 flex flex-col gap-1 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#00f2ff]">{com.botName}</span>
                            <span className="text-[9px] font-semibold text-indigo-400 font-mono italic">{com.timeLabel}</span>
                          </div>
                          <p className="text-sm text-slate-250 font-medium">"{com.text}"</p>
                          <div className="flex gap-1.5 mt-1 justify-end">
                            <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                              com.sentiment === 'positive' 
                                ? 'bg-emerald-950/40 text-emerald-400' 
                                : com.sentiment === 'skeptical' 
                                  ? 'bg-amber-950/40 text-amber-500' 
                                  : 'bg-indigo-950/40 text-indigo-400'
                            }`}>
                              {com.sentiment}
                            </span>
                          </div>
                        </div>
                      ))}
                    {commentsFeed.filter(com => com.campaignName === activeCampaignObj.name).length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 h-full p-6">
                        <MessageSquare className="h-8 w-8 mb-2 opacity-40 text-slate-600" />
                        <p className="text-xs font-bold">Chưa có bình luận tương tác nào.</p>
                        <p className="text-[10px] mt-1 text-slate-500 max-w-xs">Nhấp vào "Chạy comment AI" để tạo luồng kịch bản seeding bằng Gemini.</p>
                      </div>
                    )}
                  </div>

                  {/* Manual input trigger */}
                  <form onSubmit={handleSendManual} className="p-3 bg-[#111629] border-t border-slate-850 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Gõ bình luận thủ công..."
                      className="flex-1 bg-slate-900 text-xs text-slate-200 border border-slate-800 rounded-lg px-3 focus:outline-none focus:border-[#00f2ff]"
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="p-2.5 bg-[#00f2ff] text-[#00363a] rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === "proxies" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Cụm Máy Chủ Proxy Việt Nam & Quốc Tế</h3>
                  <p className="text-xs text-slate-400 mt-1">Quản lý và chuyển đổi luồng định tuyến (Proxy Matrix) bảo vệ an toàn cho tài khoản seeding của bạn.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proxyNodes.map((node) => (
                  <div key={node.id} className="glass-card rounded-2xl p-5 border border-slate-800 bg-[#161b2b]/30">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase bg-[#6366f1]/10 px-2 py-0.5 rounded">
                          {node.location}
                        </span>
                        <h4 className="text-sm font-bold text-slate-200 mt-2">{node.name}</h4>
                        <p className="text-xs font-mono text-slate-400 mt-1">{node.ip}</p>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        node.status === 'online' 
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                          : 'bg-red-950/40 text-red-400 border border-red-900/40'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${node.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                        {node.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-3 border-t border-slate-850">
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-xs text-slate-400 font-mono">
                          Latency: <b className={node.status === 'online' ? 'text-emerald-400' : 'text-slate-500'}>
                            {node.status === 'online' ? `${node.latency}ms` : 'N/A'}
                          </b>
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleProxy(node.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          node.status === 'online' 
                            ? 'bg-slate-900 text-slate-400 border-slate-850 hover:border-red-500/50 hover:text-red-400' 
                            : 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40 hover:bg-emerald-950'
                        }`}
                      >
                        {node.status === 'online' ? 'Ngắt Kết Nối' : 'Kích hoạt lại'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "scripts" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Campaign Picker Left Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-[#161b2b]/30">
                  <h3 className="text-sm font-bold text-slate-200 mb-4">Chọn chiến dịch xem dải kịch bản</h3>
                  <div className="space-y-2">
                    {campaigns.map((camp) => (
                      <div 
                        key={camp.id}
                        onClick={() => setSelectedCampId(camp.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedCampId === camp.id 
                            ? "bg-[#00f2ff]/10 border-[#00f2ff]/30 text-white" 
                            : "bg-[#0e1322]/80 border-slate-850 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-bold">{camp.name}</p>
                          <span className="text-[10px] font-mono text-[#00f2ff]">{camp.host}</span>
                        </div>
                        <p className="text-[10px] text-[#b9cacb]">Định vị: {camp.sentimentStyle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic script generation right column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-[#161b2b]/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="h-6 w-6 text-[#00f2ff]" />
                    <h3 className="text-base font-bold text-slate-100 uppercase">Soạn thảo kịch bản Seeding AI tự động</h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Mô phỏng tệp khách hàng hoài nghi hoặc tò mò thông qua việc nhấp nút trigger ở dưới. Bạn sẽ nhận được các kịch bản tương tác hoàn chỉnh để tối ưu hóa buổi livestream này.
                  </p>

                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 mb-6 space-y-2">
                    <h4 className="text-xs font-bold text-[#dcb8ff] uppercase mb-2">Ví dụ kịch bản tiêu chí</h4>
                    <div className="p-3 rounded-lg bg-[#0e1322] text-xs leading-relaxed text-[#b9cacb]">
                      <b>Bot:</b> "Vàng thế giới nay rụt nến ảo thật sếp, lệnh này SL đặt đâu thì vững tâm?"<br/>
                      <span className="text-slate-500 font-mono">→ [Giãn cách 12s]</span><br/>
                      <b>Bot_2:</b> "Vừa dính SL nhẹ sếp ơi, nhưng đúng là giữ vốn quan trọng bậc nhất, chờ tiếp."
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={handleTriggerAiSeeding}
                      className="px-6 py-3 rounded-xl bg-[#00f2ff] text-[#00363a] font-bold text-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Kiến tạo kịch bản từ Gemini
                    </button>
                    <button 
                      onClick={() => setCommentsFeed(INITIAL_PREVIEW_COMMENTS)}
                      className="px-6 py-3 border border-slate-700 hover:border-slate-500 rounded-xl text-xs text-slate-300 font-semibold"
                    >
                      Reset Emulator default feed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "strategy" && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-[#161b2b]/30">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-6 w-6 text-[#00f2ff] animate-pulse" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">Bàn tư vấn nội dung & Phễu Chuyển Đổi (KOL Growth)</h3>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Thiết kế cấu trúc chiến dịch Seeding hoàn chỉnh bằng cách cung cấp chủ đề cho mô hình AI của chúng tôi. Chúng tôi sẽ phân loại thành 4 trụ cột nội dung thiết yếu và cung cấp các kịch bản bình luận tương tác.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                  <div className="md:col-span-3">
                    <select
                      value={aiIdeaNiche}
                      onChange={(e: any) => setAiIdeaNiche(e.target.value)}
                      className="w-full bg-slate-900 text-xs font-bold border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-[#00f2ff]"
                    >
                      <option value="Crypto">Crypto</option>
                      <option value="Forex">Forex</option>
                      <option value="Gold">Gold</option>
                    </select>
                  </div>

                  <div className="md:col-span-6">
                    <input 
                      type="text" 
                      placeholder="Nhập kỹ năng/chủ đề cụ thể (Ví dụ: Thực chiến nến búa Pinbar, Lướt sóng tin tức CPI)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00f2ff]"
                      value={aiIdeaTopic}
                      onChange={(e) => setAiIdeaTopic(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <button
                      onClick={handlePlanIdeaStrategy}
                      disabled={planningLoading || !aiIdeaTopic.trim()}
                      className="w-full py-3 bg-[#00f2ff] text-[#00363a] font-bold text-xs rounded-lg cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
                    >
                      {planningLoading ? "Đang lên lược đồ..." : "Phân tích cấu trúc AI →"}
                    </button>
                  </div>
                </div>

                {planningResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-850"
                  >
                    <div>
                      <h4 className="text-xs font-bold uppercase text-[#00f2ff] tracking-wider mb-2">Đề xuất kịch bản AI chi tiết</h4>
                      <div className="space-y-2">
                        {planningResult.recommendedScript?.map((script: string, index: number) => (
                          <div key={index} className="p-3 rounded-lg bg-[#0e1322] text-xs font-medium text-slate-200 border border-slate-850/60">
                            "{script}"
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase text-[#dcb8ff] tracking-wider mb-2">Cột Trụ Định Hướng Tương Tác</h4>
                      <div className="space-y-3">
                        {planningResult.contentPillars?.map((p: any, index: number) => (
                          <div key={index} className="bg-slate-900/45 p-3 rounded-lg border border-slate-800/80">
                            <p className="text-xs font-bold text-indigo-300">{p.title}</p>
                            <p className="text-[11px] text-[#b9cacb] mt-0.5 leading-relaxed">{p.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual statistics metric */}
                <div className="glass-card rounded-2xl p-6 bg-[#161b2b]/30">
                  <span className="text-slate-500 font-bold tracking-widest text-[9px] uppercase">Seeding Conversion</span>
                  <p className="text-2xl font-black font-mono text-[#00f2ff] mt-2">+342%</p>
                  <p className="text-xs text-slate-400 mt-1">Gia tăng tương tác tự nhiên</p>
                </div>
                
                <div className="glass-card rounded-2xl p-6 bg-[#161b2b]/30">
                  <span className="text-slate-500 font-bold tracking-widest text-[9px] uppercase">Proxy Health Rating</span>
                  <p className="text-2xl font-black font-mono text-emerald-400 mt-2">99.8%</p>
                  <p className="text-xs text-slate-400 mt-1">Địa chỉ IP hoạt động mượt mà</p>
                </div>

                <div className="glass-card rounded-2xl p-6 bg-[#161b2b]/30">
                  <span className="text-slate-500 font-bold tracking-widest text-[9px] uppercase">Daily AI Comments</span>
                  <p className="text-2xl font-black font-mono text-indigo-400 mt-2">12,490</p>
                  <p className="text-xs text-slate-400 mt-1">Phục vụ cho các phòng live</p>
                </div>
              </div>

              {/* Graphic custom SVG path */}
              <div className="glass-card rounded-2xl p-6 bg-[#161b2b]/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-6">Biểu đồ đo lường tương tác hàng tuần</h4>
                
                <div className="h-64 relative flex items-end w-full border-b border-l border-slate-800 pb-1 pl-1">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-4">
                    <div className="w-full border-t border-slate-800/30 text-[10px] text-slate-500 pt-1">15k bình luận</div>
                    <div className="w-full border-t border-slate-800/30 text-[10px] text-slate-500 pt-1">10k bình luận</div>
                    <div className="w-full border-t border-slate-800/30 text-[10px] text-slate-500 pt-1">5k bình luận</div>
                    <div className="w-full text-[10px] text-slate-500">0</div>
                  </div>

                  {/* SVG Chart Overlay */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path 
                      d="M 50 180 Q 150 120 250 150 T 450 60 T 650 40 L 650 180 Z" 
                      fill="url(#gradient-chart)" 
                      opacity="0.15" 
                    />
                    <path 
                      d="M 50 180 Q 150 120 250 150 T 450 60 T 650 40" 
                      fill="none" 
                      stroke="#00f2ff" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />

                    <defs>
                      <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00f2ff" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-slate-800 font-mono text-xs text-slate-300 bg-slate-950/80 h-96 overflow-y-auto scroll-hide space-y-2">
                <p className="text-slate-500">[{new Date().toLocaleString()}] Connecting to VNG Private IP Matrix...</p>
                <p className="text-emerald-400">[SUCCESS] Secured pipeline mapping channel through HN-Viettel-Node-02.</p>
                <p className="text-indigo-400">[INFO] Loaded active bot matrix of 450 items for Forex Scalping 101.</p>
                <p className="text-slate-500">[{new Date().toLocaleString()}] Spawning random micro interval seeding scripts: 12msg/minute</p>
                <p className="text-[#00f2ff]">[AI COGNITION] Requesting seed phrases for stream host @TraderPro_VN</p>
                <p className="text-emerald-400">[AI RESPONSE] Content generator successfully formatted 5 localized VN trader slang scripts.</p>
                <p className="text-slate-500">[{new Date().toLocaleString()}] Heartbeat check: 5 nodes verified online, latency 21ms</p>
                <p className="text-amber-500">[WARNING] Node US-GCP-Node-Backup latency is above average thresholds (185ms). Disconnecting node.</p>
                <p className="text-slate-500">[{new Date().toLocaleString()}] System logs polling tick active.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New Campaign Creation Modal */}
      <AnimatePresence>
        {isNewCampOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card bg-[#161b2c] p-6 rounded-2xl max-w-md w-full border border-[#00f2ff]/30 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
                <Plus className="h-5 w-5 text-[#00f2ff]" />
                KHỞI CHẠY CHIẾN DỊCH SEEDING MỚI
              </h3>

              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tên Chiến Dịch</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ví dụ: Lướt Sóng Vàng Scalping, BTC FOMO Live"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-[#00f2ff]"
                    value={newCampName}
                    onChange={(e) => setNewCampName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Streamer TikTok (Host Handle)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="@TraderPro_VN, @MoonSeeker..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-[#00f2ff]"
                    value={newHost}
                    onChange={(e) => setNewHost(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Số Lượng Bot (Account)</label>
                    <input 
                      type="number" 
                      min="10"
                      max="1000"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none"
                      value={newAccounts}
                      onChange={(e) => setNewAccounts(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tần Suất Bình Luận</label>
                    <select
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none"
                      value={newFreq}
                      onChange={(e) => setNewFreq(e.target.value)}
                    >
                      <option value="5/phút">5/phút</option>
                      <option value="12/phút">12/phút</option>
                      <option value="20/phút">20/phút</option>
                      <option value="30/phút">30/phút</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Định Vị Cảm Xúc (Sentiment)</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none"
                    value={newSentiment}
                    onChange={(e) => setNewSentiment(e.target.value)}
                  >
                    <option value="Tập trung chuyên môn">Tập trung chuyên môn</option>
                    <option value="Khen ngợi bùng nổ">Khen ngợi bùng nổ</option>
                    <option value="Hỏi đáp nghi ngờ nhẹ">Hỏi đáp nghi ngờ nhẹ</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsNewCampOpen(false)}
                    className="flex-1 py-3 text-center border border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-900 text-slate-400"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-center rounded-xl bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] text-xs font-bold cursor-pointer"
                  >
                    Kích hoạt Live Seeding →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
