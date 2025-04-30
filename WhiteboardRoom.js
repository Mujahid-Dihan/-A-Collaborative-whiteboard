import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../services/socket';
import Whiteboard from '../components/Whiteboard';
import ChatBox from '../components/ChatBox';

const WhiteboardRoom = () => {
  const { meetingId } = useParams();
  const [screenStream, setScreenStream] = useState(null);

  useEffect(() => {
    socket.connect();
    socket.emit('join-meeting', { meetingId });

    // Listen for screen share events
    socket.on('screen-share-start', (streamId) => {
      // Handle streamId to start displaying the shared screen
      console.log('Screen Share Started');
      // Display the screen for other participants
    });

    socket.on('screen-share-stop', () => {
      setScreenStream(null); // Stop screen sharing
    });

    return () => {
      socket.disconnect();
    };
  }, [meetingId]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 2 }}>
        <h2>Meeting ID: {meetingId}</h2>
        <Whiteboard />
      </div>
      <div style={{ flex: 1, marginLeft: '20px' }}>
        <ChatBox />
        {screenStream && (
          <div>
            <h3>Shared Screen</h3>
            <video srcObject={screenStream} autoPlay muted />
          </div>
        )}
      </div>
    </div>
  );
};

export default WhiteboardRoom;
