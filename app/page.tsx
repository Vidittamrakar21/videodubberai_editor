"use client"

import React, { useState, useRef, useEffect } from 'react';
import {  Container} from '@mantine/core'
import { ActionIcon, Slider, Group, Text, rem, Button, Divider ,TextInput, useMantineTheme, Anchor} from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import {  IconZoomIn, IconZoomOut, IconScissors, IconDownload ,IconCloudCancel, IconX, IconCloudUpload} from "@tabler/icons-react";

import {  IconArrowBack, IconArrowForward, IconSearch, IconHelpCircle } from "@tabler/icons-react";
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import classes from './DropzoneButton.module.css';

const VideoEditor = () => {
  // State for media file
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  
  // State for positioning and sizing
  const [position, setPosition] = useState({ x: 406, y: 140 });
  const [size, setSize] = useState({ width: 360, height: 220 });
  
  // State for resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  
  // State for timing
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [medialoaded, setmedialoaded] = useState(false);
  const [onresize, setonresize] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(30);


  // Refs
  const mediaRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(()=>{
    console.log(isResizing)
    console.log(resizeDirection);
  })
  

  // Handle file upload
  //@ts-ignore
  const handleFileUpload = (file) => {
    
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
          
          return  prev + 0.1;

        });
      }, 100);
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


  const duration = (endTime - startTime).toString(); 

  

  const openRef = useRef<() => void>(null);
  const theme = useMantineTheme();

  return (
    
    <div className="flex bg-[#F7F7F8] h-[930px] select-none">

      <Group justify="space-between" p="lg" style={{  position:"absolute", top:0,right:0, width: "79%" }}>
      <Group gap="xs">
        <ActionIcon variant="subtle" size="lg">
          <IconCloudCancel size={18} color='#403F41'/>
        </ActionIcon>
        <ActionIcon variant="subtle" size="lg">
          <IconArrowBack size={18} color='#403F41'/>
        </ActionIcon>
        <ActionIcon variant="subtle" size="lg">
          <IconArrowForward size={18} color='#403F41'/>
        </ActionIcon>
      </Group>

      {/* Center Controls */}
      <Group gap="xs">
        <ActionIcon variant="subtle" size="lg">
          <IconSearch size={18} color='#403F41' />
        </ActionIcon>
        <ActionIcon variant="subtle" size="lg">
          <IconHelpCircle size={18}  color='#403F41'/>
        </ActionIcon>
        <Text size="sm" c={"#897E73"}>
          Save your project for later —{" "}
          <Anchor href="#" size="sm" underline="always">
            sign up
          </Anchor>{" "}
          or{" "}
          <Anchor href="#" size="sm" underline="always">
            log in
          </Anchor>
        </Text>
      </Group>

      {/* Right Buttons */}
      <Group gap="xs">
        <Button size="sm" color="orange" radius="md">
          ⚡ Upgrade
        </Button>
        <Button size="sm" color="blue" radius="md">
        ✓ Done
        </Button>
      </Group>
    </Group>


      {/* Left Sidebar */}

    <Container h={930} w={400} pos={'absolute'} top={0} left={0} bg={"#FFFFFF"} style={{borderLeft: '1px solid #E1E1E3',borderRight: '1px solid #E1E1E3', zIndex: 50}}>
        {/* File Upload */}
       
        <Text fw={600} mt={20} ml={10} size='22px'>Add Media</Text>

        <div className={classes.wrapper}>
        <Dropzone
        openRef={openRef}
        onDrop={(files) => handleFileUpload(files[0])}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.mp4, MIME_TYPES.gif, MIME_TYPES.jpeg,MIME_TYPES.png, MIME_TYPES.webp, MIME_TYPES.avif, MIME_TYPES.svg]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload size={50}  color={theme.colors.blue[6]} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload className='mt-5' size={30} stroke={1.5} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
        
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop files here to upload.
          </Text>
        </div>
      </Dropzone>

     
    </div>

        {/* Size Inputs */}
        <div className="space-y-2">
  
          <TextInput

          label='Width'
          placeholder='Enter Width'
          onChange={(e) => setSize(prev => ({ 
            ...prev, 
            
            width: parseInt(e.target.value) || 400 
          }))}
          value={size.width}
          />

        </div>

        <div className="space-y-2">

        <TextInput
          label='Height'
          placeholder='Enter Width'
          onChange={(e) => setSize(prev => ({ 
            ...prev, 
            
            width: parseInt(e.target.value) || 300 
          }))}
          value={size.height}
          mt={20}
          />
        </div>

      
      <Group
      px="md"
      py="xs"
      style={{
        border: "1px solid #dee2e6",
        borderRadius: rem(8),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "50px",
        userSelect: "none"
        
      }}
    >
      <Group gap={4}>
        <ActionIcon variant="subtle" color="gray">
        <IconClock size="1rem" color='#5C5E65' />
        </ActionIcon>
          <Text size='14px' c={'gray'}>Start</Text>
        <TextInput
          value={startTime}
          //@ts-ignore
          onChange={(e) => setStartTime(parseInt(e.target.value) || 0)}
          variant="unstyled"
          size="sm"
          w={50}
        />
      </Group>

      <Divider orientation="vertical" size="xs" />

      <Group gap={4}>
      <Text size='14px' c={'gray'}>End</Text>
        <TextInput
          value={endTime}

          //@ts-ignore
          onChange={(e) => setEndTime(parseInt(e.target.value) || 0)}
          variant="unstyled"
          size="sm"
          w={50}
        />
        <ActionIcon variant="subtle" color="gray">
          <IconClock size="1rem" color='#5C5E65'/>
        </ActionIcon>
      </Group>
    </Group>

    

     </Container>

     <div style={{ padding: rem(16), borderBottom: "1px solid #ddd" }} className='absolute bottom-0 left-[400px] w-[79%] h-[200px] bg-[white] z-50 select-none'>
      {/* Toolbar */}

      <Group justify="space-between">
        <Group gap="xs">
          <Button variant="subtle"  c={"#2D2C43"} leftSection={<IconScissors size="1rem"  color='#5C5C5D' />}>
            Split
          </Button>
          <Button variant="subtle" c={"#2D2C43"} leftSection={<IconDownload size="1rem" color='#5C5C5D'/>}>
            Download Section <span style={{color:'#5C5C5D', marginLeft:"10px"}}> (0:00 - {endTime})</span>
          </Button>
        </Group>

        {/* Play/Pause Button */}

        <Group gap="xs" mr={200}>

        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="black" className="bi bi-skip-backward-fill" viewBox="0 0 16 16">
       <path d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5"/>
        </svg>
          {isPlaying === false?
          <svg  onClick={(e)=>{e.stopPropagation(); handlePlay();}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" className="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
            </svg>:

            <svg onClick={(e)=>{e.stopPropagation(); handleStop();}} xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="black" className="bi bi-pause" viewBox="0 0 16 16">
            <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/>
            </svg>}

            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="black" className="bi bi-fast-forward-fill" viewBox="0 0 16 16">
             <path d="M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
          <path d="M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
          </svg>
          <Text size="sm" c={" #5C5C5D "} ml={10}>
            {currentTime.toFixed(1)} / {endTime.toFixed(1)}
          </Text>
        </Group>

        {/* Zoom Controls */}

        <Group gap="xs">
          <IconZoomOut size="1rem" color='#5C5C5D' />
          <Slider
            value={zoomLevel}
            onChange={setZoomLevel}
            min={10}
            max={300}
            styles={{ track: {
              height: rem(3),
              backgroundColor: "#A2B0FE",
              borderRadius: rem(2),
            },
            bar: {
              backgroundColor: "#e0e0e0", 
              height: rem(2)
            },
            thumb: {
              width: rem(10),
            
            
              height: rem(10), 
              backgroundColor: "#A2B0FE",
              border: "1px solid #A2B0FE",
              borderRadius: "50%", 
              boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
            },}}
          />
          <IconZoomIn size="1rem"  color='#5C5C5D'  />
          <Text size="sm" c={"#5C5C5D"}>Fit</Text>
        </Group>
      </Group>

      <Divider my="sm" />

      {/* Timeline */}

      <div style={{ position: "relative", height: rem(50), marginTop: rem(10) }}>

        {/* Seek Bar */}

        <Slider
          //@ts-ignore
          value={(currentTime / duration) * 100}
          //@ts-ignore
          onChange={(value) => setCurrentTime((value / 100) * duration)}
          styles={{
            track: {
              height: rem(3), 
              backgroundColor: "#e0e0e0",
              borderRadius: rem(2),
            },
            bar: {
              backgroundColor: "#e0e0e0", 
              height: rem(2), 
            },
            thumb: {
              width: rem(2),
              height: "80px", 
              backgroundColor: "#5666F5", 
              border: "1px solid #5666F5",
              marginTop: "40px",
              boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
            },
          }}
        />

        {/* Time Markers */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            marginTop: rem(5),
          }}
        >
          {Array.from({ length: (endTime-startTime )<=30?endTime-startTime: 30 }).map((_, i) => (
            <Text key={i} size="xs">
              {(endTime-startTime )<=30?i+'s': ''}
            </Text>
          ))}
        </div>
      </div>
    </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        onClick={()=>{setonresize(false)}}
        className="w-[60%] h-[600px] bg-[black] relative left-[30%] top-[100px] border-2 border-gray-200"
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
              onClick={(e)=>{setonresize(true); e.stopPropagation()}}
              className={onresize === false? "w-full h-full relative  hover:border hover:border-[#27A1B2]  ":" border-[#27A1B2] w-full h-full relative  border"}
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
                  className="w-full h-full  select-none"
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
                  className={onresize === true?`resize-handle absolute w-3 h-3  rounded-2xl bg-white  ${
                    {
                      'top-left': 'top-[-7px] left-[-7px] cursor-nwse-resize',
                      'top-right': 'top-[-7px] right-[-7px] cursor-nesw-resize',
                      'bottom-left': 'bottom-[-7px] left-[-7px] cursor-nesw-resize',
                      'bottom-right': 'bottom-[-7px] right-[-7px] cursor-nwse-resize'
                    }[direction]
                  }`:'none'}
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