import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
export default function SourcesPanel() {
  return (
    <aside className="w-1/3 min-w-[280px] border-r border-stone-300 flex flex-col bg-neutral-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-300">
        <h2 className="text-sm font-medium text-neutral-800">Sources</h2>
        <Button size="sm" variant="outline" className="border-stone-400 text-neutral-800 hover:bg-neutral-200">+ Add</Button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 text-center text-neutral-500 flex flex-col items-center justify-center">
        <Upload className="w-10 h-10 mb-3 text-neutral-400" />
        <p className="text-sm">Saved sources will appear here</p>
        <p className="text-xs mt-1 text-neutral-400">
          Add PDFs, text, websites, or CSV files
        </p>
        <div className="mt-4 space-y-2 w-full">
          <Textarea placeholder="Paste text here..." className="bg-neutral-100 border-stone-300 text-neutral-800" />
          <Input type="file" className="bg-neutral-100 border-stone-300 text-neutral-800" />
          <div className="flex gap-2">
            <Input placeholder="Website URL" className="bg-neutral-100 border-stone-300 text-neutral-800" />
            <Button variant="default" size="sm" className="bg-neutral-300 text-neutral-800 hover:bg-neutral-400">Fetch</Button>
          </div>
        </div>
      </div>
    </aside>
  );
}