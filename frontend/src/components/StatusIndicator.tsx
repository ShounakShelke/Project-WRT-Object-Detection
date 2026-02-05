import { Activity, Cpu, Wifi } from "lucide-react";

interface StatusIndicatorProps {
  isActive: boolean;
}

export function StatusIndicator({ isActive }: StatusIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-6 md:gap-10">
      {/* System Status */}
      <div className="flex items-center gap-2">
        <Cpu className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
        <span className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
          System
        </span>
        <span className={`w-2 h-2 rounded-full ${isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
      </div>

      {/* AI Status */}
      <div className="flex items-center gap-2">
        <Activity className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
        <span className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
          AI Engine
        </span>
        <span className={`w-2 h-2 rounded-full ${isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <Wifi className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
        <span className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
          Stream
        </span>
        <span className={`w-2 h-2 rounded-full ${isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
      </div>
    </div>
  );
}
