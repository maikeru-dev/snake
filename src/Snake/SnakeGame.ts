class SnakeGame extends Game2D {
    protected _snakeList : BiLinkedList;
    protected snakeColour : Colour;
    protected INIT_COORDS : Coordinate = new Coordinate(0,0);
    constructor() {
        super();
        if (Configuration.has(["snakeColour"], this.config)) {
            this.snakeColour = this.config.getValue("snakeColour");
        } else {
            this.snakeColour = new Colour(0, 255, 0);
        }

        let snakeHead : SnakeHead = new SnakeHead(
            null,
            this.snakeColour,
            this.INIT_COORDS
        )

        this._snakeList = new BiLinkedList(snakeHead, this.snakeColour);
        this.running = true;
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

        // this.changeDotColour()
    }
    protected pushSnake() {
        let head : SnakeHead = this._snakeList.getHead;
        let headCoords : Coordinate = head.coords;
        let bDIM = this.board.getDIM;
        let uDirVector : Vector2D = this.translateToVector(head.direction);

        // Write out of bounds check here. Don't write collision here.
        if ((uDirVector.x + headCoords.getX) > bDIM.getWidth || 0 > ((uDirVector.x + headCoords.getX))) {
            // Throw game over!!
            this.running = false;
        }
        if ((uDirVector.y + headCoords.getY) > bDIM.getHeight || 0 > ((uDirVector.y + headCoords.getY))) {
            // Throw game over!!
            this.running = false;
        }

        // Let snake move forward!
        let newCoords : Coordinate = new Coordinate(
            uDirVector.x + headCoords.getX,
            uDirVector.y + headCoords.getY
        )
        let newHead : SnakeHead = new SnakeHead(null, this.snakeColour, newCoords);
        this._snakeList.changeHead(newHead);
        this._snakeList.insert(head);

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
        return this.running;
    }
}