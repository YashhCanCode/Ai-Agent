import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Check } from "lucide-react";

interface SettingsDialogProps {
  backendUrl: string;
  onBackendUrlChange: (url: string) => void;
}

export const SettingsDialog = ({ backendUrl, onBackendUrlChange }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(backendUrl);

  const handleSave = () => {
    onBackendUrlChange(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-effect border-border/50 shadow-glow-strong">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure your backend API connection
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="backend-url" className="text-sm font-display font-medium">Backend URL</Label>
            <Input
              id="backend-url"
              placeholder="http://localhost:8000"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
            />
            <p className="text-xs text-muted-foreground">
              Enter your FastAPI backend URL (e.g., http://localhost:8000)
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-glow hover:shadow-glow-strong font-display gap-2"
          >
            <Check className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
