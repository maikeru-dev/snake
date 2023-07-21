class SnakeGame extends Game2D {
    protected _snakeList : BiLinkedList;
    protected _snakeColour : Colour;
    protected _appleColour : Colour;
    protected _INIT_COORDS : Coordinate = {x: 15, y:15}; // Center.
    protected _snakeCollision : CollisionType;
    protected _timing : number;
    protected _apple : Apple;
    constructor() {
        super();
        if (Configuration.has(["snakeColour", "appleColour", "timing"], this._config)) { // Note that if any of these don't exist, first statement won't run. :I
            this._snakeColour = this._config.getValue("snakeColour");
            this._appleColour = this._config.getValue("appleColour");
            this._timing = this._config.getValue("timing");
        } else {
            this._snakeColour = new Colour(0, 255, 0);
            this._appleColour = new Colour(255, 0 ,0);
            this._timing = 500; // 1000ms = 1s
        }
        let snakeHead : SnakeHead = new SnakeHead(
            null,
            this._snakeColour,
            this._INIT_COORDS,
            Direction.up // default, point the snake upwards!
        );

        this._snakeList = new BiLinkedList(snakeHead, this._snakeColour);
        this._apple = SnakeGame.generateApple(this);
        this._renderer.update();
        this._snakeCollision = CollisionType.NONE;
        this._running = true;

    }
    public init() : SnakeGame {
        this.tick(this);
        return this;
    }

    protected tick(game : SnakeGame) : void {
        // TODO: PUSH SNAKE FORWARD : DONE
        // TODO: CHECK SNAKE IS OVER THE APPLE
        // TODO: WRITE APPLE CLASS : DONE
        // TODO: DECLARE APPLE IN CONSTRUCTOR : DONE
        // TODO: WRITE COLLISION CHECKS FOR THE SNAKE : DONE
        // TODO: WRITE OUT-OF-BOUND CHECKS FOR THE SNAKE : DONE
        // TODO: WRITE A GAME STOP FUNCTION : DONE
        // TODO: WRITE KEY LISTENERS

        // Problem: I wrote the renderer updateDot in such a way that it expects that you pull "dots" from
        //      the board, however I simply create new dots and shove them into my snake bi linked list.
        //      The issue here is that it's private, and I do not want that in case there is multiple moving
        //      parts in the game engine! Write this in such a way that it utilizes both the snake list to keep track
        //      of where we are but use the board to reference dots rather than creating new ones. This way,
        //      it is logically exposed to the rest of the program, and things can be interpreted in forms
        //      like boundaries or walls for sprites. It isn't necessary here (at least for now),
        //      but it is good practice.
        //  TODO: IMPROVE BOARD2D USAGE AND LEVERAGE THE RENDERER

        let beginDelta : number = game._perf.now();
        let endDelta : number;
        let totalTickTime : number;

        console.log("Tick!");
        if (game._running == false) return console.log("Game ended."); // No alternative implemented yet (no game over screen, etc...)

        SnakeGame.pushSnake(game); // Snake is now pushed! Cannot be out of bounds as the collision check is in this function.
        game._snakeCollision = game._snakeList.checkCollisions();
        game._snakeCollision = game.checkCollision(game);

        if (game._snakeCollision != CollisionType.NONE) {
            if (game._snakeCollision == CollisionType.APPLE) {
                game._apple = SnakeGame.generateApple(game);
                game._apple.colour = this._appleColour;
                game._renderer.drawDot(game._apple);
                // Snake has already overdrawn the apple!
                // However, we have to draw a new apple.
                // We also will not change the snakeCollision, and pass it to the next tick.
            } else {
                game._running = false;
            }
        }

        endDelta = game._perf.now();
        totalTickTime = endDelta - beginDelta;
        console.log("Tick time: " + totalTickTime );

        setTimeout(game.tick, game._timing - totalTickTime, game) // fucking help me: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#callbacks
        // LOGIC BEHIND DELTA TIME:
        // run tick,
        // figure out how long it took to make that run,
        // minus that from timing,
        // and you're left to wait to make 1 tick run per second (if timing == 1000ms).
    }
    protected checkCollision(game : SnakeGame) : CollisionType {
        // Apple collision check!

        if (this._snakeCollision == CollisionType.NONE) {
            if (this._snakeList.getHead == this._apple) { // comparing a reference to another reference! but what if they're the same? :3
                return CollisionType.APPLE;
            }else {
                return CollisionType.NONE;
            }
        } else {
            return game._snakeCollision;
        }

    }
    protected static pushSnake(game : SnakeGame) {
        // Idea: Create new SnakeHead, insert old SnakeHead at the front of the BIL-List
        let head : SnakeHead = game._snakeList.getHead;
        let headCoords : Coordinate = head.coords;
        let bDIM : Dimension = game._board.getDIM;
        let uDirVector : Vector2D = SnakeGame.translateToVector(head.direction);

        // Write out of bounds check here. Don't write collision here.
        if ((uDirVector.x + headCoords.x) > bDIM.width || 0 > ((uDirVector.x + headCoords.x))) {
            // Throw game over!!
            game._snakeCollision = CollisionType.OUTOFBOUNDS;
        }
        if ((uDirVector.y + headCoords.y) > bDIM.height || 0 > ((uDirVector.y + headCoords.y))) {
            // Throw game over!!
            game._snakeCollision = CollisionType.OUTOFBOUNDS;
        }


        // Let snake move forward!
        let newCoords : Coordinate = {
            x: uDirVector.x + headCoords.x,
            y: uDirVector.y + headCoords.y
        }

        let newHead : SnakeHead = new SnakeHead(null, game._snakeColour, newCoords, head.direction);

        game._board.updateDot(newCoords, newHead);
        game._renderer.drawDot(newHead);
        game._snakeList.changeHead(newHead);
        game._snakeList.insert(head as SnakeBody); // old head!!
        console.log("Head's coords : " + newCoords.x + ", " + newCoords.y);
        if (game._snakeCollision != CollisionType.OUTOFBOUNDS) {
            if (game._snakeCollision != CollisionType.APPLE ) { // No need to remove it as apple extends the snake's size.
                let oldTail : SnakeBody = game._snakeList.removeLast(); // pray this works bud // Edit: it probably does.
                game._renderer.clearDot(oldTail); // Remove old tail
                game._snakeCollision = CollisionType.NONE;
            }
            game._renderer.drawDot(newHead); // Draw new head
        } else {
            console.log("We're out of bounds!");
        }
    }
    protected static generateApple(game : SnakeGame) : Apple {
        // Problem: Math.random() is, pretty slow, and slows down the snake when the game is running!
        // Possible solutions:
        //      - USE DELTA TIME IN PROCESSING!
        //      - PRE-CALCULATE THE RANDOMNESS?
        //      - COPY BOARD, REMOVE SNAKE FROM BOARD, SHUFFLE BOARD, SELECT A POSITION!

        // Selected solution for now: Delta time. Should be implemented later.
        let randomPosition : Coordinate;
        let spaceOccupied : boolean = true;
        let boardDim : Dimension = game._board.getDIM;
        let snakeList : BiLinkedList = game._snakeList;
        let board : Board2D =  game._board;

        function getRandomInt(max : number, min : number) : number {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        while (spaceOccupied) {
            randomPosition = {
                x : getRandomInt(boardDim.width-1, 0),
                y : getRandomInt(boardDim.height-1, 0)
            };
            console.log(`randomPosition: ${randomPosition.x} , ${randomPosition.y}`);

            if (snakeList.fetchFirstMatch(randomPosition) == null) { // Position is not occupied.
                if (Colour.compareExact(board.fetchDot(randomPosition).colour, new Colour(255, 255, 255))) { // Is white;
                    spaceOccupied = false;
                } else {
                    console.log("Double check @generateApple failed! Continuing...");
                    spaceOccupied = false;
                }
            }
        }

        // We found a free location! Let's use it.
        return board.fetchDot(randomPosition); // We return the apple to make it easier to detect snake x apple collision
    }
    protected static translateToVector(direction : Direction) : Vector2D {
        let vector : Vector2D = {x: 0, y: 0}; // create unit vector
        switch (direction) {
            case 0:
                vector.y = -1; break;
            case 1:
                vector.x = 1; break;
            case 2:
                vector.y = 1; break;
            case 3:
                vector.x = -1; break;
        }
        return vector;
    }
}