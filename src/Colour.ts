class Colour {
    protected R : number;
    protected G : number;
    protected B : number;
    constructor (r : number, g : number, b : number) {
        this.R = r;
        this.G = g;
        this.B = b;
    }
    public static compareExact(a : Colour, b : Colour) : boolean {
        if (a.R == b.R) {
            if (a.G == b.G) {
                if (a.B == b.B) {
                    return true;
                }
            }
        }
        return false;
    }
    get getR() {
        return this.R;
    }
    get getG() {
        return this.G;
    }
    get getB() {
        return this.B;
    }
}