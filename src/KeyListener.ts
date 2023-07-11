class KeyListener {
    protected keys : Keycodes[];
    protected keyUpListener = (event : KeyboardEvent) => {

        for (let key in this.keys) {

        }
    }
    protected keyDownListener = (event : KeyboardEvent) => {

    }
    constructor(keys : Keycodes[]) {
        this.keys = keys;
    }
    public init() : void {
        document.addEventListener('keyup', this.keyUpListener);
        document.addEventListener('keyup', this.keyDownListener);
        // document.addEventListener('keypress') <- deprecated

    }
    public removeListeners() {
        document.removeEventListener('keyup', this.keyUpListener);
        document.removeEventListener('keyup', this.keyDownListener);
    }
}