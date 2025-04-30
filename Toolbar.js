import React from 'react';

const Toolbar = ({ setColor, clearCanvas, exportPDF, startScreenShare, stopScreenShare, isSharing }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
      <button onClick={() => setColor('black')}>Black</button>
      <button onClick={() => setColor('red')}>Red</button>
      <button onClick={() => setColor('blue')}>Blue</button>
      <button onClick={() => setColor('green')}>Green</button>
      <button onClick={clearCanvas}>Clear</button>
      <button onClick={exportPDF}>Export PDF</button>
      {isSharing ? (
        <button onClick={stopScreenShare}>Stop Screen Share</button>
      ) : (
        <button onClick={startScreenShare}>Start Screen Share</button>
      )}
    </div>
  );
};

export default Toolbar;
