// src/components/ChatWidget.jsx

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { chatWithAssistant } from "../services/aiService";

function ChatWidget() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [geminiHistory, setGeminiHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  if (!isAuthenticated) return null;

  const suggestedQuestions = [
    "What can I cook with eggs?",
    "Give me a healthy dinner idea",
    "What can I substitute for butter?",
  ];

  const handleSend = async (messageText = input) => {
    const userMessage = messageText.trim();

    if (!userMessage || loading) return;

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const data = await chatWithAssistant(
        userMessage,
        geminiHistory
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply,
        },
      ]);

      setGeminiHistory((prev) => [
        ...prev,
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
        {
          role: "model",
          parts: [{ text: data.reply }],
        },
      ]);
    } catch (error) {
      console.error("AI assistant error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I couldn't process that right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">

      {/* =====================================================
          CHAT WINDOW
      ====================================================== */}

      {isOpen && (
        <div className="mb-4 flex h-[min(650px,calc(100vh-110px))] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white shadow-2xl sm:w-[390px]">

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="relative overflow-hidden bg-[#1C1917] px-5 py-4 text-white">

            {/* Decorative background */}
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-500/20 blur-2xl" />

            <div className="relative flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EA580C] text-xl shadow-lg">
                  ✨
                </div>

                <div>
                  <h3 className="text-sm font-bold">
                    Cooking Assistant
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                    <span className="text-[11px] text-stone-300">
                      AI assistant online
                    </span>
                  </div>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>

            </div>
          </div>

          {/* =================================================
              MESSAGES
          ================================================== */}

          <div className="flex-1 overflow-y-auto bg-[#FAF9F6] px-4 py-5">

            {/* Empty state */}
            {messages.length === 0 && (
              <div className="flex min-h-full flex-col justify-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                  👨‍🍳
                </div>

                <h4 className="mt-4 text-center text-lg font-bold text-[#1C1917]">
                  How can I help you cook?
                </h4>

                <p className="mx-auto mt-2 max-w-[280px] text-center text-sm leading-5 text-[#78716C]">
                  Ask me about recipes, ingredients, substitutions,
                  cooking techniques or meal ideas.
                </p>

                {/* Suggestions */}
                <div className="mt-6 space-y-2">

                  <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">
                    Try asking
                  </p>

                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleSend(question)}
                      className="w-full rounded-xl border border-[#E7E5E4] bg-white px-3 py-3 text-left text-xs font-medium text-[#57534E] transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                    >
                      {question}
                    </button>
                  ))}

                </div>

              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <div className="space-y-4">

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    {/* AI avatar */}
                    {msg.sender === "ai" && (
                      <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm">
                        ✨
                      </div>
                    )}

                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-5 ${
                        msg.sender === "user"
                          ? "rounded-br-md bg-[#EA580C] text-white"
                          : "rounded-bl-md border border-[#E7E5E4] bg-white text-[#44403C] shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>

                  </div>
                ))}

                {/* Loading */}
                {loading && (
                  <div className="flex justify-start">

                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-sm">
                      ✨
                    </div>

                    <div className="rounded-2xl rounded-bl-md border border-[#E7E5E4] bg-white px-4 py-3 shadow-sm">

                      <div className="flex items-center gap-1">

                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A8A29E]" />

                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A8A29E]"
                          style={{ animationDelay: "100ms" }}
                        />

                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A8A29E]"
                          style={{ animationDelay: "200ms" }}
                        />

                      </div>

                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />

              </div>
            )}

          </div>

          {/* =================================================
              INPUT
          ================================================== */}

          <div className="border-t border-[#E7E5E4] bg-white p-3">

            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2"
            >

              <div className="flex-1 rounded-2xl border border-[#D6D3D1] bg-[#FAFAF9] px-3 py-2 transition-colors focus-within:border-orange-400 focus-within:bg-white"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about cooking..."
                  rows={1}
                  disabled={loading}
                  className="max-h-24 w-full resize-none bg-transparent text-sm text-[#292524] outline-none placeholder:text-[#A8A29E] disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EA580C] text-lg text-white shadow-sm transition-all hover:bg-[#C2410C] hover:shadow-md disabled:cursor-not-allowed disabled:bg-[#D6D3D1]"
              >
                ↑
              </button>

            </form>

            <p className="mt-2 text-center text-[10px] text-[#A8A29E]">
              AI can make mistakes. Always verify important information.
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          FLOATING BUTTON
      ====================================================== */}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open cooking assistant"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#EA580C] text-2xl text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#C2410C] hover:shadow-floating"
        >

          {/* Pulse */}
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-orange-400 opacity-20" />

          <span className="transition-transform duration-300 group-hover:rotate-12">
            ✨
          </span>

        </button>
      )}

    </div>
  );
}

export default ChatWidget;