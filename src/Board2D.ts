class Board2D {
    protected _dots : Dot[];
    protected _DIM : Dimension;
    constructor(CONFIG : Configuration) {
        if (Configuration.has(["dots_width", "dots_height"], CONFIG)) {
            this._DIM = new Dimension(
                CONFIG.getValue("dots_width"),
                CONFIG.getValue("dots_height")
            );
        } else {
            this._DIM = new Dimension(
                // Define default to have 64 by 64 pixels/dots.
                64, 64
            )
        }
    }
    get getDIM() : Dimension {
        return this._DIM;
    }
    get getDots() : Dot[] {
        return this._dots;
    }
}