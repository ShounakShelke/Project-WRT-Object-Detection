import { Camera, CameraOff } from "lucide-react";

interface CameraDisplayProps {
  isActive: boolean;
}

export function CameraDisplay({ isActive }: CameraDisplayProps) {
  return (
    <div className="relative w-full aspect-video max-w-4xl mx-auto">
      {/* HUD Border Container */}
      <div className="absolute inset-0 glass-panel hud-border overflow-hidden">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/80" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary/80" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary/80" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/80" />

        {/* Camera Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isActive ? (
            <div className="relative w-full h-full scan-line">
              {/* Simulated camera feed placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-background/50 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse-glow" />
                  <p className="font-orbitron text-primary text-sm tracking-wider">
                    CAMERA ACTIVE
                  </p>
                  <p className="font-rajdhani text-muted-foreground text-xs mt-1">
                    Awaiting video stream...
                  </p>
                </div>
              </div>

              {/* Scan overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 font-orbitron text-xs text-primary/60">
                  <span className="animate-pulse">● </span>REC
                </div>
                <div className="absolute top-4 right-4 font-rajdhani text-xs text-muted-foreground">
                  1920×1080 | 30 FPS
                </div>
                <div className="absolute bottom-4 left-4 font-rajdhani text-xs text-muted-foreground">
                  AI DETECTION: ACTIVE
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <CameraOff className="w-20 h-20 text-muted-foreground/40 mx-auto mb-4" />
              <p className="font-orbitron text-muted-foreground text-lg tracking-wider">
                CAMERA OFFLINE
              </p>
              <p className="font-rajdhani text-muted-foreground/60 text-sm mt-2">
                Press START to initialize feed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
