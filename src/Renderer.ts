class Renderer2D {
    protected _CTX : CanvasRenderingContext2D;
    protected _board : Board2D;
    protected _DIM : Dimension;
    protected _backgroundColour : Colour; // This could also be called the outline.
    protected _gapSize : number;
    protected _DOT_DIM : Dimension; // This is the size of the square that is defined to be a pixel/dot.
    protected _blank_colour : Colour = new Colour(255, 255, 255); // White???
    constructor(CTX : CanvasRenderingContext2D, board : Board2D, CONFIG : Configuration) { // board should be passed by reference!
        this._CTX = CTX;
        this._board = board;
        this._DIM = new Dimension(CTX.canvas.width, CTX.canvas.height);

        let boardDIM = this._board.getDIM;

        if (Configuration.has(["render_gap"], CONFIG)) {
            this._gapSize = CONFIG.getValue("render_gap")
        } else this._gapSize = 1; // 1 pxl

        this._DOT_DIM = new Dimension(
            this._DIM.getWidth / boardDIM.getWidth,
            this._DIM.getHeight / boardDIM.getHeight
        )
    }
    get getCTX () : CanvasRenderingContext2D {
        return this._CTX;
    }
    public generateColour(red : number, blue : number, green : number) : Colour {
        if ((red > 255 || red < 0) || (blue > 255 || blue < 0) || (green > 255 || green < 0)) {
            throw new Error("generateColour is producing an out of range colour!");
        }
        return new Colour(red, blue, green);
    }
    public update() : void { // big draw!
        let x : number;
        let y : number;
        let boardDIM = this._board.getDIM;
        const width : number = boardDIM.getWidth;
        const height : number = boardDIM.getHeight;

        this._CTX.fillStyle = `rgb(${this._backgroundColour.getR},
                                   ${this._backgroundColour.getG}, 
                                   ${this._backgroundColour.getB})`;

        this._CTX.fillRect(0,0, this._DIM.getWidth, this._DIM.getHeight);

        for ( y = 0; y < height; y++ ) {
            for ( x = 0; x < width; x++ ) {
              this.draw(this._board.getDots[x + y*width]);
            }
        }

    }
    private draw(dot : Dot) : void {
        // TODO : CANVAS SIZE MUST BE DETERMINED : DONE
        // TODO : DOT SIZE MUST BE DEFINED : DONE
        // TODO : CREATE AND UTILIZE A JSON CONFIG : ALMOST DONE, HAS DEFAULTS
        let coords = dot.coords;
        let colour = `rgb(
                                ${dot.colour.getR},
                                ${dot.colour.getG},
                                ${dot.colour.getB})`
        let gap = this._gapSize;
        let dotDIM = this._DOT_DIM;
        let ctx = this._CTX;
        // Draw at coordinate, converted to a rectangle on the canvas

        ctx.fillStyle = colour;
        ctx.fillRect(
            gap*(coords.getX) + (coords.getX*dotDIM.getWidth),
            gap*(coords.getY) + (coords.getY*dotDIM.getHeight),
            dotDIM.getWidth - gap,
            dotDIM.getHeight - gap
        )
    }
    public clearDot(dot : Dot) {
        this.updateDot(dot, this._blank_colour);
    }
    public updateDot(dot : Dot, colour : Colour) : void {
        dot.colour = colour;
        this.draw(dot); // skip updating, only necessary when drawing big!
    }
}