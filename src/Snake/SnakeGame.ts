class SnakeGame extends Game2D {
    protected _snakeList : BiLinkedList;
    protected _snakeColour : Colour;
    protected _appleColour : Colour;
    protected _INIT_COORDS : Coordinate = new Coordinate(0,0);
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
            this._timing = 60;
        }

        let snakeHead : SnakeHead = new SnakeHead(
            null,
            this._snakeColour,
            this._INIT_COORDS,
            Direction.up // default, point the snake upwards!
        );

        this._snakeList = new BiLinkedList(snakeHead, this._snakeColour);
        this._apple = this.generateApple(new Apple(this._INIT_COORDS, this._appleColour));

        this._renderer.update();
        this._running = true;
    }

    protected tick() : void {
        // TODO: PUSH SNAKE FORWARD
        // TODO: CHECK SNAKE IS OVER THE APPLE
        // TODO: WRITE APPLE CLASS
        // TODO: DECLARE APPLE IN CONSTRUCTOR
        // TODO: WRITE COLLISION CHECKS FOR THE SNAKE
        // TODO: WRITE OUT-OF-BOUND CHECKS FOR THE SNAKE : DONE
        // TODO: WRITE A GAME STOP FUNCTION : DONE
        // TODO: WRITE KEY LISTENERS
        let beginDelta : number = this._perf.now();
        let endDelta : number;
        let totalTickTime : number;
        let snakeCollision : CollisionType = CollisionType.NONE;

        if (this._running == false) return; // No alternative implemented yet.

        this.pushSnake(); // Snake is now pushed! Cannot be out of bounds as the collision check is in the function.
        snakeCollision = this._snakeList.checkCollisions();

        endDelta = this._perf.now();
        totalTickTime = endDelta - beginDelta;

        setTimeout(this.tick, ) // fucking help me: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#callbacks

    }
    protected checkCollision(snakeCollision : CollisionType) : CollisionType {
        // Apple collision check!


        return;
    }
    protected pushSnake() {
        // Idea: Create new SnakeHead, insert old SnakeHead at the front of the BIL-List
        let head : SnakeHead = this._snakeList.getHead;
        let headCoords : Coordinate = head.coords;
        let bDIM = this._board.getDIM;
        let uDirVector : Vector2D = this.translateToVector(head.direction);

        // Write out of bounds check here. Don't write collision here.
        if ((uDirVector.x + headCoords.getX) > bDIM.getWidth || 0 > ((uDirVector.x + headCoords.getX))) {
            // Throw game over!!
            this._running = false;
        }
        if ((uDirVector.y + headCoords.getY) > bDIM.getHeight || 0 > ((uDirVector.y + headCoords.getY))) {
            // Throw game over!!
            this._running = false;
        }

        // Let snake move forward!
        let newCoords : Coordinate = new Coordinate(
            uDirVector.x + headCoords.getX,
            uDirVector.y + headCoords.getY
        )
        let newHead : SnakeHead = new SnakeHead(
            null, // Doesn't matter what we set 'next' to, gets overwritten when inserting.
            this._snakeColour,
            newCoords,
            head.direction); // Carry over the direction;

        this._snakeList.changeHead(newHead);
        this._snakeList.insert(head as SnakeBody); // old head!!

        let oldTail : SnakeBody = this._snakeList.removeLast(); // pray this works bud // Edit: it probably does.

        // Okay we probably should draw the thing right?

        // TODO: DELETE THE TAIL
        // TODO: DRAW NEW HEAD (OVERDRAW OLD HEAD IF NEW HEAD IS DIFFERENT COLOUR/TEXTURE)
        this._renderer.clearDot(oldTail); // Remove old tail
        this._renderer.updateDot(newHead, this._snakeColour); // Draw new head

    }
    protected generateApple(apple : Apple): Apple {
        // Problem: Math.random() is, pretty slow, and slows down the snake when the game is running!
        // Possible solutions:
        //      - USE DELTA TIME IN PROCESSING!
        //      - PRE-CALCULATE THE RANDOMNESS?
        //      - COPY BOARD, REMOVE SNAKE FROM BOARD, SHUFFLE BOARD, SELECT A POSITION!

        // Selected solution for now: Delta time. Should be implemented later.
        let randomPosition : Coordinate;
        let spaceOccupied : boolean = true;
        let bDim : Dimension = this._board.getDIM;

        function getRandomInt(max : number, min : number) : number {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        while (spaceOccupied) {
            randomPosition = new Coordinate(
                getRandomInt(bDim.getWidth-1, 0),
                getRandomInt(bDim.getHeight-1, 0));
            if (this._snakeList.fetchFirstMatch(randomPosition) == null) { // Position is not occupied.
                spaceOccupied = false;
            }
        }

        // We found a free location! Let's use it.
        apple = new Apple(randomPosition, apple.colour);
        return apple;
    }
    protected translateToVector(direction : Direction) : Vector2D {
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
    get getRunning() : boolean {
        return this._running;
    }
}