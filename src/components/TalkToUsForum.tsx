import React, { useState, useEffect } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import {
  MessageSquare,
  Users,
  ShieldCheck,
  Sparkles,
  Share2,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  Lock,
  Globe,
  Radio,
  Clock,
  Compass,
  UtensilsCrossed,
  Moon,
  Info,
} from 'lucide-react';

interface ForumTopic {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  category: string;
}

const FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'talk-to-us-general',
    title: 'General Community & Tourist Q&A',
    shortDesc: 'Ask questions about traveling in Singapore, general advice, and travel tips',
    icon: <MessageSquare className="w-4 h-4" />,
    category: 'General',
  },
  {
    id: 'talk-to-us-haze-reports',
    title: 'Live Smoke Haze & Air Quality Ground Reports',
    shortDesc: 'Share real-time sensory reports (smell, visibility, burning peat smoke) across neighborhoods',
    icon: <Radio className="w-4 h-4" />,
    category: 'Ground Reports',
  },
  {
    id: 'talk-to-us-itinerary',
    title: 'Indoor Activities & Rainy / Hazy Day Spots',
    shortDesc: 'Recommend indoor museums, botanical biodomes, sheltered play areas, and malls',
    icon: <Compass className="w-4 h-4" />,
    category: 'Activities',
  },
  {
    id: 'talk-to-us-eateries',
    title: 'Singapore Foodie Chat & Eateries Reviews',
    shortDesc: 'Discuss the best hawker stalls, air-conditioned dining halls, and secret culinary spots',
    icon: <UtensilsCrossed className="w-4 h-4" />,
    category: 'Food & Dining',
  },
  {
    id: 'talk-to-us-nightlife',
    title: 'Indoor Nightspots, Speakeasies & Evening Plans',
    shortDesc: 'Exchange recommendations on secret bars, live jazz clubs, and late-night indoor venues',
    icon: <Moon className="w-4 h-4" />,
    category: 'Nightlife',
  },
];

export const TalkToUsForum: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic>(FORUM_TOPICS[0]);
  const [language, setLanguage] = useState<string>('en');
  const [showSsoDrawer, setShowSsoDrawer] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Compute canonical URL for Disqus
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://captain-haze.sg';
  const articleUrl = `${baseUrl}/talk-to-us#${selectedTopic.id}`;

  const disqusShortname = 'haze-indoor-activity';

  const disqusConfig = {
    url: articleUrl,
    identifier: selectedTopic.id,
    title: `${selectedTopic.title} - Captain Haze Singapore`,
    language: language,
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(articleUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden border border-slate-700">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide border border-indigo-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Community Forum & Ground Reports</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Talk to Us — Singapore Haze & Tourist Community
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the official <strong>Captain Haze community forum</strong> powered by Disqus. Whether you are a tourist seeking advice on whether to visit Marina Bay Sands today, a local sharing smoke haze observations from Woodlands or Jurong, or looking for indoor foodie gems, join the conversation below!
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-600 text-slate-200 flex items-center gap-2 font-medium">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>
                <CommentCount shortname={disqusShortname} config={disqusConfig}>
                  Comments
                </CommentCount>
              </span>
            </div>

            <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Forum Channel: haze-indoor-activity</span>
            </div>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors font-medium ml-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? 'Copied Link!' : 'Share Thread'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Forum Controls & Topics Selection */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Discussion Channel
            </label>

            {/* Language & SSO Config Trigger */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent font-medium text-slate-700 focus:outline-none"
                >
                  <option value="en">English (en)</option>
                  <option value="zh_TW">Traditional Chinese (zh_TW)</option>
                  <option value="zh">Simplified Chinese (zh)</option>
                  <option value="ja">Japanese (ja)</option>
                  <option value="ko">Korean (ko)</option>
                  <option value="ms">Bahasa Melayu (ms)</option>
                </select>
              </div>

              <button
                onClick={() => setShowSsoDrawer(!showSsoDrawer)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                  showSsoDrawer
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>SSO Details</span>
              </button>
            </div>
          </div>

          {/* Topic Channels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FORUM_TOPICS.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-slate-800 text-amber-400' : 'bg-white text-slate-600'
                      }`}
                    >
                      {topic.icon}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {topic.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold leading-snug line-clamp-1">
                      {topic.title}
                    </h3>
                    <p
                      className={`text-[11px] leading-relaxed line-clamp-2 mt-1 ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {topic.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SSO & Integration Helper Box (Expandable) */}
        {showSsoDrawer && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>Disqus Single Sign-On (SSO) & Developer Integration</span>
              </span>
              <button
                onClick={() => setShowSsoDrawer(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <p className="leading-relaxed">
              This forum is configured with the <strong>haze-indoor-activity</strong> Disqus shortname. When using Disqus SSO on a production domain, pass your authenticated payload:
            </p>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto text-[11px] font-mono">
{`<DiscussionEmbed
  shortname='haze-indoor-activity'
  config={{
    url: '${articleUrl}',
    identifier: '${selectedTopic.id}',
    title: '${selectedTopic.title}',
    language: '${language}',
    remoteAuthS3: '', // Generated by your server HMAC-SHA1
    apiKey: '', // Public Disqus API Key
    sso: {
      name: 'Captain Haze Community',
      button: '/favicon.png',
      icon: '/favicon.png',
      url: '/login',
      logout: '/logout',
      width: '800',
      height: '400',
    }
  }}
/>`}
            </pre>
          </div>
        )}
      </section>

      {/* Disqus Embedded Discussion Container */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6 min-h-[450px]">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {selectedTopic.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Channel Identifier: <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{selectedTopic.id}</code> · Shortname: <code className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{disqusShortname}</code>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Live Thread:</span>
            <CommentCount shortname={disqusShortname} config={disqusConfig}>
              Comments
            </CommentCount>
          </div>
        </div>

        {/* Disqus Embed Component */}
        <div className="disqus-container pt-2">
          <DiscussionEmbed
            key={`${selectedTopic.id}-${language}`}
            shortname={disqusShortname}
            config={disqusConfig}
          />
        </div>
      </section>

      {/* Community Guidelines Card */}
      <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 space-y-4 text-xs text-slate-600">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Captain Haze Community Ground Rules</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">1. Accurate Observations</span>
            <p className="text-[11px] leading-relaxed">
              When reporting haze or burning smells, mention your area (e.g. Marina Bay, Jurong, Orchard) and time of observation to help fellow travelers.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">2. Sheltered & Indoor Gems</span>
            <p className="text-[11px] leading-relaxed">
              Feel free to share newly discovered indoor cafes, sheltered linkways, underground shopping tunnels, or air-conditioned museum exhibits.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">3. Respectful & Safe</span>
            <p className="text-[11px] leading-relaxed">
              Always be courteous and refrain from spam. For medical emergencies or severe respiratory distress, immediately call <strong>995</strong> (SCDF).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
