import { Topbar } from "@/components/app/topbar";
import { ChatPanel } from "@/components/app/chat-panel";

export default function AssistantPage() {
  return (
    <>
      <Topbar title="AI Assistant" />
      <div className="min-h-0 flex-1">
        <ChatPanel scope="all RME projects" />
      </div>
    </>
  );
}
