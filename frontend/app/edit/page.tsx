import React from 'react'
import Document from "./document"
import { useWebRTC, RealtimeVideo } from "@outspeed/react";

export default function page() {
  const { 
    connect,
    connectionStatus,
    getRemoteVideoTrack,
    getLocalVideoTrack
    } = useWebRTC({
      config: {
        // Add your function URL.
        functionURL: "<my-function-url>", 
        audio: true,
        video: false,
      },
    });
  
  return (
    <div> 
      <span>Connection Status (for testing): {connectionStatus}</span>
      <Document/> 
    </div>
  )
}
