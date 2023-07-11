class SnakeBody implements Dot {
    coords : Coordinate;
    colour : Colour;
    next : SnakeBody;
    previous : SnakeBody;

    constructor(previous : SnakeBody, next : SnakeBody, colour : Colour, coords : Coordinate) {
        this.next = next;
        this.previous = previous;
        this.colour = colour;
        this.coords = coords;
    }
    get getCoords() {
        return this.coords;
    }
    get getColour() {
        return this.colour;
    }
}