const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const spaceship = {
    x: canvas.width / 2 - 35,
    y: canvas.height - 80,
    width: 70, 
    height: 90, 
    speed: 7, 
    image: new Image()
};
spaceship.image.src = "ship.png";

const bullets = [];
const asteroids = [];
const asteroidSpeed = 2;
let score = 0;
let gameOver = false;

// Controls
document.addEventListener("keydown", (e) => {
    if (!gameOver) {
        if (e.key === "ArrowLeft" && spaceship.x > 0) {
            spaceship.x -= spaceship.speed;
        }
        if (e.key === "ArrowRight" && spaceship.x + spaceship.width < canvas.width) {
            spaceship.x += spaceship.speed;
        }
        if (e.key === " " || e.key === "ArrowUp") {
            bullets.push({ x: spaceship.x + 30, y: spaceship.y, speed: 7 });
        }
    }
});

// Game Loop
function update() {
    if (score >= 150) {
        gameOver = true;
    }

    if (gameOver) return; 

    // Move bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    // Generate asteroids
    if (Math.random() < 0.02) {
        asteroids.push({ x: Math.random() * (canvas.width - 40), y: -40, width: 40, height: 40 });
    }

    // Move asteroids
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].y += asteroidSpeed;
        if (asteroids[i].y > canvas.height) {
            asteroids.splice(i, 1);
        }
    }

    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < asteroids.length; j++) {
            if (
                bullets[i].x < asteroids[j].x + asteroids[j].width &&
                bullets[i].x + 5 > asteroids[j].x &&
                bullets[i].y < asteroids[j].y + asteroids[j].height &&
                bullets[i].y + 10 > asteroids[j].y
            ) {
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                score += 10;
                break;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        setTimeout(() => {
            window.open("victory.html", "_self");
        }, 500);
        return;
    }

    ctx.drawImage(spaceship.image, spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    ctx.fillStyle = "white";
    bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });

    asteroids.forEach((asteroid) => {
        let asteroidImg = new Image();
        asteroidImg.src = "asteroid.png";  // Ensure this file exists
        ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    });

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillStyle = "cyan";
    ctx.font = "40px Century Gothic";
    ctx.fillText("Destroy 15 Asteroids to win!", 10, 70);

     
}

canvas.addEventListener("click", function (event) {
    if (gameOver) {
        let rect = canvas.getBoundingClientRect(); // Get correct canvas position
        let clickX = event.clientX - rect.left;
        let clickY = event.clientY - rect.top;

        let buttonX = canvas.width / 2 - 75;
        let buttonY = canvas.height / 2 + 40;
        let buttonWidth = 150;
        let buttonHeight = 40;

        console.log("Click detected at:", clickX, clickY); // Debugging

        if (
            clickX >= buttonX &&
            clickX <= buttonX + buttonWidth &&
            clickY >= buttonY &&
            clickY <= buttonY + buttonHeight
        ) {
            console.log("Button Clicked! Redirecting..."); // Debugging
            window.location.href = "spacestation.html"; // Redirect to homepage
        }
    }
});


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
