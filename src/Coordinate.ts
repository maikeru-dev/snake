class Coordinate {
    protected x : number;
    protected y : number;
    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
    get getX() : number {
        return this.x;
    }
    get getY() : number {
        return this.y;
    }
}
