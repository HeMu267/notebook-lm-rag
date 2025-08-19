"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface Source {
  id: string;
  type: "file" | "text" | "url";
  name: string;
  status: "uploading" | "processed" | "error";
}

interface ApiResponse {
  success: boolean;
  error?: string;
}

export default function SourcesPanel() {
  const [sources, setSources] = useState<Source[]>([]);
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_SOURCES = 3;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (sources.filter(s => s.status === "processed").length >= MAX_SOURCES) {
      setError("Maximum 3 sources (PDFs, text, or URLs) allowed per session. Refresh to start a new session.");
      return;
    }

    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        return;
      }

      const sourceId = crypto.randomUUID();
      setSources([...sources, { id: sourceId, type: "file", name: file.name, status: "uploading" }]);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sourceId", sourceId);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data: ApiResponse = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Failed to upload PDF");
        setSources((prev) =>
          prev.map((s) =>
            s.id === sourceId ? { ...s, status: "processed" } : s
          )
        );
      } catch (error: any) {
        setSources((prev) =>
          prev.map((s) =>
            s.id === sourceId ? { ...s, status: "error" } : s
          )
        );
        setError(error.message || "Failed to upload PDF.");
      }
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setError("Please enter some text to submit.");
      return;
    }
    if (sources.filter(s => s.status === "processed").length >= MAX_SOURCES) {
      setError("Maximum 3 sources (PDFs, text, or URLs) allowed per session. Refresh to start a new session.");
      return;
    }

    const sourceId = crypto.randomUUID();
    setSources([...sources, { id: sourceId, type: "text", name: `Text-${sourceId.slice(0, 8)}`, status: "uploading" }]);
    const text = textInput;
    setTextInput("");
    setError(null);

    try {
      const response = await fetch("/api/submit-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId, text }),
        credentials: "include",
      });

      const data: ApiResponse = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to submit text");
      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId ? { ...s, status: "processed" } : s
        )
      );
    } catch (error: any) {
      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId ? { ...s, status: "error" } : s
        )
      );
      setError(error.message || "Failed to submit text.");
    }
  };

  const handleUrlFetch = async () => {
    if (!urlInput.trim()) {
      setError("Please enter a valid URL.");
      return;
    }
    if (sources.filter(s => s.status === "processed").length >= MAX_SOURCES) {
      setError("Maximum 3 sources (PDFs, text, or URLs) allowed per session. Refresh to start a new session.");
      return;
    }

    const sourceId = crypto.randomUUID();
    setSources([...sources, { id: sourceId, type: "url", name: urlInput, status: "uploading" }]);
    const url = urlInput;
    setUrlInput("");
    setError(null);

    try {
      const response = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId, url }),
        credentials: "include",
      });

      const data: ApiResponse = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to fetch URL");
      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId ? { ...s, status: "processed" } : s
        )
      );
    } catch (error: any) {
      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId ? { ...s, status: "error" } : s
        )
      );
      setError(error.message || "Failed to fetch URL content.");
    }
  };

  const handleAddClick = () => {
    if (sources.length >= MAX_SOURCES) {
      setError("Maximum 3 sources (PDFs, text, or URLs) allowed per session. Refresh to start a new session.");
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <aside className="w-1/3 min-w-[280px] border-r border-stone-300 flex flex-col bg-neutral-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-300">
        <h2 className="text-sm font-medium text-neutral-800">Sources ({sources.length}/{MAX_SOURCES})</h2>
        <Button
          size="sm"
          variant="outline"
          className="border-stone-400 text-neutral-800 hover:bg-neutral-200"
          onClick={handleAddClick}
          disabled={sources.length >= MAX_SOURCES}
        >
          + Add PDF
        </Button>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 text-center text-neutral-500 flex flex-col">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        {sources.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Upload className="w-10 h-10 mb-3 text-neutral-400" />
            <p className="text-sm">Saved sources will appear here</p>
            <p className="text-xs mt-1 text-neutral-400">Add up to 3 PDFs, text, or URLs per session</p>
          </div>
        ) : (
          <div className="flex-1">
            <p className="text-sm mb-4">Saved Sources:</p>
            <ul className="space-y-2 text-left">
              {sources.map((source) => (
                <li key={source.id} className="text-sm text-neutral-800 flex items-center">
                  <span>{source.name}</span>
                  <span className="ml-2 text-xs text-neutral-500">
                    ({source.status})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 space-y-2 w-full">
          <Textarea
            placeholder="Paste text here..."
            className="bg-neutral-100 border-stone-300 text-neutral-800"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={sources.length >= MAX_SOURCES}
          />
          <Button
            variant="default"
            size="sm"
            className="bg-neutral-300 text-neutral-800 hover:bg-neutral-400 w-full"
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || sources.length >= MAX_SOURCES}
          >
            Submit Text
          </Button>
          <div className="flex gap-2">
            <Input
              placeholder="Website URL (e.g., https://example.com)"
              className="bg-neutral-100 border-stone-300 text-neutral-800"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={sources.length >= MAX_SOURCES}
            />
            <Button
              variant="default"
              size="sm"
              className="bg-neutral-300 text-neutral-800 hover:bg-neutral-400"
              onClick={handleUrlFetch}
              disabled={!urlInput.trim() || sources.length >= MAX_SOURCES || true}
            >
              Fetch URL
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}