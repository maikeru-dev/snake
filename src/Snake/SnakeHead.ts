class SnakeHead extends SnakeBody {
    direction : Direction;
    constructor(next : SnakeBody, colour : Colour, coords : Coordinate) {
        super(null, next, colour, coords);
    }
}
