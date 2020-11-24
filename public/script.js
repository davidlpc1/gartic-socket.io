document.addEventListener('DOMContentLoaded', () => {

    const socket = io.connect();
    const inputColor = document.querySelector('#input-color')
    inputColor.addEventListener('change', event => {
        context.strokeStyle = inputColor.value;
    })

    const brush = {
        active: false,
        moving:false,
        pos:{ x:0, y:0 },
        prevPos: null,
    }

    const screen = document.querySelector('#screen');
    const context = screen.getContext('2d');

    screen.width = 700;
    screen.height = 580;

    context.lineWidth = 5;
    context.strokeStyle = inputColor.value;

    function drawLine(line){
        context.beginPath();
        context.moveTo(line.prevPos.x, line.prevPos.y);
        context.lineTo(line.pos.x, line.pos.y);
        context.stroke();
    }

    screen.addEventListener('mousedown',() => {
        brush.active = true;
    })

    screen.addEventListener('mouseup',() => {
        brush.active = false;
    })

    screen.addEventListener('mousemove',event => {
        brush.pos.x = event.clientX;
        brush.pos.y = event.clientY;
        brush.moving = true;
    })

    socket.on('draw',line => {
        drawLine(line);
    })

    function cicle(){
        const userIsDrawing = brush.active && brush.moving && brush.prevPos;

        if(userIsDrawing){
            socket.emit('draw',{
                pos:brush.pos,
                prevPos:brush.prevPos
            })
            // drawLine({
            //     pos:brush.pos,
            //     prevPos:brush.prevPos
            // });
            brush.moving = false;
        }

        brush.prevPos = { ...brush.pos }
    
    }

    document.body.addEventListener('keyup', ({ keyCode }) => {
        if(keyCode === 32){
            socket.emit('delete_draw')
        }
    })

    socket.on('delete',() => {
        context.clearRect(0, 0, screen.width, screen.height);
    })

    setInterval(cicle,10);
})

