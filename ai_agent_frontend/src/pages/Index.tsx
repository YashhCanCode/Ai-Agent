import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { AddMemoryDialog } from "@/components/AddMemoryDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Brain, Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  context?: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendUrl, setBackendUrl] = useState("http://127.0.0.1:8000");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      
      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        context: data.context,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Failed to get AI response. Check your backend connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* Animated background mesh */}
      <div className="absolute inset-0 mesh-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative border-b border-border/50 glass-effect backdrop-blur-xl z-10">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-50 animate-pulse" />
              <div className="relative p-2.5 bg-gradient-primary rounded-xl shadow-glow-strong animate-float">
                <Brain className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                AI Knowledge Agent
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              </h1>
              <p className="text-sm text-muted-foreground font-medium">IT Team Continuity Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AddMemoryDialog backendUrl={backendUrl} />
            <SettingsDialog backendUrl={backendUrl} onBackendUrlChange={setBackendUrl} />
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto relative z-0">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-20 animate-fade-in-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-30 animate-pulse" />
                <div className="relative p-6 bg-gradient-primary rounded-3xl shadow-glow-strong animate-float">
                  <Brain className="w-16 h-16 text-primary-foreground" />
                </div>
              </div>
              <div className="space-y-3 max-w-2xl">
                <h2 className="text-4xl font-display font-bold text-foreground glow-text">
                  Welcome to AI Knowledge Agent
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ask questions about IT issues or add new solutions to help the team learn and improve
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {[
                  { icon: Zap, title: "Lightning Fast", desc: "Instant AI responses" },
                  { icon: Brain, title: "Smart Learning", desc: "Grows with your team" },
                  { icon: Sparkles, title: "Context Aware", desc: "Uses relevant knowledge" },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="glass-effect p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group animate-scale-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <feature.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-display font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  context={message.context}
                />
              ))}
              {isLoading && (
                <div className="group flex gap-4 p-6 rounded-2xl glass-effect shadow-xl animate-fade-in-up">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white shadow-glow-strong">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
                      AI Assistant
                      <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                    </div>
                    <div className="flex gap-1.5">
                      {[0, 150, 300].map((delay, i) => (
                        <span
                          key={i}
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="relative border-t border-border/50 glass-effect backdrop-blur-xl z-10">
        <div className="container mx-auto px-6 py-5 max-w-5xl">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about an IT issue..."
              disabled={isLoading}
              className="flex-1 h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300 rounded-xl px-5 font-medium"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-12 px-6 bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-glow hover:shadow-glow-strong hover:scale-105 rounded-xl font-display"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
