'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Mic, ChevronDown, Sparkles, User, RefreshCw } from 'lucide-react';
import { sendChatMessage, type ChatMessage } from '../services/aiService';
import { aiSuggestions as suggestions } from '../data/mockData';
import { motion } from 'motion/react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm **SwingAI**, your intelligent trading assistant.\n\nI can help you with:\n• Stock analysis & trade setups\n• Technical pattern identification\n• Portfolio risk assessment\n• Sector rotation insights\n\nWhat would you like to analyze today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, minimized]);

  useEffect(() => {
    if (isOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, minimized]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! How can I help you with your trading strategy?",
      timestamp: new Date(),
    }]);
  };

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Bullet points
        if (line.startsWith('•')) {
          return `<div class="flex gap-1.5 mt-0.5"><span class="text-violet-400 mt-0.5">•</span><span>${line.slice(1).trim()}</span></div>`;
        }
        return line ? `<span>${line}</span>` : '<br/>';
      })
      .join('');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`fixed bottom-4 right-4 z-50 flex flex-col rounded-2xl shadow-2xl border overflow-hidden
        bg-[#0f1120] border-[#1e2140] text-slate-100
        ${minimized ? 'w-72 h-12' : 'w-80 sm:w-96 h-[580px]'}
        transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1e2140] flex-shrink-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-100" style={{ fontSize: '0.85rem', fontWeight: 600 }}>SwingAI Assistant</span>
            <span className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400" style={{ fontSize: '0.6rem' }}>Live</span>
            </span>
          </div>
          {!minimized && <div className="text-violet-400" style={{ fontSize: '0.65rem' }}>Powered by GPT-4</div>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={clearChat} className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors" title="Clear chat">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setMinimized(!minimized)} className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${minimized ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={onClose} className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-tr-sm'
                    : 'bg-slate-800/80 text-slate-200 rounded-tl-sm border border-slate-700/50'
                  }`} style={{ fontSize: '0.78rem', lineHeight: '1.5' }}>
                  {msg.role === 'assistant' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  ) : (
                    msg.content
                  )}
                  <div className={`mt-1 ${msg.role === 'user' ? 'text-violet-200/60' : 'text-slate-600'}`} style={{ fontSize: '0.6rem' }}>
                    {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-sm px-3 py-2.5">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {suggestions.slice(0, 3).map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 transition-colors"
                  style={{ fontSize: '0.68rem' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-[#1e2140] flex-shrink-0">
            <div className="flex gap-2 items-end bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about stocks, patterns, risk..."
                rows={1}
                className="flex-1 bg-transparent text-slate-200 outline-none placeholder-slate-600 resize-none"
                style={{ fontSize: '0.8rem', lineHeight: '1.5', maxHeight: '80px' }}
              />
              <div className="flex gap-1.5 flex-shrink-0">
                <button className="p-1 text-slate-600 hover:text-slate-400 transition-colors">
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="text-slate-700 text-center mt-1.5" style={{ fontSize: '0.6rem' }}>
              SwingAI may make mistakes. Verify before trading.
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}