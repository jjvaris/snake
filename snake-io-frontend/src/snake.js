const EAST = 'EAST';
const WEST = 'WEST';
const NORTH = 'NORTH';
const SOUTH = 'SOUTH';

const mod = (n, m) => ((n % m) + m) % m;
const rnd = max => Math.floor(Math.random() * max + 1);
const removeFirst = array => array.slice(1);
const keysToArray = o => [
  ...Object.entries(o).map(([k, v]) => {
    return { ...v, id: k };
  })
];
const getSnakeHead = snake => snake.body[snake.body.length - 1];
const isSamePosition = (pos1, pos2) => pos1.x === pos2.x && pos1.y === pos2.y;

const directions = {
  EAST: { x: 1, y: 0 },
  WEST: { x: -1, y: 0 },
  NORTH: { x: 0, y: -1 },
  SOUTH: { x: 0, y: 1 }
};

let state = {};

const snake = {};

snake.initialState = () => {
  console.log('initial state called');
  state = {
    gameOver: false,
    rows: 60,
    columns: 80,
    snakes: {
      s1: {
        body: [
          { x: 6, y: 10 },
          { x: 7, y: 10 },
          { x: 8, y: 10 },
          { x: 9, y: 10 },
          { x: 10, y: 10 },
          { x: 11, y: 10 },
          { x: 12, y: 10 },
          { x: 13, y: 10 },
          { x: 14, y: 10 },
          { x: 15, y: 10 }
        ],
        direction: EAST,
        moves: [],
        points: 0
      },
      s2: {
        body: [
          { x: 6, y: 40 },
          { x: 7, y: 40 },
          { x: 8, y: 40 },
          { x: 9, y: 40 },
          { x: 10, y: 40 },
          { x: 11, y: 40 },
          { x: 12, y: 40 },
          { x: 13, y: 40 },
          { x: 14, y: 40 },
          { x: 15, y: 40 }
        ],
        direction: EAST,
        moves: [],
        points: 0
      }
    },
    apple: { x: rnd(80 - 1), y: rnd(60 - 1) }
  };
  return state;
};

const newApple = () => {
  return { x: rnd(state.columns - 1), y: rnd(state.rows - 1) };
};

snake.enqueueAction = action => {
  const snake = state.snakes[action.id];
  state = {
    ...state,
    snakes: {
      ...state.snakes,
      [action.id]: {
        ...snake,
        moves: [...snake.moves, action.direction]
      }
    }
  };
};

snake.next = () => {
  // moveSnakes, eat etc.
  // check collisions
  const snakesWithNewPositions = moveSnakes(state);
  const aliveSnakes = removeCollidedSnakes(keysToArray(snakesWithNewPositions));
  console.log(aliveSnakes);
  const apple = isAppleEated(state.apple, aliveSnakes)
    ? newApple()
    : state.apple;

  //console.log(snakesWithNewPositions);
  //console.log(aliveSnakes);
  state = {
    ...state,
    snakes: aliveSnakes.reduce((snakes, snake) => {
      snakes[snake.id] = snake;
      return snakes;
    }, {}),
    apple: apple
  };
  //console.log(state);
  return state;
  //state = collision(state) ? stateAfterCollision(state) : curState;
};

const moveSnakes = state => {
  const snakes = Object.entries(state.snakes)
    .map(([id, snake]) => {
      const head = snake.body[snake.body.length - 1];
      const direction =
        snake.moves.length !== 0
          ? isValid(snake.moves[0], snake.direction)
            ? snake.moves[0]
            : snake.direction
          : snake.direction;
      const nextPosition = {
        x: mod(head.x + directions[direction].x, state.columns),
        y: mod(head.y + directions[direction].y, state.rows)
      };
      const willEat = () =>
        state.apple.x === nextPosition.x && state.apple.y === nextPosition.y;

      const body = willEat() ? snake.body : removeFirst(snake.body);
      return [
        id,
        {
          ...snake,
          body: [...body, nextPosition],
          moves: snake.moves ? [...removeFirst(snake.moves)] : [],
          direction: direction
        }
      ];
    })
    .reduce((snakes, [id, snake]) => {
      snakes[id] = snake;
      return snakes;
    }, {});
  return snakes;
};

const removeCollidedSnakes = snakes => {
  const isOwnHead = (snake1, snake2, body) => {
    const head1 = snake1.body[snake1.body.length - 1];
    const head2 = snake2.body[snake2.body.length - 1];
    return head2.x === body.y && head2.y === body.y && snake1.id === snake2.id;
    // if(head2.x === body.y && head2.y === body.y && snake1.id === snake2.id)
    //  return true
    // return (
    //   snake1.id === snake2.id && head1.x === head2.x && head1.y === body.y
    // );
  };

  const willCollide = snake => {
    const head = snake.body[snake.body.length - 1];

    const ownCollision = () => {
      const body = snake.body.slice(0, snake.body.length - 1);
      return body.some(pos => pos.x === head.x && pos.y === head.y);
    };

    return ownCollision()
      ? true
      : snakes.some(s => {
          return s.body.some(
            b => s.id !== snake.id && b.x === head.x && b.y === head.y
            // b.y === head.y &&
            // !(
            //   s.id === snake.id &&
            //   s.body[s.body.length - 1].x === b.x &&
            //   s.body[s.body.length - 1].y === b.y
            // )
          );
        });
  };

  return snakes.map(snake => {
    if (willCollide(snake)) {
      console.log('COLLISION');
      return {
        ...snake,
        body: []
      };
    }
    console.log('NO COLLISION');
    return snake;
  });
};

const isAppleEated = (apple, snakes) =>
  snakes.some(
    snake => snake.body.length > 0 && isSamePosition(apple, getSnakeHead(snake))
  );

snake.nextState = action => {
  state = isValid(action)
    ? move(action.id, action.direction)
    : move(action.id, state.snakes[action.id].direction);
  return state;
};

const isValid = (action, currentDirection) => {
  switch (action) {
    case EAST:
      return currentDirection !== WEST;
    case WEST:
      return currentDirection !== EAST;
    case NORTH:
      return currentDirection !== SOUTH;
    case SOUTH:
      return currentDirection !== NORTH;
    default:
      return false;
  }
};

const move = (id, direction) => {
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
