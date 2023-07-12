
class Game2D {
    protected _perf : Performance;
    protected _renderer : Renderer2D;
    protected _board : Board2D;
    protected _config : Configuration;
    protected _running : boolean = false;
    protected _config_PATH_FILE : string = './gameconfig.json';
    constructor () {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;

        if (canvas == null) {
            throw new DOMException("Canvas element doesn't exist!", "nullCanvasElement")
        }

        this._perf = new Performance();
        this._renderer = new Renderer2D(canvas.getContext("2d"), this._board, this._config);
    }
    protected changeDotColour (dot : Dot, newColour : Colour)  {
        dot.colour = newColour;
    }

}