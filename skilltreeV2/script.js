//canvas
const canvas = document.getElementById('lines');
const ctx = canvas.getContext('2d');

//set canvas size to parent div size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

//draw lines
function drawLine(x1, y1, x2, y2) {

    //stroke size
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

drawLine(0, 0, 200, 200);
drawLine(200, 200, 400, 0);
drawLine(400, 0, 600, 200);
drawLine(600, 200, 800, 0);

drawLine(200, 300, 1000, 1000);
drawLine(1000, 1000, 1200, 800);
drawLine(1200, 800, 1400, 1000);

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