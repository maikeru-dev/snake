class BiLinkedList { // no plans to extend this, final list.
    protected _head : SnakeHead;
    protected _node : SnakeBody;
    protected _snakeColour : Colour;
    protected _size : number; // Could be called score!

    constructor (head : SnakeHead, colour : Colour) {
        this._snakeColour = colour;
        this._head = head;
        this._node = null;
        this._size = 1;
    }
    public increment() : void {
        this._size++;
    }
    public changeHead(newHead:SnakeHead) {
        this._head = newHead;
    }
    public insert(newNode : SnakeBody) {
        newNode.next = this._node;
        this._node = newNode;
        this._head.next = newNode; // Head, at this point, is new.
    }
    public removeLast() : SnakeBody {
        let lastNode : SnakeBody;
        let currentNode;

        currentNode = this._node;
        while (currentNode.next.next != null) {
            currentNode = this._node.next;
        }
        lastNode = {...currentNode} as SnakeBody; // <-- this is hella cool
        currentNode = null;
        return lastNode;
    }
    public checkCollisions() : CollisionType {
        let head = this._head;
        let currentNode = this._node;
        let foundCollision = false;

        while (currentNode.next.next != null && !foundCollision) {
            if (currentNode.coords == head.coords) {
                foundCollision = true; // We do not need to know where this collision happened, yet.
            } else {
                currentNode = currentNode.next;
            }
        }
        return foundCollision ? CollisionType.TOUCH : CollisionType.NONE;
    }
    get getHead() : SnakeHead {
        return this._head;
    }
    public fetchFirstMatch(coords : Coordinate) : Coordinate | null {
        let currentNode : SnakeBody = this._head;
        let foundNode : SnakeBody = null;

        while (foundNode == null) {
            if (coords == currentNode.coords) {
                foundNode = currentNode;
            }
        }

        return foundNode.coords;
    }
}