
class Game2D {

    protected renderer : Renderer2D;
    protected board : Board2D;
    protected config : Configuration;
    protected config_PATH_FILE : string = './gameconfig.json';
    constructor () {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;

        if (canvas == null) {
            throw new DOMException("Canvas element doesn't exist!", "nullCanvasElement")
        }

        this.renderer = new Renderer2D(canvas.getContext("2d"), this.board, this.config);
    }
    protected changeDotColour (dot : Dot, newColour : Colour)  {
        dot.colour = newColour;
    }

}