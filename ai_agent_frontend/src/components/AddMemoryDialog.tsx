import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddMemoryDialogProps {
  backendUrl: string;
}

export const AddMemoryDialog = ({ backendUrl }: AddMemoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issue.trim() || !solution.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both issue and solution",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/add_memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue, solution }),
      });

      if (!response.ok) throw new Error("Failed to add memory");

      toast({
        title: "Memory added successfully",
        description: "The AI will now use this knowledge",
      });

      setIssue("");
      setSolution("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Failed to add memory. Check your backend connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-glow hover:shadow-glow-strong hover:scale-105 font-display">
          <Plus className="w-4 h-4" />
          Add Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px] glass-effect border-border/50 shadow-glow-strong">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Add New Memory
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Store an issue and its solution for the AI to learn from
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="issue" className="text-sm font-display font-medium">Issue</Label>
            <Input
              id="issue"
              placeholder="Describe the IT issue..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="solution" className="text-sm font-display font-medium">Solution</Label>
            <Textarea
              id="solution"
              placeholder="Provide the solution..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              disabled={isLoading}
              rows={6}
              className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 resize-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-glow hover:shadow-glow-strong font-display"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Memory...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Add Memory
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
