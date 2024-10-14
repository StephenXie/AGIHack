import React from "react";
import { useWebRTC, useRealtimeToast } from "@outspeed/react";
import { Loader2 } from "lucide-react";
import { Button } from "../components/button";
import { MeetingLayout } from "../components/meeting-layout";
import { TRealtimeAppContext } from "./types";
import { useOutletContext } from "react-router-dom";
import { ConsoleLogger, DataChannel, isMessageEvent } from "@outspeed/core";
import Document from "./document.tsx";

export function WebRTCRealtimeApp() {
  const { config, onDisconnect } = useOutletContext<TRealtimeAppContext>();
  const { toast } = useRealtimeToast();

  const {
    connectionStatus,
    response,
    connect,
    disconnect,
    getRemoteAudioTrack,
    getLocalAudioTrack,
    getRemoteVideoTrack,
    getLocalVideoTrack,
    dataChannel,
  } = useWebRTC({ config: { ...config, logger: ConsoleLogger.getLogger() } });

  React.useEffect(() => {
    switch (connectionStatus) {
      case "SetupCompleted":
        connect();
        break;
      case "Disconnected":
        onDisconnect();
        break;
    }

    if (connectionStatus === "Failed") {
      toast({
        title: "Connection Status",
        description: "Failed to connect.",
        variant: "destructive",
      });
    }

  }, [connectionStatus, connect, onDisconnect, config]);

  React.useEffect(() => {
    const onMessage = (evt: unknown) => {
      if (!isMessageEvent(evt)) {
        return;
      }

      if (typeof evt.data !== "string") {
        return;
      }

      try {
        const message = JSON.parse(evt.data);

        // if (message.render) {
        //   toast({
        //     title: "New Message",
        //     description: (
        //       <div dangerouslySetInnerHTML={{ __html: message.render }} />
        //     ),
        //   });
        // }

        console.log(message);
        // window.alert(message.content || message.text);

      } catch (error) {
        console.error(error);
      }
    };

    if (dataChannel != null) {
      dataChannel.addEventListener("message", onMessage);
    }
    return () => {
      if (dataChannel != null) {      
        dataChannel.removeEventListener("message", onMessage);
      }
    };
  }, [dataChannel, toast]);

  function handleDisconnect() {
    if (connectionStatus === "Connected") {
      disconnect();
    }

    onDisconnect();
  }

  if (connectionStatus === "Connecting") {
    return (
      <div className="h-full flex flex-1 justify-center items-center">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );
  }

  if (connectionStatus === "Failed") {
    return (
      <div className="h-full flex flex-1 justify-center items-center">
        <div className="flex items-center space-y-4 flex-col">
          <h2 className="text-3xl font-light">
            Failed to connect.{" "}
            {(response?.data as any)?.detail || "Please try again."}
          </h2>
          <details className="max-w-lg overflow-auto">
            <summary>See Response</summary>
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="language-js text-sm">
                {JSON.stringify(response, undefined, 2)}
              </code>
            </pre>
          </details>
          <Button
            className="inline-flex max-w-24"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <Document/>
      <div className="h-full flex flex-1 w-2/5 ml-12">
        <div className="flex-1 flex">
          <MeetingLayout
            title="Realtime Editor"
            onCallEndClick={handleDisconnect}
            localTrack={getLocalVideoTrack()}
            remoteTrack={getRemoteVideoTrack()}
            localAudioTrack={getLocalAudioTrack()}
            remoteAudioTrack={getRemoteAudioTrack()}
            dataChannel={dataChannel}
          />
        </div>
      </div>
    </div>
  );
}
