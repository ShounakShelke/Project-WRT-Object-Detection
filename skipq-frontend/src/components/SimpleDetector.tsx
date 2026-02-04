import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Camera, RefreshCw, Crosshair } from 'lucide-react';

interface Detection {
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2]
}

export default function SimpleDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

  // Start Camera
  const startCamera = async () => {
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
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Could not access camera. Please ensure camera permissions are granted.");
    }
  };

  // Update video size when video loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoSize({
        width: video.videoWidth,
        height: video.videoHeight
      });
      
      // Set overlay canvas to match video dimensions
      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = video.videoWidth;
        overlayCanvasRef.current.height = video.videoHeight;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [isCameraOpen]);

  // Draw bounding boxes on overlay canvas
  const drawDetections = (detections: Detection[]) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each detection
    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.box;
      const width = x2 - x1;
      const height = y2 - y1;

      // Draw bounding box
      ctx.strokeStyle = '#22c55e'; // Green
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);

      // Draw filled background for label
      ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
      const labelText = `${det.label} ${Math.round(det.confidence * 100)}%`;
      ctx.font = 'bold 16px monospace';
      const textMetrics = ctx.measureText(labelText);
      const textHeight = 20;
      
      ctx.fillRect(x1, y1 - textHeight - 4, textMetrics.width + 12, textHeight + 4);

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, x1 + 6, y1 - 8);

      // Draw corner markers
      const cornerSize = 15;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      
      // Top-left
      ctx.beginPath();
      ctx.moveTo(x1, y1 + cornerSize);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1 + cornerSize, y1);
      ctx.stroke();
      
      // Top-right
      ctx.beginPath();
      ctx.moveTo(x2 - cornerSize, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y1 + cornerSize);
      ctx.stroke();
      
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(x1, y2 - cornerSize);
      ctx.lineTo(x1, y2);
      ctx.lineTo(x1 + cornerSize, y2);
      ctx.stroke();
      
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(x2 - cornerSize, y2);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, y2 - cornerSize);
      ctx.stroke();
    });
  };

  // Capture & Detect Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCameraOpen && videoSize.width > 0) {
      interval = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Draw current video frame
        ctx.drawImage(video, 0, 0);

        // Convert to Blob and send to API
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          setIsDetecting(true);
          const formData = new FormData();
          formData.append('image', blob);

          try {
            const res = await axios.post('http://localhost:5000/detect', formData);
            const detectedObjects = res.data as Detection[];
            setDetections(detectedObjects);
            
            // Draw bounding boxes on overlay
            drawDetections(detectedObjects);
          } catch (e) {
            console.error("Detection failed:", e);
          } finally {
            setIsDetecting(false);
          }
        }, 'image/jpeg', 0.9);

      }, 500); // Run every 500ms for smoother detection
    }

    return () => clearInterval(interval);
  }, [isCameraOpen, videoSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black tracking-tighter mb-2">
          <span className="text-blue-400">Project WRT</span>
          <span className="text-white ml-2">Object Detection</span>
        </h1>
        <p className="text-slate-400 text-sm">Real-time detection powered by YOLOv8</p>
      </div>
      
      {!isCameraOpen ? (
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={startCamera}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-5 px-10 rounded-2xl shadow-2xl flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95"
          >
            <Camera className="w-7 h-7" />
            Open Camera
          </button>
          <p className="text-slate-500 text-xs max-w-md text-center">
            Click to start real-time object detection. Camera access permission required.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-5xl">
          {/* Camera Display with Overlay */}
          <div 
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800"
          >
            {/* Video Stream */}
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted 
              className="w-full h-full object-contain"
            />
            
            {/* Overlay Canvas for Bounding Boxes */}
            <canvas 
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
            />
            
            {/* Hidden Canvas for Capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* HUD - Detection List */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 max-w-xs">
              {detections.length > 0 && (
                <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Crosshair className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-bold text-green-400">DETECTED OBJECTS</span>
                  </div>
                  {detections.map((det, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-lg bg-green-500/10 border border-green-500/20 mb-1"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-white font-mono text-sm font-bold">
                          {det.label.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-green-400 text-xs font-bold">
                        {Math.round(det.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {detections.length === 0 && !isDetecting && (
                <div className="bg-black/70 backdrop-blur-md text-slate-400 px-4 py-2 rounded-lg border border-slate-700 text-sm">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4" />
                    <span>Scanning for objects...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Live Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/50 backdrop-blur-md">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-red-200 tracking-wider">LIVE</span>
            </div>

            {/* Detection Counter */}
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2">
                <div className="text-blue-400 text-2xl font-black">{detections.length}</div>
                <div className="text-xs text-slate-400">
                  {detections.length === 1 ? 'Object' : 'Objects'}
                </div>
              </div>
            </div>

            {/* Processing Indicator */}
            {isDetecting && (
              <div className="absolute bottom-4 left-4 bg-blue-500/20 backdrop-blur-md px-4 py-2 rounded-lg border border-blue-500/50">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-xs font-bold text-blue-200">Processing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Detection Info Panel */}
          {detections.length > 0 && (
            <div className="mt-4 bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 mb-3">DETECTION DETAILS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {detections.map((det, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-green-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">{det.label}</span>
                      <span className="text-green-400 text-xs font-mono">
                        {Math.round(det.confidence * 100)}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Box: [{det.box.map(v => Math.round(v)).join(', ')}]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
