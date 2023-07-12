class SnakeHead extends SnakeBody {
    direction : Direction;
    constructor(next : SnakeBody, colour : Colour, coords : Coordinate, direction : Direction) {
        super(null, next, colour, coords);
        this.direction = direction;
    }
}
