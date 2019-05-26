const EAST = 'EAST';
const WEST = 'WEST';
const NORTH = 'NORTH';
const SOUTH = 'SOUTH';

const mod = (n, m) => ((n % m) + m) % m;
const rnd = max => Math.floor(Math.random() * max + 1);

const directions = {
  EAST: { x: 1, y: 0 },
  WEST: { x: -1, y: 0 },
  NORTH: { x: 0, y: -1 },
  SOUTH: { x: 0, y: 1 }
};

const snake = {};

snake.initialState = () => {
  return {
    rows: 60,
    columns: 80,
    snakes: {
      '1': {
        body: [{ x: 5, y: 10 }, { x: 6, y: 10 }],
        direction: EAST
      }
    },
    apple: { x: 50, y: 40 }
  };
};

snake.nextState = (state, action) => {
  return isValid(state, action)
    ? move(state, action.id, action.direction)
    : move(state, action.id, state.snakes[action.id].direction);
};

const isValid = (state, action) => {
  const direction = state.snakes[action.id].direction;
  switch (action.direction) {
    case EAST:
      return direction !== WEST;
    case WEST:
      return direction !== EAST;
    case NORTH:
      return direction !== SOUTH;
    case SOUTH:
      return direction !== NORTH;
    default:
      return false;
  }
};

const move = (state, id, direction) => {
  const snake = state.snakes[id];
  const head = snake.body[snake.body.length - 1];
  const nextPosition = {
    x: mod(head.x + directions[direction].x, state.columns),
    y: mod(head.y + directions[direction].y, state.rows)
  };
  const willCollide = () =>
    snake.body.some(
      pos => pos.x === nextPosition.x && pos.y === nextPosition.y
    );
  const willEat = () =>
    state.apple.x === nextPosition.x && state.apple.y === nextPosition.y;
  const endGame = () => {
    return {
      ...state,
      snakes: { ...state.snakes, [id]: { ...snake, body: [] } }
    };
  };
  const eat = () => {
    return {
      ...state,
      snakes: {
        ...state.snakes,
        [id]: {
          ...snake,
          body: [...snake.body, nextPosition],
          direction: direction
        }
      },
      apple: { x: rnd(state.columns), y: rnd(state.rows) }
    };
  };
  const forward = () => {
    // console.log('forward');
    return {
      ...state,
      snakes: {
        ...state.snakes,
        [id]: {
          ...snake,
          body: [...snake.body.slice(1), nextPosition],
          direction: direction
        }
      }
    };
  };

  return willCollide() ? endGame() : willEat() ? eat() : forward();
};

export default snake;
