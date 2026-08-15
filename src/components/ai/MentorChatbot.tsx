"use client";

import React, { useState } from "react";
import { useQuizStore } from "@/state/useQuizStore";
import { aiMentorService } from "@/services/ai/mentor";
import { Bot, Send, Sparkles, User, X, MessageSquare } from "lucide-react";

interface MentorChatbotProps {
  currentModuleTitle: string;
  moduleContent: string;
}

export function MentorChatbot({ currentModuleTitle, moduleContent }: MentorChatbotProps) {
  const { mentorMessages, isMentorTyping, addMentorMessage, setMentorTyping } = useQuizStore();
  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    addMentorMessage({
      sender: "user",
      text: query,
    });
    setInputText("");
    setMentorTyping(true);

    try {
      const response = await aiMentorService.askMentor(query, currentModuleTitle, moduleContent);
      addMentorMessage({
        sender: "ai",
        text: response.text,
        suggestedActions: response.suggestedActions,
      });
    } catch (e) {
      addMentorMessage({
        sender: "system",
        text: "Mentor service is temporarily unavailable. Please try again.",
      });
    } finally {
      setMentorTyping(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm rounded-full shadow-xl shadow-orange-500/30 transition-all hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span>Ask AI Mentor</span>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </button>
      )}

      {/* Slide-in Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[550px] flex flex-col glass-panel-glow rounded-2xl border border-orange-500/30 shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Shikkhak AI Tutor</span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.2 rounded font-mono">Live</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                  Context: {currentModuleTitle}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {mentorMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-6 h-6 rounded bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-orange-500 text-white rounded-br-none"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none font-sans"
                  }`}
                >
                  {msg.text}

                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60 space-y-1.5">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Suggested:</div>
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          className="block w-full text-left px-2 py-1 bg-slate-900/60 hover:bg-slate-900 text-[11px] text-orange-300 rounded border border-orange-500/20 hover:border-orange-500/40 transition-colors truncate"
                        >
                          &bull; {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.sender === "user" && (
                  <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isMentorTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs py-1">
                <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div className="flex gap-1 items-center px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about this module..."
                className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isMentorTyping}
                className="p-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
