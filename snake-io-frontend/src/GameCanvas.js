import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import snake from './snake';
import { EAST, WEST, NORTH, SOUTH } from './constants';

function GameCanvas({ registerDrawFunction, socket }) {
  const canvas = useRef(null);
  const [rows, setRows] = useState(60);
  const [columns, setColumns] = useState(80);

  useEffect(() => {
    const x = c => Math.round((c * canvas.current.width) / columns);
    const y = r => Math.round((r * canvas.current.height) / rows);

    const handleKeydown = e => {
      switch (e.code) {
        case 'ArrowUp':
          console.log('up');
          socket.emit('action', { direction: 'NORTH' });
          //Snake.enqueueAction({ id: 's1', direction: 'NORTH' });
          break;
        case 'ArrowDown':
          socket.emit('action', { direction: 'SOUTH' });
          // Snake.enqueueAction({ id: 's1', direction: 'SOUTH' });
          break;
        case 'ArrowLeft':
          socket.emit('action', { direction: 'WEST' });
          // Snake.enqueueAction({ id: 's1', direction: 'WEST' });
          break;
        case 'ArrowRight':
          socket.emit('action', { direction: 'EAST' });
          // Snake.enqueueAction({ id: 's1', direction: 'EAST' });
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeydown);

    function draw(canvas, state) {
      const ctx = canvas.getContext('2d');

      // draw && clear background
      ctx.fillStyle = '#232323';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw snakes
      Object.keys(state.snakes).forEach(socketId => {
        socket.id === socketId
          ? (ctx.fillStyle = 'green')
          : (ctx.fillStyle = 'orange'); // if p.id this client's socket id change color
        state.snakes[socketId].body.forEach(p =>
          ctx.fillRect(x(p.x), y(p.y), x(1.1), y(1.1))
        );
      });

      // draw apple 1
      ctx.fillStyle = 'red';
      ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1));

      // draw apple 2
      ctx.fillStyle = 'red';
      ctx.fillRect(x(state.apple2.x), y(state.apple2.y), x(1), y(1));

      // draw apple 3
      ctx.fillStyle = 'red';
      ctx.fillRect(x(state.apple3.x), y(state.apple3.y), x(1), y(1));
    }
    console.log(canvas);
    registerDrawFunction(state => draw(canvas.current, state));
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [columns, rows]);

  return (
    <div className="App">
      <canvas ref={canvas} width={columns * 8} height={rows * 8} />
    </div>
  );
}

export default GameCanvas;
