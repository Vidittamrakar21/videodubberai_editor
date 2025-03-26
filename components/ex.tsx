"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

const VideoEditor = () => {
  // State for media file
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  
  // State for positioning and sizing
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 400, height: 300 });
  
  // State for resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  
  // State for timing
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [medialoaded, setmedialoaded] = useState(false);
  const [videoplay, setvideoplay] = useState(false);

  // Refs
  const mediaRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null)

  // Handle file upload
  //@ts-ignore
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.startsWith('video/') ? 'video' : 
                       file.type.startsWith('image/') ? 'image' : null;
      
      if (fileType) {
        //@ts-ignore
        setMediaFile(URL.createObjectURL(file));
        //@ts-ignore
        setMediaType(fileType);
        setmedialoaded(true)
      }
    }
  };

  // Handle media playback
  const handlePlay = () => {
    if (mediaRef.current) {
      setIsPlaying(true);
      setCurrentTime(0);
      if(mediaType === "video"){
        //@ts-ignore
        mediaRef.current.play()
      }
      //@ts-ignore
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= endTime - startTime) {
            //@ts-ignore
            clearInterval(timerRef.current);
            setIsPlaying(false);
            setmedialoaded(false);
            if(mediaType === "video"){
              //@ts-ignore
              mediaRef.current.pause()
            }
            return 0;
          }
          
          return prev + 1;

        });
      }, 1000);
    }
  };

  // Stop playback
  const handleStop = () => {
    if (timerRef.current) {
      
      clearInterval(timerRef.current);
    }
    if(mediaRef.current){

      if(mediaType === "video"){
        //@ts-ignore
        mediaRef.current.pause()
      }
    }
    setIsPlaying(false);
   
    setCurrentTime(0);
  };

  // Drag functionality
  //@ts-ignore
  const handleMouseDown = (e) => {
    // Prevent drag if clicking on resize handle
    if (e.target.classList.contains('resize-handle')) return;

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    //@ts-ignore
    const handleMouseMove = (moveEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Resize functionality
  //@ts-ignore
  const startResize = (direction, e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startLeft = position.x;
    const startTop = position.y;

    //@ts-ignore
    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      // Handle different resize directions
      switch (direction) {
        case 'top-left':
          newWidth = startWidth - dx;
          newHeight = startHeight - dy;
          newLeft = startLeft + dx;
          newTop = startTop + dy;
          break;
        case 'top-right':
          newWidth = startWidth + dx;
          newHeight = startHeight - dy;
          newTop = startTop + dy;
          break;
        case 'bottom-left':
          newWidth = startWidth - dx;
          newHeight = startHeight + dy;
          newLeft = startLeft + dx;
          break;
        case 'bottom-right':
          newWidth = startWidth + dx;
          newHeight = startHeight + dy;
          break;
      }

      // Prevent negative dimensions
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newLeft, y: newTop });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setIsResizing(false);
      setResizeDirection(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="w-1/4 p-4 space-y-4">
        {/* File Upload */}
        <div>
          <Label>Upload Media</Label>
          <div className="flex items-center">
            <input 
              type="file" 
              ref={fileInputRef}
              accept="video/*,image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              //@ts-ignore
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2"
            >
              <Upload size={16} /> Select File
            </Button>
          </div>
        </div>

        {/* Size Inputs */}
        <div className="space-y-2">
          <Label>Width</Label>
          <Input
            type="number"
            value={size.width}
            onChange={(e) => setSize(prev => ({ 
              ...prev, 
              width: parseInt(e.target.value) || 400 
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Height</Label>
          <Input
            type="number"
            value={size.height}
            onChange={(e) => setSize(prev => ({ 
              ...prev, 
              height: parseInt(e.target.value) || 300 
            }))}
          />
        </div>

        {/* Time Inputs */}
        <div className="space-y-2">
          <Label>Start Time (seconds)</Label>
          <Input
            type="number"
            value={startTime}
            onChange={(e) => setStartTime(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label>End Time (seconds)</Label>
          <Input
            type="number"
            value={endTime}
            onChange={(e) => setEndTime(parseInt(e.target.value) || 10)}
          />
        </div>

        {/* Playback Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={handlePlay} 
            disabled={!mediaFile || isPlaying}
          >
            Play
          </Button>
          <Button 
            onClick={handleStop} 
            disabled={!isPlaying}
            variant="destructive"
          >
            Stop
          </Button>
        </div>

        {/* Timer Display */}
        {isPlaying && (
          <Card>
            <CardHeader>
              <CardTitle>Current Time</CardTitle>
            </CardHeader>
            <CardContent>
              {currentTime} seconds
            </CardContent>
          </Card>
        )}
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="w-3/4 h-[600px] bg-[black] relative border-2 border-gray-200"
      >
        {mediaFile && (
          <div
            className="absolute"
            style={{
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
              position: 'absolute',
            }}
          >
            {/* Draggable Media Container */}
            <div 
              onMouseDown={handleMouseDown}
              className="w-full h-full relative cursor-move"
              style={{ 
                display: ((isPlaying && currentTime >= startTime && currentTime <= endTime)|| medialoaded === true) ? 'block' : 'none'
              }}
          
            >
              {mediaType === 'video' ? (
                <video
                  ref={mediaRef}
                  src={mediaFile}
                  className="w-full h-full"
                  
                  
                  style={{ 
                    display:  ((isPlaying && currentTime >= startTime && currentTime <= endTime)|| medialoaded === true) ? 'block' : 'none'
                  }}
                />
              ) : (
                <img
                  ref={mediaRef}
                  src={mediaFile}
                  className="w-full h-full select-none"
                  style={{ 
                    display: ((isPlaying && currentTime >= startTime && currentTime <= endTime)|| medialoaded === true) ? 'block' : 'none'
                  }}
                />
              )}

              {/* Resize Handles */}
              {[
                'top-left', 'top-right', 
                'bottom-left', 'bottom-right'
              ].map((direction) => (
                <div
                  key={direction}
                  className={`resize-handle absolute w-4 h-4 bg-blue-500 border border-white ${
                    {
                      'top-left': 'top-0 left-0 cursor-nwse-resize',
                      'top-right': 'top-0 right-0 cursor-nesw-resize',
                      'bottom-left': 'bottom-0 left-0 cursor-nesw-resize',
                      'bottom-right': 'bottom-0 right-0 cursor-nwse-resize'
                    }[direction]
                  }`}
                  onMouseDown={(e) => startResize(direction, e)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoEditor;