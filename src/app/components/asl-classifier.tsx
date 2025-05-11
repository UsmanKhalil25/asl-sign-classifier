"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, CameraOff, HandMetal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Simulated ASL signs for demonstration
const ASL_SIGNS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "Hello",
  "Thank you",
  "Please",
  "Sorry",
  "Yes",
  "No",
];

export default function ASLClassifier() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<string[]>([]);

  // Start webcam stream
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError(
        "Unable to access camera. Please ensure you've granted camera permissions."
      );
      console.error("Error accessing webcam:", err);
    }
  };

  // Stop webcam stream
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  // Toggle webcam
  const toggleWebcam = () => {
    if (isStreaming) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  // Simulate ASL classification
  // In a real app, this would be replaced with actual ML model inference
  useEffect(() => {
    if (!isStreaming) return;

    const classifyInterval = setInterval(() => {
      // Simulate processing delay
      const randomSign =
        ASL_SIGNS[Math.floor(Math.random() * ASL_SIGNS.length)];
      const randomConfidence = Math.random() * 0.3 + 0.7; // Random confidence between 70-100%

      setPrediction(randomSign);
      setConfidence(randomConfidence);

      // Add to recent predictions (keep last 5)
      setRecentPredictions((prev) => {
        const updated = [randomSign, ...prev];
        return updated.slice(0, 5);
      });
    }, 2000);

    return () => clearInterval(classifyInterval);
  }, [isStreaming]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Camera Feed</span>
            <Button
              variant={isStreaming ? "destructive" : "default"}
              size="sm"
              onClick={toggleWebcam}
            >
              {isStreaming ? (
                <>
                  <CameraOff className="mr-2 h-4 w-4" /> Stop Camera
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" /> Start Camera
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Position your hand clearly in the frame to detect ASL signs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 aspect-video bg-muted/50 relative flex items-center justify-center">
          {error && (
            <Alert
              variant="destructive"
              className="absolute top-4 left-4 right-4 z-10"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isStreaming && !error && (
            <div className="text-center text-muted-foreground">
              <Camera className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Click "Start Camera" to begin</p>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${
              !isStreaming ? "hidden" : ""
            }`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HandMetal className="mr-2 h-5 w-5" />
            ASL Sign Prediction
          </CardTitle>
          <CardDescription>
            Real-time classification of detected hand signs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isStreaming ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Start the camera to begin detecting signs</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-6 border rounded-lg bg-muted/30">
                <h3 className="text-sm font-medium mb-2">Current Prediction</h3>
                <div className="text-5xl font-bold mb-2">
                  {prediction || "..."}
                </div>
                {prediction && (
                  <div className="text-sm text-muted-foreground">
                    Confidence: {Math.round(confidence * 100)}%
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Recent Detections</h3>
                <div className="flex flex-wrap gap-2">
                  {recentPredictions.length > 0 ? (
                    recentPredictions.map((sign, index) => (
                      <Badge key={index} variant="secondary">
                        {sign}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent detections
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
