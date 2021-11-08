var canvas = document.getElementById("myCanvas"); // defining essentials.
var ctx = canvas.getContext("2d");

var tickPassed = false; // tick passed is used to gatekeep changing directions after one has already been made.
var useBrokenNumberGrid = true; // this is a useless variable.
var board = [] // this is the board, a 2d array in the future that will allow us to quickly find if a coordinate is already occupied.

var x = 0, y = 0;
ctx.beginPath();
ctx.font = "15px Verdana";

for (var i = 0; i < 25; i++) { // this generates a grid in the canvas
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    y += 25
    x += 25
}
ctx.stroke();
if (useBrokenNumberGrid) { // I have no reason to keep this if statement, but it is a testament to the history of my stupidity
    for (xAxis = 0; xAxis < 24; xAxis++) {
        var lane = []
        for (yAxis = 0; yAxis < 23; yAxis++) {
            lane[yAxis] = 0 // 0 means nothing, 1 means apple, 2 means body
        }
        board[xAxis] = lane
    }
}
var snake = { HeadBlock: { blockX:12, blockY:12}, color: "#FF0000", direction: "up", children: [{ blockX: 12, blockY: 13}] }
var point = { HeadBlock: { blockX:0, blockY:0 }, color: "#27d817" }

function drawBlock(color, block) {
    ctx.fillStyle = color;
    ctx.fillRect(block.blockX*25 + 1, block.blockY*25 + 1, 23, 23);
}
function coordinateToBlock(cx, cy) {

    return { x: cx, y: cy, blockX: cx / 25, blockY: cy / 25 };
}
function checkGameOver() {
    if (snake.HeadBlock.blockX > 23 || snake.HeadBlock.blockX < 0) {
        window.open("./index.html", "_self")
    }else if (snake.HeadBlock.blockY > 23 || snake.HeadBlock.blockY < 0) {
        window.open("./index.html", "_self")
    }// basic checks if the snake's head is out of bounds.
    moveSnake(); // we chain the functions to make sure they run in order, it wouldn't matter if they were run like sub-procedures either, so this is ok.
}

function moveSnake() {
    const length = snake.children.length - 1 // This is the index of the last child in the array.

    const cords = snake.children[length] // get the last child in the snake's children array
    board[cords.blockX][cords.blockY] = 0 // sets the cords on the board to nothing aka 0
    drawBlock("#fff", cords) // delete the previous child's position to remove marks

    for (var i = length; i > 0; i--) { // This counts down from the array's length, starting from the index of the last child
        snake.children[i] = snake.children[i - 1] // Example: i = 5: snake.children[5] = snake.children[4], we are shifting, the chain down and eventually the first index is invalid/duplicated.
    }
    snake.children[0] = snake.HeadBlock // we fix the duplication by setting the current headblock to the first child, which makes a new child and allows us to move the children, along with the head.


    var newHeadCords = {blockX:0,blockY:0}

    switch (snake.direction) {
        case "left":
            newHeadCords = {blockX:snake.HeadBlock.blockX - 1, blockY:snake.HeadBlock.blockY};
            break;
        case "right":
            newHeadCords = {blockX:snake.HeadBlock.blockX + 1, blockY:snake.HeadBlock.blockY};
            break;
        case "up":
            newHeadCords = {blockX:snake.HeadBlock.blockX, blockY:snake.HeadBlock.blockY - 1};
            break;
        case "down":
            newHeadCords = {blockX:snake.HeadBlock.blockX, blockY:snake.HeadBlock.blockY + 1};
            break;
    }
    snake.HeadBlock = newHeadCords;
    if (board[newHeadCords.blockX][newHeadCords.blockY]+2 > 3){ // This checks if the new coordinates intefere with a child
        window.open("./index.html", "_self");
    }else{
        board[newHeadCords.blockX][newHeadCords.blockY] += 2; // adds 2 so in the future, the program can check whether the snake has it's head up its ass
        drawBlock(snake.color, newHeadCords);
        spawnPoint();
    }
    
}
function spawnPoint(start) {
    if((point.HeadBlock.blockX == snake.HeadBlock.blockX && point.HeadBlock.blockY == snake.HeadBlock.blockY) || start){
        if(!start){
            snake.children.push(snake.children[snake.children.length-1]) // This is what adds children to the snake, by coping the final child and duplicating it into the array.
        }
        var newPointCords = {blockX:Math.floor((Math.random() * 23) + 1), blockY:Math.floor((Math.random() * 23) + 1) }
        while(board[newPointCords.blockX][newPointCords.blockY] != 0){
            newPointCords = {blockX:Math.floor((Math.random() * 23) + 1), blockY:Math.floor((Math.random() * 23) + 1)}
            // this generates the coordinates for the apple randomly, this isn't very efficient because in later stages of the game, it will have to loop this far more times.
        }
        console.log("New apple is successfully created at: ", newPointCords)
        point.HeadBlock = newPointCords
        board[newPointCords.blockX][newPointCords.blockY] = 1 // this declares an apple on the board
        drawBlock(point.color, point.HeadBlock)
    }
}
function start() {
    document.addEventListener('keyup', (e) => {
        if (tickPassed == true) return
        var direction = snake.direction
        if (e.code === "ArrowUp" && direction !== "down") direction = "up"
        else if (e.code === "ArrowDown" && direction !== "up") direction = "down"
        else if (e.code === "ArrowLeft" && direction !== "right") direction = "left"
        else if (e.code === "ArrowRight" && direction !== "left") direction = "right"
        snake.direction = direction 
        tickPassed = true // this prevents the player from changing the direction in a tick.
    });
    spawnPoint(true);
    setInterval(function () {
        tickPassed = false
        checkGameOver();
    }, 125);
}
