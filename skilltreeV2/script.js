//canvas
const canvas = document.getElementById('lines');
const ctx = canvas.getContext('2d');

//set canvas size to parent div size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

//draw lines
function drawLine(x1, y1, x2, y2, percentFilled = 0) {

    //stroke size
    ctx.lineWidth = 10;
    //stroke color
    ctx.strokeStyle = '#080300';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    //draw filled line
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#11f713';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + (x2 - x1) * percentFilled, y1 + (y2 - y1) * percentFilled);
    ctx.stroke();

    //fill the rest of the line
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#49494a';
    ctx.beginPath();
    ctx.moveTo(x1 + (x2 - x1) * percentFilled, y1 + (y2 - y1) * percentFilled);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

drawLine(50, 0, 50, 200, 0.0);
drawLine(100, 0, 100, 200, 0.2);
drawLine(150, 0, 150, 200, 0.4);
drawLine(200, 0, 200, 200, 0.6);
drawLine(250, 0, 250, 200, 0.8);
drawLine(300, 0, 300, 200, 1.0);

function enableDragScroll(element) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let startY;
    let scrollTop;

    element.addEventListener('mousedown', (e) => {
        isDown = true;
        element.classList.add('active');
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
        startY = e.pageY - element.offsetTop;
        scrollTop = element.scrollTop;
    });

    element.addEventListener('mouseleave', () => {
        isDown = false;
        element.classList.remove('active');
    });

    element.addEventListener('mouseup', () => {
        isDown = false;
        element.classList.remove('active');
    });

    element.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - element.offsetLeft;
        const walkX = (x - startX);
        element.scrollLeft = scrollLeft - walkX;

        const y = e.pageY - element.offsetTop;
        const walkY = (y - startY);
        element.scrollTop = scrollTop - walkY;
    });
}

enableDragScroll(document.getElementById('skills'));