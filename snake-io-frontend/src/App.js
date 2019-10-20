import React, { useRef, useEffect } from 'react';
import './App.css';
import snake from './snake';
import { EAST, WEST, NORTH, SOUTH } from './constants';

function App() {
  const canvas = useRef(null);
  const s1Left = useRef(null);
  const s1Right = useRef(null);
  const s2Left = useRef(null);
  const s2Right = useRef(null);

  useEffect(() => {
    const rows =
      canvas.current.height >= canvas.current.width
        ? 80
        : Math.round((80 * canvas.current.height) / canvas.current.width);
    const columns =
      canvas.current.width >= canvas.current.height
        ? 80
        : Math.round((80 * canvas.current.width) / canvas.current.height);
    console.log(columns, rows);
    const iteration = 35;

    const Snake = snake({ rows, columns });

    const x = c => Math.round((c * canvas.current.width) / columns);
    const y = r => Math.round((r * canvas.current.height) / rows);
    const loop = (state, t1) => t2 => {
      if (t2 - t1 > iteration) {
        const nextState = Snake.next();
        draw(canvas.current, nextState);
        requestAnimationFrame(loop(nextState, t2));
      } else {
        requestAnimationFrame(loop(state, t1));
      }
    };

    console.log('useEffect');
    const state = Snake.initialState();
    draw(canvas.current, state);
    requestAnimationFrame(loop(state, 0));
    console.log(s1Left);
    s1Left.current.addEventListener('click', e => {
      console.log('s1left');
      const state = Snake.getState();
      const direction = state.snakes.s1.direction;
      console.log(direction);
      if (direction === EAST)
        Snake.enqueueAction({ id: 's1', direction: NORTH });
      if (direction === NORTH)
        Snake.enqueueAction({ id: 's1', direction: WEST });
      if (direction === WEST)
        Snake.enqueueAction({ id: 's1', direction: SOUTH });
      if (direction === SOUTH)
        Snake.enqueueAction({ id: 's1', direction: EAST });
    });
    s1Right.current.addEventListener('click', e => {
      console.log('s1Right');
      const state = Snake.getState();
      const direction = state.snakes.s1.direction;
      console.log(direction);
      if (direction === EAST)
        Snake.enqueueAction({ id: 's1', direction: SOUTH });
      if (direction === NORTH)
        Snake.enqueueAction({ id: 's1', direction: EAST });
      if (direction === WEST)
        Snake.enqueueAction({ id: 's1', direction: NORTH });
      if (direction === SOUTH)
        Snake.enqueueAction({ id: 's1', direction: WEST });
    });
    s2Left.current.addEventListener('click', e => {
      console.log('s2left');
      const state = Snake.getState();
      const direction = state.snakes.s2.direction;
      console.log(direction);
      if (direction === EAST)
        Snake.enqueueAction({ id: 's2', direction: NORTH });
      if (direction === NORTH)
        Snake.enqueueAction({ id: 's2', direction: WEST });
      if (direction === WEST)
        Snake.enqueueAction({ id: 's2', direction: SOUTH });
      if (direction === SOUTH)
        Snake.enqueueAction({ id: 's2', direction: EAST });
    });
    s2Right.current.addEventListener('click', e => {
      console.log('s2right');
      const state = Snake.getState();
      const direction = state.snakes.s2.direction;
      console.log(direction);
      if (direction === EAST)
        Snake.enqueueAction({ id: 's2', direction: SOUTH });
      if (direction === NORTH)
        Snake.enqueueAction({ id: 's2', direction: EAST });
      if (direction === WEST)
        Snake.enqueueAction({ id: 's2', direction: NORTH });
      if (direction === SOUTH)
        Snake.enqueueAction({ id: 's2', direction: WEST });
    });
    document.addEventListener('keydown', e => {
      //console.log(e);
      switch (e.code) {
        case 'ArrowUp':
          Snake.enqueueAction({ id: 's1', direction: 'NORTH' });
          break;
        case 'ArrowDown':
          Snake.enqueueAction({ id: 's1', direction: 'SOUTH' });
          break;
        case 'ArrowLeft':
          Snake.enqueueAction({ id: 's1', direction: 'WEST' });
          break;
        case 'ArrowRight':
          Snake.enqueueAction({ id: 's1', direction: 'EAST' });
          break;
        case 'KeyW':
          Snake.enqueueAction({ id: 's2', direction: 'NORTH' });
          break;
        case 'KeyS':
          Snake.enqueueAction({ id: 's2', direction: 'SOUTH' });
          break;
        case 'KeyA':
          Snake.enqueueAction({ id: 's2', direction: 'WEST' });
          break;
        case 'KeyD':
          Snake.enqueueAction({ id: 's2', direction: 'EAST' });
          break;
        default:
          break;
      }
    });
    function draw(canvas, state) {
      const ctx = canvas.getContext('2d');

      // draw && clear background
      ctx.fillStyle = '#232323';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw snake1
      ctx.fillStyle = 'green';
      state.snakes['s1'].body.map(p =>
        ctx.fillRect(x(p.x), y(p.y), x(1.1), y(1.1))
      );
      // draw snake2
      ctx.fillStyle = 'yellow';
      state.snakes['s2'].body.map(p =>
        ctx.fillRect(x(p.x), y(p.y), x(1.1), y(1.1))
      );

      // draw apple
      ctx.fillStyle = 'red';
      ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1));

      // draw apple
      ctx.fillStyle = 'red';
      ctx.fillRect(x(state.apple2.x), y(state.apple2.y), x(1), y(1));

      // draw apple
      ctx.fillStyle = 'red';
      ctx.fillRect(x(state.apple3.x), y(state.apple3.y), x(1), y(1));
    }
  });

  return (
    <div className="App">
      <canvas
        ref={canvas}
        width={Math.round(window.innerWidth - 10)}
        height={Math.round(window.innerHeight - 10)}
      />
      <div className="controls">
        <div ref={s1Right} />
        <div ref={s1Left} />
        <div ref={s2Left} />
        <div ref={s2Right} />
      </div>
    </div>
  );
}

export default App;
