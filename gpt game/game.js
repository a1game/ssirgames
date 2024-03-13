const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties
const player = {
    x: 50,
    y: 450,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 5,
    jumpHeight: 100,
    isJumping: false,
    jumpCount: 0,
    xSpeed: 0,
    ySpeed: 0
};

const gravity = 1;

// Event listener for mouse click
document.addEventListener('mousedown', launchPlayer);

// Event listener for keyboard input
document.addEventListener('keydown', movePlayer);

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function launchPlayer(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const launchSpeed = 10;

    player.isJumping = true;
    player.jumpCount = 0;

    player.xSpeed = launchSpeed * Math.cos(angle);
    player.ySpeed = launchSpeed * Math.sin(angle);
}

function movePlayer(event) {
    const keyPressed = event.key.toLowerCase();

    switch (keyPressed) {
        case 'w':
            if (!player.isJumping) {
                player.isJumping = true;
                player.jumpCount = 0;
            }
            break;
        case 'a':
            player.x -= player.speed;
            break;
        case 's':
            // Add code for crouching or other downward movement if needed
            break;
        case 'd':
            player.x += player.speed;
            break;
    }
}

function applyGravity() {
    if (player.isJumping) {
        player.x += player.xSpeed;
        player.y += player.ySpeed;
        player.jumpCount += player.ySpeed;

        if (player.jumpCount >= player.jumpHeight) {
            player.isJumping = false;
        }
    } else if (player.y < canvas.height - player.height) {
        player.y += gravity;
    }
}

function collisionDetection() {
    // Add code for collision detection with platforms or obstacles if needed
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    applyGravity();
    collisionDetection();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();
