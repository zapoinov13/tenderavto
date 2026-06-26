import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X } from "lucide-react";
import { aiRespond, CHAT_SUGGESTIONS, type ChatMsg } from "@/lib/ai";

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "ai",
      text: "Привет! Я AI-ассистент по тендерам. Спросите про подходящие лоты, заказчика, цену или попросите собрать черновик.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: aiRespond(q) }]);
      setTyping(false);
    }, 650);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-gradient-brand shadow-glow flex items-center justify-center text-white hover:scale-105 transition"
        aria-label="AI-ассистент"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[min(92vw,400px)] h-[min(70vh,560px)] rounded-2xl border bg-card shadow-card flex flex-col overflow-hidden animate-fade-up">
          <div className="px-4 py-3 bg-gradient-primary text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold">AI-ассистент</div>
              <div className="text-[11px] text-white/70">QazTender AI · онлайн</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {CHAT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1.5 rounded-full border bg-background text-muted-foreground hover:text-foreground hover:border-brand/40 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите про тендеры…"
              className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
            />
            <button
              type="submit"
              className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
