import React, { useRef, useEffect, useState } from 'react';
import { socket } from '../services/socket';
import Toolbar from './Toolbar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [color, setColor] = useState('black');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 150;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctxRef.current = ctx;

    socket.on('draw-line', ({ x0, y0, x1, y1, color }) => {
      drawLine(x0, y0, x1, y1, color);
    });

    return () => {
      socket.off('draw-line');
    };
  }, [color]);

  const drawLine = (x0, y0, x1, y1, lineColor = color, emit = false) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = lineColor;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    if (!emit) return;
    socket.emit('draw-line', { x0, y0, x1, y1, color: lineColor });
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    drawLine(ctxRef.current.lastX || offsetX, ctxRef.current.lastY || offsetY, offsetX, offsetY, color, true);
    ctxRef.current.lastX = offsetX;
    ctxRef.current.lastY = offsetY;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    ctxRef.current.lastX = null;
    ctxRef.current.lastY = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    // Optionally: socket.emit('clear-canvas') if collaborative clearing is needed
  };

  const exportPDF = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 140);
      pdf.save('whiteboard.pdf');
    });
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(stream);
      setIsSharing(true);
      socket.emit('screen-share-start', stream.id); // Notify others that screen sharing has started
    } catch (err) {
      console.error('Error starting screen share', err);
    }
  };

  const stopScreenShare = () => {
    screenStream.getTracks().forEach((track) => track.stop());
    setScreenStream(null);
    setIsSharing(false);
    socket.emit('screen-share-stop'); // Notify others that screen sharing has stopped
  };

  return (
    <div>
      <Toolbar
        setColor={setColor}
        clearCanvas={clearCanvas}
        exportPDF={exportPDF}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
        isSharing={isSharing}
      />
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc', background: 'white' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {isSharing && screenStream && (
        <video
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          srcObject={screenStream}
          autoPlay
          muted
        />
      )}
    </div>
  );
};

export default Whiteboard;
