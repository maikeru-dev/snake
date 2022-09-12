class Game {
    constructor() {
        this.canvas = document.getElementById("myCanvas"); // defining essentials.
        this.ctx = this.canvas.getContext("2d");
        this.board = this.fill_board()
        this.draw_board(this.ctx)
        this.apple = this.spawn_apple();
    }
    spawn_apple() {
        // This function is used after we figure out the snake has landed on the apple
        let block_cordinates = { blkX: 0, blkY: 0 };
        let valid_block = false; // unsure what to call this, defines whether we have found an empty square on the board
        let x = 0, y = 0;
        while (valid_block == false) {
            x = Math.floor((Math.random() * 23) + 1);
            y = Math.floor((Math.random() * 23) + 1);
            if (this.board[x][y] == 0) {
                valid_block = true;
                block_cordinates = { blkX: x, blkY: y };
            }
        }
        return block_cordinates;
    }
    fill_board() {
        let board = [] // this is the board, a 2d array in the future that will allow us to quickly find if a coordinate is already occupied.

        if (true) { // Load 0 into every square, this is needed for now

            for (let yAxis = 0; yAxis < 24; yAxis++) {
                board[yAxis] = []
                for (let xAxis = 0; xAxis < 24; xAxis++) {
                    board[yAxis][xAxis] = 0
                }
                // 0 means nothing, 1 means apple, 2 means body
            }

        }
        return board
    }
    draw_board() {
        var x = 0, y = 0;
        this.ctx.beginPath();
        for (var i = 0; i < 25; i++) { // this generates a grid in the canvas
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, 600);
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(600, y);
            y += 25
            x += 25
        }
        this.ctx.stroke();
    }
    render_block(block, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(block.blkX * 25 + 1, block.blkY * 25 + 1, 23, 23);
    }

}

class Snake {
    constructor(head_block, current_direction, snake_color) {
        this.head_block = head_block || { blkX: 12, blkY: 12 };
        this.color = snake_color || "#FF0000";
        this.direction = current_direction || "up";
        this.children = [{ blkX: 12, blkY: 13 }];
    }

    async move(game) {
        // Adding head to children's beginning 
        this.children.unshift({ blkX: this.head_block.blkX, blkY: this.head_block.blkY }) // Copying without reference

        // On new tick, change the snake's position
        switch (this.direction) {
            case "up":
                this.head_block.blkY -= 1;
                break;
            case "down":
                this.head_block.blkY += 1;
                break;
            case "left":
                this.head_block.blkX -= 1;
                break;
            case "right":
                this.head_block.blkX += 1;
                break;
        }
        let block_test = this.block_test(game)
        if (block_test.out) return false // In case we're out of bounds

        game.board[this.head_block.blkY][this.head_block.blkX] = 2 // Setting body value on board logically
        game.render_block(this.head_block, this.color) // Renders snake's color by default, this means we're locking to one color and probably can't change it later


        if (block_test.on_apple != true) { // In case we're not on the apple, remove the last child
            let last_child = this.children.pop();
            game.board[last_child.blkY][last_child.blkX] = 0
            game.render_block(last_child, "#FFF") // Overdraw to white
        } else {
            game.apple = game.spawn_apple() // When we are on the apple, overwrite the current cordinates 
        }
    }
    block_test(game) {
        let response = { out: false, on_apple: false };

        if (game.apple.blkX == this.head_block.blkX && game.apple.blkY == this.head_block.blkY) {
            response.on_apple = true;
            
        }
        // Check if the headblock is outside the bounds
        if ((this.head_block.blkX > 23 || this.head_block.blkX < 0) || (this.head_block.blkY > 23 || this.head_block.blkY < 0)) {
            response.out = true;
            
        }
        if (game.board[this.head_block.blkX][this.head_block.blkY]) {
            response.out = true
        }
        /*for(child in this.children){
            if(child.blockX == head_block.blockX && child.blockY == head_block.blockY){
                // Init Gameover
                return true
            }
        }*/ // This might not even be necessary
        return response;
    }
}



// Notes
/*
There's two systems of figuring out where the snake's body is.

*/


function main() {
    let tickPassed = false; // tick passed is used to gatekeep changing directions after one has already been made.
    var game = new Game()
    var snake = new Snake()

    document.addEventListener('keydown', (event) => {
        event.preventDefault(); // Stops scrolling when using arrow keys
        if (tickPassed == true) return
        var direction = snake.direction
        if (event.code === "ArrowUp" && direction !== "down") direction = "up"
        else if (event.code === "ArrowDown" && direction !== "up") direction = "down"
        else if (event.code === "ArrowLeft" && direction !== "right") direction = "left"
        else if (event.code === "ArrowRight" && direction !== "left") direction = "right"
        snake.direction = direction
        tickPassed = true // this prevents the player from changing the direction in a tick.
    });

    const gameID = setInterval(function () {
        tickPassed = false;
        game.render_block(game.apple, "#27d817"); // why not ?
        let valid = snake.move(game)
        if (valid == false) {
            clearInterval(gameID)
        }

    }, 125);
}
