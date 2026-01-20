import React, { useEffect, useState } from 'react';
import GameCanvas from './GameCanvas';
import io from 'socket.io-client';

const socket =
  process.env.NODE_ENV === 'production' ? io() : io('http://localhost:3010');

let draw = () => {};

function SnakeGame() {
  function registerDrawFunction(fn) {
    draw = fn;
  }

  const [gameState, setGameState] = useState(null);

  const [canvas] = useState(
    <GameCanvas registerDrawFunction={registerDrawFunction} socket={socket} />
  );

  useEffect(() => {
    console.log('use effect snake');
    socket.on('loop', state => {
      draw(state);
      setGameState(state);
    });
  }, []);

  return (
    <>
      <GameCanvas registerDrawFunction={registerDrawFunction} socket={socket} />
      <ul>
        {gameState &&
          Object.keys(gameState.snakes).map(id => (
            <li>{`snake: ${id} points: ${gameState.snakes[id].points}`}</li>
          ))}
      </ul>
    </>
  );
}

export default SnakeGame;
