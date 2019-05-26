import React, { useRef, useEffect } from 'react';
import './App.css';
import Snake from './snake';

const state = {
  rows: 60,
  columns: 80,
  snake: [{ x: 5, y: 10 }, { x: 6, y: 10 }],
  apple: { x: 50, y: 40 }
};

const x = c => Math.round((c * canvasWidth) / state.columns);
const y = r => Math.round((r * canvasHeight) / state.rows);

const canvasWidth = 800;
const canvasHeight = 600;

function App() {
  const canvas = useRef(null);
  const state = Snake.initialState();
  let moves = [];
  useEffect(() => {
    draw(canvas.current, state);
    requestAnimationFrame(loop(state, 0));
    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowUp':
          moves.push({ id: '1', direction: 'NORTH' });
          break;
        case 'ArrowDown':
          moves.push({ id: '1', direction: 'SOUTH' });
          break;
        case 'ArrowLeft':
          moves.push({ id: '1', direction: 'WEST' });
          break;
        case 'ArrowRight':
          moves.push({ id: '1', direction: 'EAST' });
          break;
      }
    });
  });

  const loop = (state, t1) => t2 => {
    if (t2 - t1 > 35) {
      const nextState = Snake.nextState(
        state.snakes['1'].body.length === 0 ? Snake.initialState() : state,
        moves.shift() || { id: '1', direction: state.snakes['1'].direction }
      );
      draw(canvas.current, nextState);
      requestAnimationFrame(loop(nextState, t2));
    } else {
      requestAnimationFrame(loop(state, t1));
    }
  };

  return (
    <div className="App">
      <canvas ref={canvas} width={canvasWidth} height={canvasHeight} />
    </div>
  );
}

function draw(canvas, state) {
  const ctx = canvas.getContext('2d');

  // draw && clear background
  ctx.fillStyle = '#232323';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw snake
  ctx.fillStyle = 'pink';
  state.snakes['1'].body.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1)));

  // draw apple
  ctx.fillStyle = 'red';
  ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1));

  // draw endgame
  if (state.snakes['1'].body.length === 0) {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // console.log('dwaring');
  // state.snake.map(p => {
  //   if (p.x < 80) p.x++;
  //   if (p.x >= 80) {
  //     p.x = 0;
  //   }
  // });
  // ctx.beginPath();
  // ctx.arc(50, 50, 20, 0, 2 * Math.PI);
  // ctx.fill();
  // ctx.stroke();
}

export default App;
