import React from 'react';
import { Bot, Send, Mic, AlertTriangle, MessageSquare } from 'lucide-react';
import { useRole } from '../context/RoleContext';

const Assistant = () => {
  const { t } = useRole();
  return (
    <div className="flex flex-col min-h-full max-w-4xl mx-auto w-full px-margin-mobile pt-6 pb-10">
      {/* Chat Header / Intro */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-primary/5">
          <Bot size={36} className="text-primary" />
        </div>
        <h2 className="font-display-lg text-primary text-2xl">{t("AgroAI Assistant")}</h2>
        <p className="font-body-base text-on-surface-variant/60 text-sm max-w-[280px]">{t("Your expert digital partner for precision farming and crop health.")}</p>
      </div>

      {/* Messages Container */}
      <div className="space-y-stack-md">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="glass-card max-w-[80%] rounded-2xl rounded-tr-none px-gutter py-stack-md text-primary font-body-base">
            {t("How are my wheat crops doing today? Any alerts I should know about?")}
          </div>
        </div>

        {/* AI Analysis Card Message */}
        <div className="flex justify-start items-start gap-stack-sm">
          <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="flex flex-col gap-stack-sm w-full">
            <div className="glass-card max-w-[90%] rounded-2xl rounded-tl-none px-gutter py-stack-md border-l-4 border-error">
              <div className="flex items-center gap-2 mb-2 text-error font-black uppercase text-[10px] tracking-widest">
                <AlertTriangle size={14} /> {t("Issue Identified")}
              </div>
              <p className="text-primary font-body-base mb-stack-md">
                {t("From your scan yesterday in Sector B-12, I've identified signs of Wheat Leaf Rust. The orange-brown pustules are spreading due to high humidity.")}
              </p>
              <div className="rounded-xl overflow-hidden mb-stack-md border border-white/40">
                <img alt="Crop Scan" className="w-full h-40 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZa6WsEGbJL-ObBsyFJAWN5o7zpEO6ghMqVZmi7XSXU8ppa8DaKZtVYnJs4Qg6M_LSmokQFrF53IbwBYPyBtdBnLYHBEPBHGhE-b8vG7Vrx9VbMxNKpB2q0KLuRXCT5pEPPFiv3TWUOOZqbnBQMLTpWISUe8Lh-LxDHDBcIuLmzlP_wtvz7Q0uKtmkItgg7ucKbslQIv7sUSqHR-SBKhds13uQhSCgvY5iw2Du3QTJ-7nC0Ry4H879phOfR3-9RG0KfvFLRdtB_pSO" />
              </div>
              <p className="text-on-surface-variant font-body-base italic text-sm">
                "{t("Action recommended within 48 hours to prevent 15% yield loss.")}"
              </p>
            </div>
          </div>
        </div>

        {/* AI Advice Message */}
        <div className="flex justify-start items-start gap-stack-sm">
          <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="glass-card max-w-[85%] rounded-2xl rounded-tl-none px-gutter py-stack-md text-primary font-body-base">
            {t("I recommend applying a triazole-based fungicide. Would you like me to check local inventory for specific products?")}
          </div>
        </div>
      </div>

      {/* Quick Replies */}
      <div className="flex flex-wrap gap-2 mt-stack-lg">
        {[t("Which pesticide?"), t("Organic alternatives?"), t("Prevent future rust")].map(text => (
          <button key={text} className="bg-secondary-container border border-outline-variant/30 text-on-secondary-container px-4 py-2 rounded-full font-body-sm hover:bg-secondary-fixed transition-colors active:scale-95">
            {text}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="sticky bottom-4 z-50 mt-auto w-full max-w-[400px] mx-auto px-1">
        <div className="flex items-center gap-2 glass-card rounded-full p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/40 bg-white/60 backdrop-blur-md">
          <div className="flex-grow flex items-center bg-white/40 rounded-full px-4 py-0.5">
            <input 
              className="w-full bg-transparent border-none focus:ring-0 text-primary py-2 text-sm placeholder:text-on-surface-variant/40" 
              placeholder={t("Ask AgroAI...")} 
              type="text"
            />
            <button className="text-secondary/60 hover:text-secondary p-1.5 transition-colors">
              <Mic size={20} />
            </button>
          </div>
          <button className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform flex-shrink-0">
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
