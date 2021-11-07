var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = 0,y = 0;
var tickPassed = false;
var useBrokenNumberGrid = false;
ctx.beginPath();
ctx.font = "15px Verdana";
for(var i = 0; i < 25;i++){
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    y+=25
    x+=25
}
ctx.stroke();
if(useBrokenNumberGrid == true){
    ctx.fillText(`1`,0,0)
    for(p = 1; p < 25;p++){
        for(i = 0; i < 24;i++){
            ctx.fillText(`${i}`,i*25+3,25*p-3)
        }
    }
}
var snake={HeadBlock:{x:300,y:300}, color:"#FF0000", direction:"up", children:[{x:300,y:325}]}
var point={HeadBlock:{x:300,y:300}, color:"#27d817"}
function drawBlock(color,block){
    ctx.fillStyle = color;
    ctx.fillRect(block.x+1,block.y+1,23,23);
}
function coordinateToBlock(cx,cy){
    if(cx == null || cy== null) return false;
    return {x:cx,y:cy,blockX:cx/25,blockY:cy/25};
}
function moveSnake(){
    drawBlock(snake.color,snake.HeadBlock)
    if(snake.children.length > 0){
        const n = snake.children[snake.children.length-1]
        if(n != snake.children[snake.children.length-2]){
            drawBlock("#fff",coordinateToBlock(n.x,n.y))
        }
       for(var i = snake.children.length-1;i > 0;i--){
            snake.children[i] = snake.children[i-1]
        }
        snake.children[0] = snake.HeadBlock 
    }else{
        drawBlock("#fff",coordinateToBlock(snake.HeadBlock.x,snake.HeadBlock.y))
        
    }
    switch(snake.direction){
        case "left":
            drawBlock(snake.color,coordinateToBlock(snake.HeadBlock.x-25,snake.HeadBlock.y))
            snake.HeadBlock = coordinateToBlock(snake.HeadBlock.x-25,snake.HeadBlock.y)
        break;
        case "right":
            drawBlock(snake.color,coordinateToBlock(snake.HeadBlock.x+25,snake.HeadBlock.y))
            snake.HeadBlock = coordinateToBlock(snake.HeadBlock.x+25,snake.HeadBlock.y)
        break;
        case "up":
            drawBlock(snake.color,coordinateToBlock(snake.HeadBlock.x,snake.HeadBlock.y-25))
            snake.HeadBlock = coordinateToBlock(snake.HeadBlock.x,snake.HeadBlock.y-25)
        break;
        case "down":
            drawBlock(snake.color,coordinateToBlock(snake.HeadBlock.x,snake.HeadBlock.y+25))
            snake.HeadBlock = coordinateToBlock(snake.HeadBlock.x,snake.HeadBlock.y+25)
        break;
    }
}
function checkGameOver(){
    if(snake.HeadBlock.blockX > 23 || snake.HeadBlock.x < 0){
        window.open("./index.html","_self")
    }
    if(snake.HeadBlock.blockY > 23 || snake.HeadBlock.y < 0){
        window.open("./index.html","_self")
    }
    snake.children.forEach(element => {
        if(element.x == snake.HeadBlock.x && element.y == snake.HeadBlock.y){
            window.open("./index.html","_self")
        }
    });
}
function spawnPoint(start){
    if((point.HeadBlock.x == snake.HeadBlock.x && point.HeadBlock.y == snake.HeadBlock.y) || start){
        if(!start){
            snake.children.push(snake.children[snake.children.length-1])
        }
        var b = coordinateToBlock(Math.floor((Math.random()*23)+1)*25,Math.floor((Math.random()*23)+1)*25)
        while(snake.children.forEach(element => {
            if(element.x != b.x && element.y != b.y){
                return false
            }else true
        }) || (b.x == snake.HeadBlock.x && b.y == snake.HeadBlock.y)){
            b = coordinateToBlock(Math.floor((Math.random() * 23)+1)*25,Math.floor((Math.random() * 23)+1)*25)
        }
        console.log(b)
        point.HeadBlock = b
        drawBlock(point.color,point.HeadBlock)
    }
}
function start(){
    document.addEventListener('keyup', (e) => {
        if(tickPassed == true) return
        var n = snake.direction
        if (e.code === "ArrowUp" && n !== "down") n = "up"
        else if (e.code === "ArrowDown" && n !== "up") n = "down"
        else if (e.code === "ArrowLeft" && n !== "right") n = "left"
        else if (e.code === "ArrowRight" && n !== "left") n = "right"
        snake.direction = n
        tickPassed = true
      });
    spawnPoint(true);
    setInterval(function(){ 
        tickPassed = false
        moveSnake();
        spawnPoint();
        checkGameOver();
    }, 125);
}
