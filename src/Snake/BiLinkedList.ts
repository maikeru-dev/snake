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
        this._head.next = newNode;
    }
    public removeLast() : SnakeBody {
        let currentNode : SnakeBody = structuredClone(this._node);
        let lastNode;
        while (currentNode.next.next != null) {
            currentNode = currentNode.next;
        }
        lastNode = JSON.parse(JSON.stringify(currentNode.next)); // dodging the reference bullshit
        currentNode.next = null;
        return lastNode;
    }
    get getHead() : SnakeHead {
        return this._head;
    }
}