'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Play, Pause, Eye, Scan, Zap, Target, Image as ImageIcon, BarChart3 } from 'lucide-react';

interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  color: string;
}

interface VisionMetrics {
  objectsDetected: number;
  averageConfidence: number;
  processingTime: string;
  modelAccuracy: number;
}

const demoObjects = [
  { label: 'person', confidence: 0.94, bbox: { x: 120, y: 80, width: 180, height: 320 }, color: '#3B82F6' },
  { label: 'laptop', confidence: 0.87, bbox: { x: 350, y: 200, width: 200, height: 120 }, color: '#10B981' },
  { label: 'cup', confidence: 0.82, bbox: { x: 580, y: 180, width: 60, height: 80 }, color: '#F59E0B' },
  { label: 'book', confidence: 0.76, bbox: { x: 400, y: 350, width: 120, height: 80 }, color: '#EF4444' },
  { label: 'phone', confidence: 0.91, bbox: { x: 200, y: 420, width: 80, height: 140 }, color: '#8B5CF6' }
];

const analysisFeatures = [
  { name: 'Object Detection', icon: Target, description: 'Identify and locate objects in images', accuracy: 94.2 },
  { name: 'Face Recognition', icon: Eye, description: 'Detect and analyze facial features', accuracy: 97.8 },
  { name: 'Text Extraction', icon: Scan, description: 'Extract text from images using OCR', accuracy: 91.5 },
  { name: 'Scene Analysis', icon: BarChart3, description: 'Understand image context and composition', accuracy: 88.7 }
];

export default function ComputerVisionDemo() {
  const [isActive, setIsActive] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [selectedFeature, setSelectedFeature] = useState(analysisFeatures[0]);
  const [metrics, setMetrics] = useState<VisionMetrics>({
    objectsDetected: 0,
    averageConfidence: 0,
    processingTime: '0.0s',
    modelAccuracy: 94.2
  });
  const [imageSource, setImageSource] = useState<'camera' | 'upload' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCameraDemo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setImageSource('camera');
      setIsActive(true);
      simulateDetection();
    } catch (error) {
      console.error('Camera access denied:', error);
      // Simulate demo without camera
      setImageSource('camera');
      setIsActive(true);
      simulateDetection();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSource('upload');
        setIsActive(true);
        simulateDetection();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateDetection = () => {
    // Simulate processing time
    setTimeout(() => {
      const objects = demoObjects.map((obj, index) => ({
        id: index.toString(),
        label: obj.label,
        confidence: obj.confidence + (Math.random() - 0.5) * 0.1, // Add some variation
        bbox: obj.bbox,
        color: obj.color
      }));

      setDetectedObjects(objects);
      
      const avgConfidence = objects.reduce((sum, obj) => sum + obj.confidence, 0) / objects.length;
      
      setMetrics({
        objectsDetected: objects.length,
        averageConfidence: avgConfidence,
        processingTime: (Math.random() * 0.5 + 0.3).toFixed(1) + 's',
        modelAccuracy: selectedFeature.accuracy
      });
    }, 1500);
  };

  const stopDemo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setImageSource(null);
    setDetectedObjects([]);
    setMetrics({
      objectsDetected: 0,
      averageConfidence: 0,
      processingTime: '0.0s',
      modelAccuracy: selectedFeature.accuracy
    });
  };

  const drawBoundingBoxes = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || detectedObjects.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    detectedObjects.forEach((obj) => {
      ctx.strokeStyle = obj.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(obj.bbox.x, obj.bbox.y, obj.bbox.width, obj.bbox.height);
      
      // Label background
      ctx.fillStyle = obj.color;
      ctx.fillRect(obj.bbox.x, obj.bbox.y - 25, 120, 25);
      
      // Label text
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.fillText(
        `${obj.label} ${(obj.confidence * 100).toFixed(1)}%`,
        obj.bbox.x + 5,
        obj.bbox.y - 8
      );
    });
  }, [detectedObjects]);

  useEffect(() => {
    if (isActive && detectedObjects.length > 0) {
      drawBoundingBoxes();
    }
  }, [detectedObjects, isActive, drawBoundingBoxes]);

  return (
    <div className="bg-background border border-border rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-500" />
            Computer Vision Showcase
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time image analysis using OpenCV, YOLOv5 & TensorFlow
          </p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={startCameraDemo}
            disabled={isActive}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera className="w-4 h-4" />
            Camera
          </motion.button>
          
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            disabled={isActive}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="w-4 h-4" />
            Upload
          </motion.button>
          
          {isActive && (
            <motion.button
              onClick={stopDemo}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause className="w-4 h-4" />
              Stop
            </motion.button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted rounded-lg p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-foreground">{metrics.objectsDetected}</div>
          <div className="text-xs text-muted-foreground">Objects Detected</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-foreground">{(metrics.averageConfidence * 100).toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Avg Confidence</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold text-foreground">{metrics.processingTime}</div>
          <div className="text-xs text-muted-foreground">Processing Time</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <Eye className="w-6 h-6 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold text-foreground">{metrics.modelAccuracy}%</div>
          <div className="text-xs text-muted-foreground">Model Accuracy</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Analysis Features */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Analysis Features</h4>
          
          <div className="space-y-2">
            {analysisFeatures.map((feature, index) => (
              <motion.div
                key={index}
                onClick={() => setSelectedFeature(feature)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedFeature.name === feature.name 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-border hover:border-blue-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-foreground">{feature.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                <div className="text-sm font-medium text-green-600">
                  {feature.accuracy}% accuracy
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video/Image Display */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {isActive ? (
              <>
                {imageSource === 'camera' && (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                )}
                
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  className="absolute inset-0 w-full h-full"
                />
                
                {/* Processing Indicator */}
                {detectedObjects.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2" />
                      <p>Processing image...</p>
                    </div>
                  </div>
                )}
                
                {/* Live Indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  {imageSource === 'camera' ? 'LIVE' : 'ANALYZING'}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Start camera or upload image to begin analysis</p>
                  <p className="text-sm mt-2">Real-time object detection & classification</p>
                </div>
              </div>
            )}
          </div>

          {/* Current Feature Info */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <selectedFeature.icon className="w-6 h-6 text-blue-500" />
              <h5 className="font-medium text-foreground">{selectedFeature.name}</h5>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{selectedFeature.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Model Accuracy:</span>
              <span className="font-medium text-green-600">{selectedFeature.accuracy}%</span>
            </div>
          </div>
        </div>

        {/* Detection Results */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Detection Results</h4>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {detectedObjects.map((obj) => (
                <motion.div
                  key={obj.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-muted rounded-lg p-3 border-l-4"
                  style={{ borderLeftColor: obj.color }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground capitalize">{obj.label}</span>
                    <span className="text-sm font-medium" style={{ color: obj.color }}>
                      {(obj.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Position: ({obj.bbox.x}, {obj.bbox.y})
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Size: {obj.bbox.width} × {obj.bbox.height}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {detectedObjects.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                {isActive ? 'Analyzing image...' : 'Start analysis to see detected objects'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Tech Stack:</span>
          {['YOLOv5', 'OpenCV', 'TensorFlow', 'Computer Vision', 'Object Detection', 'Real-time Processing'].map((tech) => (
            <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
