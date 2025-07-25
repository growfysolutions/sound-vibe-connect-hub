
import { useState, useRef, useCallback, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';

interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCallActive: boolean;
  isConnecting: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  error: string | null;
}

interface PeerConnectionConfig {
  iceServers: RTCIceServer[];
}

export const useWebRTC = (projectId: string) => {
  const { profile } = useProfile();
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    isCallActive: false,
    isConnecting: false,
    isAudioEnabled: true,
    isVideoEnabled: true,
    error: null
  });

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const pcConfig: PeerConnectionConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  const initializePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return;

    const pc = new RTCPeerConnection(pcConfig);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
        // In a real app, send this to the other peer via signaling server
      }
    };

    pc.ontrack = (event) => {
      console.log('Remote track received:', event.streams[0]);
      setState(prev => ({
        ...prev,
        remoteStream: event.streams[0]
      }));
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setState(prev => ({ ...prev, isCallActive: true, isConnecting: false }));
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setState(prev => ({ ...prev, isCallActive: false, isConnecting: false }));
      }
    };

    peerConnectionRef.current = pc;
  }, []);

  const startCall = useCallback(async (audioOnly = false) => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: !audioOnly
      });

      setState(prev => ({
        ...prev,
        localStream: stream,
        isVideoEnabled: !audioOnly
      }));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      initializePeerConnection();
      
      if (peerConnectionRef.current) {
        stream.getTracks().forEach(track => {
          peerConnectionRef.current?.addTrack(track, stream);
        });
      }

      console.log('Call started with stream:', stream);
    } catch (error) {
      console.error('Error starting call:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start call',
        isConnecting: false
      }));
    }
  }, [initializePeerConnection]);

  const endCall = useCallback(() => {
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setState({
      localStream: null,
      remoteStream: null,
      isCallActive: false,
      isConnecting: false,
      isAudioEnabled: true,
      isVideoEnabled: true,
      error: null
    });
  }, [state.localStream]);

  const toggleAudio = useCallback(() => {
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !state.isAudioEnabled;
        setState(prev => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }));
      }
    }
  }, [state.localStream, state.isAudioEnabled]);

  const toggleVideo = useCallback(() => {
    if (state.localStream) {
      const videoTrack = state.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !state.isVideoEnabled;
        setState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
      }
    }
  }, [state.localStream, state.isVideoEnabled]);

  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    ...state,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    localVideoRef,
    remoteVideoRef
  };
};
