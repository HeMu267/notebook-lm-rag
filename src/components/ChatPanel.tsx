"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useState } from "react";

function MessageList({ messages }: { messages: { role: "user" | "bot"; text: string }[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-3">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-neutral-500">
          <Upload className="w-10 h-10 mb-3 text-neutral-400" />
          <p className="text-lg font-medium">Add a source to get started</p>
          <Button variant="outline" className="mt-3 border-stone-400 text-neutral-800 hover:bg-neutral-200">Upload a source</Button>
        </div>
      ) : (
        messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-2 rounded-xl ${
              m.role === "user"
                ? "ml-auto bg-blue-200 text-neutral-800"
                : "mr-auto bg-neutral-200 text-neutral-800"
            }`}
          >
            {m.text}
          </div>
        ))
      )}
    </div>
  );
}

// Chat Input Component
function ChatInput({ input, setInput, handleSend }: { input: string; setInput: (value: string) => void; handleSend: () => void }) {
  return (
    <div className="border-t border-stone-300 p-4 flex items-center gap-2 bg-neutral-50">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="bg-neutral-100 border-stone-300 text-neutral-800"
      />
      <Button onClick={handleSend} disabled={!input.trim()} className="bg-neutral-300 text-neutral-800 hover:bg-neutral-400">Send</Button>
    </div>
  );
}

// Chat Panel Component
export default function ChatPanel() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
  };
  return (
    <section className="flex-1 flex flex-col bg-neutral-100">
      <MessageList messages={messages} />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </section>
  );
}