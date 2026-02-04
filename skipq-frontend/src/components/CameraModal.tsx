import { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: string) => void;
  title?: string;
  mode?: 'scan' | 'verify';
}

export function CameraModal({ 
  isOpen, 
  onClose, 
  onCapture, 
  title = "Camera Scanner",
  mode = 'scan'
}: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsReady(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please ensure you have given permission.");
      toast.error("Camera access failed");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsReady(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        onCapture(imageData);
        toast.success(mode === 'scan' ? "Product Scanned!" : "Verification captured!");
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-none shadow-2xl overflow-hidden p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {error ? (
            <div className="text-center p-6 space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={startCamera} variant="outline" size="sm">
                Try Again
                <RefreshCw className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Overlay for Scanning */}
              {mode === 'scan' && isReady && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-primary/50 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary/40 animate-scan" />
                  </div>
                </div>
              )}

              {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                </div>
              )}
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <DialogFooter className="p-4 bg-muted/30">
          <div className="flex w-full items-center justify-between gap-4">
            <Button variant="ghost" onClick={onClose} className="rounded-full">
              Cancel
            </Button>
            <Button 
              onClick={handleCapture} 
              disabled={!isReady}
              variant="gradient"
              className="rounded-full px-8 shadow-lg shadow-primary/20"
            >
              {mode === 'scan' ? 'Scan Now' : 'Capture & Verify'}
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
