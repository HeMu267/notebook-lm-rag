import Header from "@/components/Header";
import SourcesPanel from "@/components/SourcesPanel";
import ChatPanel from "@/components/ChatPanel";

export default function HomePage() {
  

  return (
    <main className="h-screen flex flex-col bg-neutral-100">
      <Header></Header>
      <div className="flex flex-1 overflow-hidden">
        <SourcesPanel/>
        <ChatPanel/>
      </div>
    </main>
  );
}