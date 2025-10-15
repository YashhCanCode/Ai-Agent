import { Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  context?: string;
}

export const ChatMessage = ({ role, content, context }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "group flex gap-4 p-6 rounded-2xl transition-all duration-500 animate-fade-in-up hover:scale-[1.01]",
        isUser 
          ? "bg-gradient-to-br from-user-message/10 to-accent/5 border border-user-message/20 shadow-lg hover:shadow-glow" 
          : "glass-effect shadow-xl hover:shadow-glow-strong"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
          isUser 
            ? "bg-gradient-primary text-primary-foreground shadow-glow" 
            : "bg-gradient-to-br from-primary to-accent text-white shadow-glow-strong"
        )}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-display font-semibold text-foreground">
            {isUser ? "You" : "AI Assistant"}
          </span>
          {!isUser && (
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          )}
        </div>
        <div className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {content}
        </div>
        {context && (
          <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border/30 backdrop-blur-sm transition-all duration-300 hover:bg-muted/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-gradient-primary rounded-full" />
              <span className="text-xs font-display font-medium text-muted-foreground uppercase tracking-wider">
                Knowledge Used
              </span>
            </div>
            <div className="text-xs leading-relaxed text-muted-foreground/90 pl-3">
              {context}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
