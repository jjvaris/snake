import {
  EAST,
  WEST,
  NORTH,
  SOUTH,
  DIRECTIONS as directions
} from './constants';
import { mod, rnd, removeFirst, isSamePosition } from './base';

function Snake(options) {
  const opt = options || {};
  const rows = opt.rows || 60;
  const columns = opt.columns || 80;
  var state = initialState();

  function initialState() {
    console.log('initial state called');
    state = {
      gameOver: false,
      rows: rows,
      columns: columns,
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
      apple: { x: rnd(columns - 1), y: rnd(rows - 1) },
      apple2: { x: rnd(columns - 1), y: rnd(rows - 1) },
      apple3: { x: rnd(columns - 1), y: rnd(rows - 1) }
    };
    return state;
  }
  function enqueueAction(action) {
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
  }
  function next() {
    const snakesWithNewPositions = moveSnakes(state);
    const aliveSnakes = removeCollidedSnakes(
      keysToArray(snakesWithNewPositions)
    );

    // Todo: remove hard coded apple count
    const apple = isAppleEated(state.apple, aliveSnakes)
      ? rndCoordinate()
      : state.apple;
    const apple2 = isAppleEated(state.apple2, aliveSnakes)
      ? rndCoordinate()
      : state.apple2;
    const apple3 = isAppleEated(state.apple3, aliveSnakes)
      ? rndCoordinate()
      : state.apple3;

    state = {
      ...state,
      snakes: aliveSnakes.reduce((snakes, snake) => {
        snakes[snake.id] = snake;
        return snakes;
      }, {}),
      apple: apple,
      apple2: apple2,
      apple3: apple3
    };
    return state;
  }
  function getState() {
    return state;
  }

  /* private functions */
  const keysToArray = o => [
    ...Object.entries(o).map(([k, v]) => {
      return { ...v, id: k };
    })
  ];

  const getSnakeHead = snake => snake.body[snake.body.length - 1];

  const rndCoordinate = () => {
    return { x: rnd(state.columns - 1), y: rnd(state.rows - 1) };
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
        const willEat = apple =>
          apple.x === nextPosition.x && apple.y === nextPosition.y;

        const ateApple = willEat(state.apple);
        const ateApple2 = willEat(state.apple2);
        const ateApple3 = willEat(state.apple3);
        if (ateApple || ateApple2 || ateApple3) {
          console.log(snake.id, snake.points);
        }
        const body =
          ateApple || ateApple2 || ateApple3
            ? snake.body
            : removeFirst(snake.body);
        return [
          id,
          {
            ...snake,
            points:
              ateApple || ateApple2 || ateApple3
                ? snake.points + 1 + Math.trunc(snake.body.length / 2)
                : snake.points,
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
            );
          });
    };

    return snakes.map(snake => {
      if (willCollide(snake)) {
        return {
          ...snake,
          body: [rndCoordinate()]
        };
      }
      return snake;
    });
  };

  const isAppleEated = (apple, snakes) =>
    snakes.some(
      snake =>
        snake.body.length > 0 && isSamePosition(apple, getSnakeHead(snake))
    );

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
  return { initialState, enqueueAction, next, getState };
}

export default Snake;
