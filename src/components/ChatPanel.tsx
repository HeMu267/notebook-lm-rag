"use client";

import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

function MessageList({
  messages,
  loading,
  assistanttomRef,
}: {
  messages: { role: "user" | "assistant"; text: string }[];
  loading: boolean;
  assistanttomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-3">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-neutral-500">
          {/* <Upload className="w-10 h-10 mb-3 text-neutral-400" /> */}
          <p className="text-lg font-medium">Add a source to get started</p>
          {/* <Button variant="outline" className="mt-3 border-stone-400 text-neutral-800 hover:bg-neutral-200">Upload a source</Button> */}
        </div>
      ) : (
        messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-3 w-fit max-w-[80%] rounded-lg break-words whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-700 text-gray-100"
            }`}
          >
            {msg.text}
          </motion.div>
        ))
      )}
      {loading && (
        <div className="flex justify-center p-3">
          <span className="text-gray-400">Thinking...</span>
        </div>
      )}

      <div ref={assistanttomRef} />
    </div>
  );
}

// Chat Input Component
function ChatInput({
  input,
  setInput,
  handleSend,
}: {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}) {
  return (
    <div className="border-t border-stone-300 p-4 flex items-center gap-2 bg-neutral-50">
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 160) + "px";
        }}
        placeholder="Ask a question..."
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        className="flex-1 resize-none rounded-lg p-3 border-stone-300 bg-neutral-100 text-black outline-none focus:ring-2 focus:ring-blue-500 max-h-40 overflow-y-auto"
      />
      <Button
        onClick={handleSend}
        disabled={!input.trim()}
        className="bg-neutral-300 text-neutral-800 hover:bg-neutral-400 rounded-lg px-4 py-2 transition-colors duration-200"
      >
        Send
      </Button>
    </div>
  );
}

// Chat Panel Component
export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const assistanttomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    assistanttomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", text: input };
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data?.reply || "Sorry, I received an invalid response." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex-1 flex flex-col bg-neutral-100">
      <MessageList messages={messages} loading={loading} assistanttomRef={assistanttomRef} />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </section>
  );
}