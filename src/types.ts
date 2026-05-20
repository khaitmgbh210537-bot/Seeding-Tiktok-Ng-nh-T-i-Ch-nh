export type CampaignStatus = 'Live' | 'Paused' | 'Completed';

export interface Campaign {
  id: string;
  name: string;
  host: string;
  accountCount: number;
  frequency: string; // e.g. "12/phút"
  status: CampaignStatus;
  sentimentStyle: string; // positive, skeptical, trade-specific
}

export interface BotComment {
  id: string;
  botName: string;
  text: string;
  timeLabel: string; // e.g., "Just now", "2s ago"
  sentiment: 'positive' | 'neutral' | 'skeptical';
  campaignName: string;
}

export interface ProxyNode {
  id: string;
  name: string;
  ip: string;
  latency: number;
  status: 'online' | 'offline';
  location: string;
}

export interface StrategyInput {
  topic: string;
  niche: 'Crypto' | 'Forex' | 'Gold' | 'Custom';
  targetViewer: string;
}

export interface StrategyResponse {
  recommendedScript: string[];
  contentPillars: {
    title: string;
    description: string;
  }[];
  sentimentGoal: string;
  safetyTip: string;
}
