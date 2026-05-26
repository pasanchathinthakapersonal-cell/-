import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, User, HelpCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Message } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ConversationalWorkspaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onGenerateReport: () => void;
  hasReport: boolean;
}

export const ConversationalWorkspace: React.FC<ConversationalWorkspaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onGenerateReport,
  hasReport,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle TTS for new assistant messages
  useEffect(() => {
    if (messages.length > 0 && ttsEnabled) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant" && !lastMsg.isAudio) {
        speakResponse(lastMsg.content);
      }
    }
  }, [messages, ttsEnabled]);

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel current readouts
      // Remove markdown for cleaner speech synthesis narration
      const cleanText = text
        .replace(/\*\*|__/g, "")
        .replace(/#+\s/g, "")
        .replace(/-\s/g, "")
        .substring(0, 300); // Speak first 300 chars to avoid exhausting voice limits

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.start();
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
    // Stop recording if running
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    stopSpeaking();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Pre-configured suggestions to showcase AI analysis
  const suggestions = [
    "SaaS for automated urban gardening with IoT sensors",
    "On-demand drone delivery service for local organic medicine",
    "B2B marketplace for carbon credit offset validation in agriculture",
  ];

  return (
    <div className="flex flex-col h-full bg-cyber-card/80 border border-cyber-bright/35 rounded-xl shadow-2xl relative overflow-hidden">
      {/* Workspace Header */}
      <div className="px-5 py-3.5 border-b border-cyber-bright/30 bg-cyber-bg/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyber-primary shadow-[0_0_8px_#02e018]"></span>
          <h2 className="font-display font-medium text-sm tracking-wide text-white uppercase">
            Brainstorming Workspace
          </h2>
        </div>
        
        {/* TTS Toggle and Generate Report Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (ttsEnabled) {
                stopSpeaking();
              }
              setTtsEnabled(!ttsEnabled);
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              ttsEnabled
                ? "border-cyber-primary/40 text-cyber-primary bg-cyber-primary/5"
                : "border-cyber-bright/40 text-cyber-muted hover:border-cyber-bright"
            }`}
            title={ttsEnabled ? "Mute Cyril's voice output" : "Unmute Cyril's voice output"}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onGenerateReport}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-primary text-black font-semibold text-xs transition-all hover:shadow-[0_0_15px_rgba(2,224,24,0.5)] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hasReport ? "Update Report" : "Compile Full Report"}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-black/60">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isCyril = message.role === "assistant";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3.5 max-w-[85%] ${isCyril ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                    isCyril
                      ? "border-cyber-primary/40 bg-cyber-primary/10 text-cyber-primary"
                      : "border-cyber-tertiary/40 bg-cyber-tertiary/10 text-cyber-tertiary"
                  }`}
                >
                  {isCyril ? (
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isCyril
                        ? "bg-cyber-surface/90 border border-cyber-primary/20 text-cyber-text"
                        : "bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary"
                    }`}
                  >
                    {/* Render Cyril's segmented response if matches AgTech style */}
                    {isCyril && message.content.includes("Market Need") ? (
                      <div className="space-y-3.5">
                        <p className="font-display font-medium text-white text-base border-b border-cyber-bright/20 pb-2">
                          🌱 Analysis for Automated Urban Gardening
                        </p>
                        <p className="text-cyber-muted">
                          The intersection of AgTech and smart home/urban living is growing rapidly. Here is a high-level breakdown of viability:
                        </p>
                        <div className="grid gap-3.5 my-3">
                          <div className="p-3.5 rounded-xl bg-cyber-bg/50 border border-cyber-tertiary/20">
                            <span className="text-cyber-tertiary text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider mb-1 font-label">
                              <Sparkles className="w-3.5 h-3.5" /> Market Need
                            </span>
                            <p className="text-xs text-cyber-text">
                              High among urban millennials and eco-conscious demographics lacking gardening experience but seeking self-sustainability.
                            </p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-cyber-bg/50 border border-red-500/20">
                            <span className="text-red-400 text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider mb-1 font-label">
                              <HelpCircle className="w-3.5 h-3.5" /> Operational Challenges
                            </span>
                            <p className="text-xs text-cyber-text">
                              Hardware integration (IoT sensors) and supply-chain logistics are typically the hardest parts of this model. Requires robust prototype testing.
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-cyber-muted italic">
                          To differentiate, you might focus on a specific niche first—like high-yield indoor herbs or exotic houseplants—before expanding.
                        </p>
                        <div className="mt-4 pt-3.5 border-t border-cyber-bright/20 flex justify-end">
                          <button
                            onClick={onGenerateReport}
                            className="flex items-center gap-1 text-[10px] uppercase font-semibold text-cyber-primary hover:underline cursor-pointer"
                          >
                            <span>Compile detailed architecture</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-words prose prose-invert prose-xs table-container">
                        {message.content}
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp & Speak Specific Message */}
                  <div className="flex items-center gap-2.5 px-1 mt-1 justify-end">
                    <span className="text-[10px] text-cyber-muted font-mono">{message.timestamp}</span>
                    {isCyril && (
                      <button
                        onClick={() => speakResponse(message.content)}
                        className="text-[10px] text-cyber-muted hover:text-cyber-primary flex items-center gap-1"
                        title="Read message out loud"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span className="text-[9px] uppercase tracking-wider">Listen</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Loader */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%] mr-auto"
            >
              <div className="w-8 h-8 rounded-full border border-cyber-primary/40 bg-cyber-primary/10 text-cyber-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-cyber-surface/90 border border-cyber-primary/20 text-cyber-text min-w-[80px]">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-1.5 w-1.5 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="h-1.5 w-1.5 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompts */}
      {messages.length <= 1 && (
        <div className="px-5 py-3 border-t border-cyber-bright/20 bg-cyber-bg/50">
          <p className="text-xs text-cyber-muted mb-2 font-mono uppercase tracking-widest text-[9px]">
            Suggestions for immediate validation:
          </p>
          <div className="flex flex-col gap-2">
            {suggestions.map((s, index) => (
              <button
                key={index}
                onClick={() => setInputText(s)}
                className="text-left text-xs px-3 py-2 rounded-lg bg-cyber-surface/60 border border-cyber-bright/30 text-cyber-muted hover:border-cyber-primary/40 hover:text-cyber-primary hover:bg-cyber-primary/5 transition-all w-full cursor-pointer truncate"
              >
                ⚡ {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 border-t border-cyber-bright/35 bg-cyber-bg/95 flex items-center gap-3">
        {/* Toggle Speech Listener Button */}
        <button
          onClick={toggleListening}
          className={`p-3.5 rounded-xl border transition-all relative cursor-pointer flex items-center justify-center shrink-0 ${
            isListening
              ? "bg-red-500/10 border-red-500/60 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse"
              : "bg-cyber-surface border-cyber-bright/50 text-cyber-muted hover:border-cyber-primary hover:text-cyber-primary"
          }`}
          title={isListening ? "Stop voice listening" : "Start voice dictation / speak your idea"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input Box */}
        <div className="relative flex-1">
          {isListening && (
            <div className="absolute inset-0 bg-cyber-[#1f222a]/50 rounded-xl pointer-events-none flex items-center px-4 overflow-hidden z-10 border border-red-500/30">
               <div className="absolute top-0 left-0 bottom-0 bg-red-500/10 pointer-events-none animate-pulse w-full"></div>
            </div>
          )}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening feed active... Speak clearly." : "Type your business concept here..."}
            className={`w-full bg-cyber-surface border text-cyber-text rounded-xl pl-4 pr-12 py-3.5 text-sm outline-none transition-all resize-none h-12 relative z-20 ${
              isListening ? "border-red-500/50 bg-transparent text-red-50" : "border-cyber-bright/50 focus:border-cyber-primary"
            }`}
            disabled={isListening}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-cyber-primary hover:shadow-[0_0_10px_rgba(0,255,157,0.4)] transition-all cursor-pointer text-black disabled:opacity-30 disabled:shadow-none z-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
