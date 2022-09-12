class Game {
    constructor() {
        this.canvas = document.getElementById("myCanvas"); // defining essentials.
        this.ctx = this.canvas.getContext("2d");
        this.board = this.fill_board();
        //this.draw_grid(this.ctx);
        this.apple = this.spawn_apple();
        this.render_block(this.apple, "#27d817"); 
    }
    spawn_apple() {
        // This function is used after we figure out the snake has landed on the apple

        /*
                >> Random method

        let block_cordinates = { blkX: 0, blkY: 0 };
        let valid_block = false; // unsure what to call this, defines whether we have found an empty square on the board
        let x = 0, y = 0;
        while (valid_block == false) { // Also highly inefficient, since when reaching high scores this can take a while.
            x = Math.floor((Math.random() * 23) + 1);
            y = Math.floor((Math.random() * 23) + 1);
            if (this.board[y][x] == 0) {
                valid_block = true;
                block_cordinates = { blkX: x, blkY: y };
            }
        }*/

        //     >> Elimination method
        let swiss_board = [];
        var row_index = -1
        this.board.map( column => { 
            /* 
            This is an overcomplicated way of figuring out whether the value is 0 or not.
            When the value is 0, we find the x and y values by counting and then forming a coordinate.
            We can append that value to an array called swiss_board, because it's a coordinate not occupied by the snake.
            This is a more improved version of what I had previously because it doesn't rely on being random.
            */
            var column_index = -1
            row_index++
            column.map( value => {
                column_index++
                if(value == 0){
                    swiss_board.push({blkX:column_index,blkY:row_index})
                }
            });
            
        })
        /* Test
        swiss_board.forEach( value => {
            if(this.board[value.blkY][value.blkX] == 2){
                console.log("Fail!")
            }
        })*/

        return swiss_board[Math.floor(Math.random() * swiss_board.length)]; // 
    }
    fill_board() {
        let board = [] // This is the board, a 2d array in the future that will allow us to quickly find if a coordinate is already occupied.

        if (true) { // Load 0 into every square, this is needed for now since we're using arrays which values act as a cordinate system when filled.

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
    draw_grid() {
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

    move(game) {
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
        if (block_test.out || block_test.in) return false // In case we're out of bounds or inside of ourself

        game.board[this.head_block.blkY][this.head_block.blkX] = 2 // Setting body value on board logically
        game.render_block(this.head_block, this.color) // Renders snake's color by default, this means we're locking to one color and probably can't change it later


        if (block_test.on_apple != true) { // In case we're not on the apple, remove the last child (This causes the animation of the snake moving on the board)
            
            let last_child = this.children.pop();
            game.board[last_child.blkY][last_child.blkX] = 0
            game.render_block(last_child, "#FFF") // Overdraw to white to delete trail
            
        } else {

            game.apple = game.spawn_apple() // When we are on the apple, overwrite the current cordinates 
            game.render_block(game.apple, "#27d817"); 
        
        }
    }
    block_test(game) {
        let response = { out: false, on_apple: false, in:false };

        // Check if the headblock is outside the bounds
        if ((this.head_block.blkX > 23 || this.head_block.blkX < 0) || (this.head_block.blkY > 23 || this.head_block.blkY < 0)) {
            response.out = true;
            return response // We need to return here because stuff can break
        } 

        // Check if we're on the apple
        if (game.apple.blkX == this.head_block.blkX && game.apple.blkY == this.head_block.blkY) {
            response.on_apple = true;
        }

        // Check if the snake's head is inside of itself (remember 2 on the board means body)
        if (game.board[this.head_block.blkY][this.head_block.blkX] == 2) { // We haven't set the value yet, so this is fine
            response.in = true
        }
        
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

    var gameID = setInterval(function () {
        tickPassed = false;
        let valid = snake.move(game) // I think this is better than using a promise method('.then')
        if (valid == false) {
            clearInterval(gameID)
            
            game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        }

    }, 125);
}
