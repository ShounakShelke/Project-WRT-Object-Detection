import { useState, useEffect, useRef } from "react";
import { Camera, X, RefreshCw } from "lucide-react";
import { CockpitButton } from "@/components/ui/cockpit-button";

interface Detection {
  label: string;
  class_id?: number;
  confidence: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2]
}

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Could not access camera. Please ensure camera permissions are granted.");
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setDetections([]);
  };

  // Update video size when video loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      setVideoSize({ width, height });
      
      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = width;
        overlayCanvasRef.current.height = height;
      }
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [isCameraActive]);

  // Draw bounding boxes on overlay canvas
  const drawDetections = (items: Detection[]) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach((det) => {
      const [x1, y1, x2, y2] = det.box;
      const width = x2 - x1;
      const height = y2 - y1;
      
      const boxColor = '#de0000'; // BMW Red
      const accentColor = '#009ada'; // M Cyan

      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);

      // Corner Accents
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      const cs = 15;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1 + cs); ctx.lineTo(x1, y1); ctx.lineTo(x1 + cs, y1);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x2, y2 - cs); ctx.lineTo(x2, y2); ctx.lineTo(x2 - cs, y2);
      ctx.stroke();

      const labelText = `${det.label.toUpperCase()} ${Math.round(det.confidence * 100)}%`;
      ctx.font = 'bold 14px Rajdhani';
      const textMetrics = ctx.measureText(labelText);
      
      ctx.fillStyle = '#003399'; // Deep Blue
      ctx.fillRect(x1, y1 - 25, textMetrics.width + 12, 25);
      
      ctx.fillStyle = boxColor;
      ctx.fillRect(x1, y1 - 25, 3, 25);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, x1 + 8, y1 - 8);
    });
  };

  // Capture & Detect Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCameraActive && videoSize.width > 0) {
      interval = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          setIsDetecting(true);
          const formData = new FormData();
          formData.append('image', blob);

          try {
            const response = await fetch('http://localhost:5000/detect', {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();
            if (Array.isArray(data)) {
              setDetections(data);
              drawDetections(data);
            }
          } catch (e) {
            console.error("Detection failed:", e);
          } finally {
            setIsDetecting(false);
          }
        }, 'image/jpeg', 0.8);

      }, 500);
    }

    return () => clearInterval(interval);
  }, [isCameraActive, videoSize]);

  return (
    <div className="min-h-screen bg-black flex flex-col font-rajdhani">
      {/* BMW M Stripe */}
      <div className="bmw-stripe fixed top-0 left-0 w-full z-50" />

      {/* Title Section */}
      <header className="py-8 md:py-10 px-4">
        <div className="text-center">
          <h1 className="racing-title text-3xl md:text-5xl lg:text-5xl mb-2">
            PROJECT <span className="racing-title-accent">WRT</span> OBJECT DETECTION
          </h1>
          <div className="title-underline mb-4" />
          <p className="font-rajdhani text-muted-foreground text-xs md:text-sm tracking-[0.2em] uppercase font-bold">
            Inspection Performance Suite | Pro-Accuracy Engine
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12 gap-8">
        
        {/* Camera Display Area */}
        <div className="glass-panel w-full max-w-4xl aspect-video relative overflow-hidden border-2 border-zinc-800 shadow-2xl">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`} 
          />
          <canvas 
            ref={overlayCanvasRef} 
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" 
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Hud Overlay */}
          {isCameraActive && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Corner Indicators */}
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 bg-destructive/90 px-3 py-1 rounded-sm">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-white italic">LIVE M-PRO SCAN</span>
                </div>
                <div className="bg-black/40 backdrop-blur-sm border border-bmw-cyan/20 px-2 py-0.5 rounded-sm">
                  <span className="text-[9px] text-bmw-cyan font-bold">FPS: 30 | LATENCY: 24ms</span>
                </div>
              </div>

              {/* Entity Counter */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-zinc-700 px-4 py-2 rounded-lg flex items-center gap-3">
                <span className="text-2xl font-black italic text-white leading-none">{detections.length}</span>
                <span className="text-[8px] text-zinc-400 font-bold uppercase leading-tight">Entities<br/>In Sector</span>
              </div>

              {/* Scanner Status */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-zinc-800 px-3 py-1.5 rounded-full">
                <RefreshCw className={`w-3 h-3 text-bmw-cyan ${isDetecting ? 'animate-spin' : ''}`} />
                <span className="text-[9px] font-black tracking-widest text-bmw-cyan">INTEL_CORE_SCANNING...</span>
              </div>
            </div>
          )}

          {!isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
              <Camera className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <p className="text-zinc-500 text-lg tracking-widest uppercase font-black italic">Station Offline</p>
              <p className="text-zinc-600 text-xs mt-1">Initiate system to begin detection</p>
            </div>
          )}
        </div>

        {/* Camera Control Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-4xl">
          <CockpitButton
            variant="start"
            size="lg"
            onClick={handleStartCamera}
            disabled={isCameraActive}
            className="flex-1 min-w-[200px] h-16 text-lg tracking-widest font-black italic"
          >
            <Camera className="w-5 h-5 mr-1" />
            ENGINE START
          </CockpitButton>

          <CockpitButton
            variant="stop"
            size="lg"
            onClick={handleStopCamera}
            disabled={!isCameraActive}
            className="flex-1 min-w-[200px] h-16 text-lg tracking-widest font-black italic"
          >
            <X className="w-5 h-5 mr-1" />
            KILL SYSTEM
          </CockpitButton>
        </div>

        {/* Detection Output Section */}
        <div className="w-full max-w-4xl mt-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-1 bg-bmw-cyan" />
            <span className="font-rajdhani text-xs text-bmw-cyan uppercase tracking-[0.3em] font-black italic">
              Sector Identification Log
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {detections.length > 0 ? detections.map((det, idx) => (
              <div key={idx} className="glass-panel p-5 border-l-4 border-l-bmw-cyan bg-zinc-900/40 hover:bg-zinc-900/60 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[8px] text-bmw-cyan font-black uppercase tracking-widest mb-1">Entity_{idx + 1}</p>
                    <p className="text-xl font-black italic text-white uppercase leading-tight">{det.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black italic text-destructive leading-none">{Math.round(det.confidence * 100)}%</p>
                    <p className="text-[8px] text-zinc-500 font-bold uppercase mt-1">Probability</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-2 bg-zinc-950/30">
                <div className="w-1 h-1 bg-zinc-700 rounded-full animate-ping" />
                <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em] italic leading-tight">
                  Scanning for signatures...
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
