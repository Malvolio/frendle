import { useEffect, useRef, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { WebRTCConnection } from '@/lib/webrtc';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function SessionPage() {
  const { id: sessionId, host: isHost } = useSearch({ from: '/session' });
  
  const [isConnecting, setIsConnecting] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<WebRTCConnection | null>(null);

  useEffect(() => {
    if (!sessionId) {
      toast({
        title: 'Error',
        description: 'Session ID is required',
        variant: 'destructive',
      });
      return;
    }

    const initializeConnection = async () => {
      try {
        const connection = new WebRTCConnection(
          sessionId,
          (stream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
          },
          setConnectionState
        );

        const localStream = await connection.initializeLocalStream();
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        if (isHost) {
          connection.subscribeToSessionChanges(undefined, async (answer) => {
            await connection.handleAnswer(answer);
            setIsConnecting(false);
          });
          await connection.createOffer();
        } else {
          connection.subscribeToSessionChanges(async (offer) => {
            await connection.createAnswer(offer);
            setIsConnecting(false);
          });
        }

        connectionRef.current = connection;
      } catch (error) {
        console.error('Error initializing connection:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize video chat. Please check your camera and microphone permissions.',
          variant: 'destructive',
        });
      }
    };

    initializeConnection();

    return () => {
      connectionRef.current?.cleanup();
    };
  }, [sessionId, isHost]);

  const handleToggleAudio = () => {
    if (connectionRef.current) {
      connectionRef.current.toggleAudio(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const handleToggleVideo = () => {
    if (connectionRef.current) {
      connectionRef.current.toggleVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleHangup = () => {
    connectionRef.current?.cleanup();
    window.close();
  };

  return (
    <AuthLayout title="Video Chat">
      <div className="max-w-4xl mx-auto space-y-6">
        {isConnecting && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3">
                  {isHost ? 'Waiting for participant to join...' : 'Joining session...'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0 aspect-video relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span className="bg-black/50 text-white px-2 py-1 rounded text-sm">
                  You
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0 aspect-video relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span className="bg-black/50 text-white px-2 py-1 rounded text-sm">
                  Participant
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center gap-4">
              <Button
                variant={isAudioEnabled ? 'outline' : 'destructive'}
                size="icon"
                onClick={handleToggleAudio}
              >
                {isAudioEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant={isVideoEnabled ? 'outline' : 'destructive'}
                size="icon"
                onClick={handleToggleVideo}
              >
                {isVideoEnabled ? (
                  <VideoIcon className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="destructive"
                size="icon"
                onClick={handleHangup}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {connectionState !== 'connected' && !isConnecting && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Connection status: {connectionState}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthLayout>
  );
}