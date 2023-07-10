class Dimension {
    protected height : number;
    protected width : number;

    constructor(width : number , height : number) {
        this.height = height;
        this.width = width;
    }
    get getHeight() : number {
        return this.height;
    }
    get getWidth() : number {
        return this.width;
    }
}