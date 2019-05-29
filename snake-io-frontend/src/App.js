import React, { useRef, useEffect } from 'react';
import './App.css';
import Snake from './snake';

const x = c => Math.round((c * canvasWidth) / 80);
const y = r => Math.round((r * canvasHeight) / 60);

const canvasWidth = 800;
const canvasHeight = 600;

function App() {
  const canvas = useRef(null);

  let moves = [];
  useEffect(() => {
    console.log('useEffect');
    const state = Snake.initialState();
    draw(canvas.current, state);
    requestAnimationFrame(loop(state, 0));
    document.addEventListener('keydown', e => {
      console.log(e);
      switch (e.key) {
        case 'ArrowUp':
          Snake.enqueueAction({ id: 's1', direction: 'NORTH' });
          //moves.push({ id: '1', direction: 'NORTH' });
          break;
        case 'ArrowDown':
          Snake.enqueueAction({ id: 's1', direction: 'SOUTH' });
          // moves.push({ id: '1', direction: 'SOUTH' });
          break;
        case 'ArrowLeft':
          Snake.enqueueAction({ id: 's1', direction: 'WEST' });
          // moves.push({ id: '1', direction: 'WEST' });
          break;
        case 'ArrowRight':
          Snake.enqueueAction({ id: 's1', direction: 'EAST' });
          // moves.push({ id: '1', direction: 'EAST' });
          break;
        case 'w':
          Snake.enqueueAction({ id: 's2', direction: 'NORTH' });
          //moves.push({ id: '1', direction: 'NORTH' });
          break;
        case 's':
          Snake.enqueueAction({ id: 's2', direction: 'SOUTH' });
          // moves.push({ id: '1', direction: 'SOUTH' });
          break;
        case 'a':
          Snake.enqueueAction({ id: 's2', direction: 'WEST' });
          // moves.push({ id: '1', direction: 'WEST' });
          break;
        case 'd':
          Snake.enqueueAction({ id: 's2', direction: 'EAST' });
          // moves.push({ id: '1', direction: 'EAST' });
          break;
      }
    });
  });

  const loop = (state, t1) => t2 => {
    if (t2 - t1 > 35) {
      const nextState = Snake.next();
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

  // draw snake1
  ctx.fillStyle = 'pink';
  state.snakes['s1'].body.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1)));

  // draw snake
  ctx.fillStyle = 'green';
  state.snakes['s2'].body.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1)));

  // draw apple
  ctx.fillStyle = 'red';
  ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1));

  // draw endgame
  if (
    state.snakes['s1'].body.length === 0 ||
    state.snakes['s2'].body.length === 0
  ) {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Snake.initialState();
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
