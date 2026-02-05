import { Scan, Target } from "lucide-react";

interface DetectionOutputProps {
  detectedObject: string | null;
  isScanning: boolean;
}

export function DetectionOutput({ detectedObject, isScanning }: DetectionOutputProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Output Label */}
      <div className="flex items-center gap-3">
        <Target className="w-5 h-5 text-primary" />
        <span className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest">
          Detection Output
        </span>
        {isScanning && (
          <span className="flex items-center gap-2 ml-auto">
            <Scan className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-rajdhani text-xs text-primary">SCANNING...</span>
          </span>
        )}
      </div>

      {/* Detection Display Box */}
      <div className="glass-panel hud-border p-6 min-h-[80px] flex items-center justify-center">
        {detectedObject ? (
          <div className="text-center">
            <p className="font-orbitron text-2xl md:text-3xl text-primary font-bold tracking-wider text-glow-cyan">
              {detectedObject.toUpperCase()}
            </p>
            <p className="font-rajdhani text-sm text-muted-foreground mt-2">
              Object Identified
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-orbitron text-lg text-muted-foreground/50 tracking-wider">
              {isScanning ? "ANALYZING FRAME..." : "NO DETECTION"}
            </p>
            <p className="font-rajdhani text-xs text-muted-foreground/30 mt-1">
              {isScanning ? "Processing visual data" : "Awaiting camera input"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
