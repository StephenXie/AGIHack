import React from 'react'
import Document from "./document"
// import { useWebRTC } from "../../node_modules/@outspeed/react";

export default function page() {
  // const { 
  //   connect,
  //   connectionStatus,
  //   getRemoteVideoTrack,
  //   getLocalVideoTrack
  //   } = useWebRTC({
  //     config: {
  //       // Add your function URL.
  //       functionURL: "<my-function-url>", 
  //       audio: true,
  //       video: true,
  //     },
  //   });
  
  return (
    <div> 
      {/* <span>Connection Status (for testing): {connectionStatus}</span> */}
      <Document/> 
    </div>
  )
}
