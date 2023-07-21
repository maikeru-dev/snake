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
    public printList() {
        let index = 0;
        let currentNode : SnakeBody = this._node;
        console.log("index : 0", this._head);
        if (this._head == this._node) console.log("head and top node is the same??");
        while (currentNode != null) {
            index++;
            console.log("index : " + index + " ", this._node);
            currentNode = currentNode.next;
        }
    }
    public changeHead(newHead:SnakeHead) {
        this._head = newHead;
    }
    public insert(newNode : SnakeBody) {
        this.link(newNode, this._node); // node1 => node2 | newNode => node
        this._node = newNode as SnakeBody; // Replace.
        this.link(this._head, this._node); //  head => newNode => node => ...
        this._size++;
    }
    private link (node1 : SnakeBody, node2 : SnakeBody) {
        node1.next = node2;
        if (node2 != null) node2.previous = node1;
    }
    public removeLast() : SnakeBody {
        let lastNode : SnakeBody;
        let currentNode;

        this.printList();
        currentNode = this._node;
        if (currentNode.next != null) {
            while (currentNode.next.next != null) {
                currentNode = currentNode.next;
            }
        }

        lastNode = {...currentNode} as SnakeBody; // <-- this is hella cool
        currentNode.next = null; // Remove tail.
        this._size--;

        this.printList()
        return lastNode;
    }
    public checkCollisions() : CollisionType {
        let head = this._head;
        let currentNode = this._node;
        let foundCollision = false;

        while (currentNode != null && !foundCollision) {
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
            }else {
                if (currentNode.next != null) {
                    currentNode = currentNode.next;
                } else {
                    return null;
                }
            }
        }

        return foundNode.coords;
    }
}