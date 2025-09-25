'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Play, Pause, AlertTriangle, CheckCircle, Eye, Users, Clock, Shield } from 'lucide-react';

interface DetectionResult {
  id: string;
  type: 'suspicious_movement' | 'multiple_faces' | 'phone_detected' | 'looking_away' | 'normal';
  confidence: number;
  timestamp: Date;
  description: string;
}

interface ExamMetrics {
  totalStudents: number;
  activeMonitoring: number;
  suspiciousActivities: number;
  examDuration: string;
  detectionAccuracy: number;
}

export default function SmaTestDemo() {
  const [isActive, setIsActive] = useState(false);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [metrics, setMetrics] = useState<ExamMetrics>({
    totalStudents: 24,
    activeMonitoring: 24,
    suspiciousActivities: 3,
    examDuration: '01:23:45',
    detectionAccuracy: 94.7
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate real-time detections
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const detectionTypes = [
        { type: 'normal' as const, desc: 'Student focused on exam', confidence: 0.95 },
        { type: 'suspicious_movement' as const, desc: 'Unusual head movement detected', confidence: 0.78 },
        { type: 'looking_away' as const, desc: 'Student looking away from screen', confidence: 0.82 },
        { type: 'multiple_faces' as const, desc: 'Multiple faces detected', confidence: 0.91 },
        { type: 'phone_detected' as const, desc: 'Mobile device detected', confidence: 0.87 }
      ];

      const randomDetection = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];
      
      const newDetection: DetectionResult = {
        id: Date.now().toString(),
        type: randomDetection.type,
        confidence: randomDetection.confidence,
        timestamp: new Date(),
        description: randomDetection.desc
      };

      setDetections(prev => [newDetection, ...prev.slice(0, 9)]);

      // Update metrics
      if (randomDetection.type !== 'normal') {
        setMetrics(prev => ({
          ...prev,
          suspiciousActivities: prev.suspiciousActivities + 1
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const startDemo = async () => {
    try {
      // Check if we're in a secure context (HTTPS or localhost)
      const isSecureContext = typeof window !== 'undefined' &&
        (window.location.protocol === 'https:' || window.location.hostname === 'localhost');

      if (!isSecureContext) {
        console.warn('Camera requires HTTPS in production. Running in demo mode.');
        setIsActive(true);
        return;
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Camera API not available. Running in demo mode.');
        setIsActive(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsActive(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      // Gracefully fallback to demo mode
      setIsActive(true);
    }
  };

  const stopDemo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setDetections([]);
  };

  const getDetectionColor = (type: DetectionResult['type']) => {
    switch (type) {
      case 'normal': return 'text-green-500';
      case 'suspicious_movement': return 'text-yellow-500';
      case 'looking_away': return 'text-orange-500';
      case 'multiple_faces': return 'text-red-500';
      case 'phone_detected': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getDetectionIcon = (type: DetectionResult['type']) => {
    switch (type) {
      case 'normal': return <CheckCircle className="w-4 h-4" />;
      case 'suspicious_movement': return <Eye className="w-4 h-4" />;
      case 'looking_away': return <AlertTriangle className="w-4 h-4" />;
      case 'multiple_faces': return <Users className="w-4 h-4" />;
      case 'phone_detected': return <AlertTriangle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            SmaTest - AI Exam Monitoring
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time examination monitoring using Computer Vision & YOLOv5
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isActive ? (
            <motion.button
              onClick={startDemo}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4" />
              Start Monitoring
            </motion.button>
          ) : (
            <motion.button
              onClick={stopDemo}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause className="w-4 h-4" />
              Stop Monitoring
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {isActive ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />
                
                {/* Live Indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>

                {/* Detection Overlay */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg">
                  <div className="text-xs">Detection Active</div>
                  <div className="text-lg font-bold">{metrics.detectionAccuracy}%</div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Click "Start Monitoring" to begin demo</p>
                  <p className="text-sm mt-2">Camera access will be requested</p>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-foreground">{metrics.totalStudents}</div>
              <div className="text-xs text-muted-foreground">Total Students</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4 text-center">
              <Eye className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-foreground">{metrics.activeMonitoring}</div>
              <div className="text-xs text-muted-foreground">Active Monitoring</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4 text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold text-foreground">{metrics.suspiciousActivities}</div>
              <div className="text-xs text-muted-foreground">Alerts</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold text-foreground">{metrics.examDuration}</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>
        </div>

        {/* Detection Log */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Real-time Detections</h4>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {detections.map((detection) => (
                <motion.div
                  key={detection.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-muted rounded-lg p-3 border-l-4 border-l-blue-500"
                >
                  <div className="flex items-start gap-2">
                    <div className={getDetectionColor(detection.type)}>
                      {getDetectionIcon(detection.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {detection.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confidence: {(detection.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {detection.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {detections.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                {isActive ? 'Monitoring for suspicious activities...' : 'Start monitoring to see detections'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Tech Stack:</span>
          {['YOLOv5', 'OpenCV', 'TensorFlow', 'Computer Vision', 'Real-time Processing'].map((tech) => (
            <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
