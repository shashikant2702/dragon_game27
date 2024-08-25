let score = 0;
let cross = true;
let isPaused = false;
let jumpCount = 0;

const audio = new Audio('music.mp3');
const audiogo = new Audio('gameover.mp3');

setTimeout(() => {
    audio.play();
}, 1000);

document.onkeydown = function (e) {
    if (e.keyCode == 80) { // 'P' key for pause
        isPaused = !isPaused;
        if (isPaused) {
            audio.pause();
            document.querySelector('.obstacle').classList.remove('obstacleAni');
        } else {
            audio.play();
            document.querySelector('.obstacle').classList.add('obstacleAni');
        }
    }

    if (!isPaused) {
        if (e.keyCode == 38 && jumpCount < 2) { // Jump with double jump logic
            jump();
        }
        if (e.keyCode == 39) { // Move Right
            const dino = document.querySelector('.dino');
            let dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
            dino.style.left = dinoX + 112 + "px";
        }
        if (e.keyCode == 37) { // Move Left
            const dino = document.querySelector('.dino');
            let dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
            dino.style.left = (dinoX - 112) + "px";
        }
    }
};

function jump() {
    const dino = document.querySelector('.dino');
    if (!dino.classList.contains('animateDino')) {
        console.log("Jumping..."); // Debug log
        dino.classList.add('animateDino');
        jumpCount++;
        setTimeout(() => {
            console.log("Resetting jump..."); // Debug log
            dino.classList.remove('animateDino');
            if (jumpCount >= 2) {
                jumpCount = 0;
            }
        }, 700); // Ensure this matches the animation duration in CSS
    }
}

setInterval(() => {
    if (!isPaused) {
        const dino = document.querySelector('.dino');
        const gameOver = document.querySelector('.gameOver');
        const obstacle = document.querySelector('.obstacle');

        let dx = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
        let dy = parseInt(window.getComputedStyle(dino, null).getPropertyValue('bottom'));

        let ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
        let oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('bottom'));

        let offsetX = Math.abs(dx - ox);
        let offsetY = Math.abs(dy - oy);

        if (offsetX < 73 && offsetY < 52) {
            gameOver.innerHTML = "Game Over - Play Again";
            obstacle.classList.remove('obstacleAni');
            audiogo.play();
            setTimeout(() => {
                audiogo.pause();
                audio.pause();
            }, 1000);
            setTimeout(() => {
                resetGame();
            }, 3000); // Restart game after 3 seconds
        } else if (offsetX < 145 && cross) {
            score += 1;
            updateScore(score);
            cross = false;
            setTimeout(() => {
                cross = true;
            }, 1000);
            setTimeout(() => {
                let aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
                let newDur = aniDur - 0.1;
                obstacle.style.animationDuration = newDur + 's';
                console.log('New animation duration: ', newDur);
            }, 500);
        }
    }
}, 10);

function updateScore(score) {
    const scoreCont = document.getElementById('scoreCont');
    scoreCont.innerHTML = "Your Score: " + score;
    
    if (score % 10 === 0) { // Change background every 10 points
        document.body.style.backgroundColor = getRandomColor();
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createObstacle() {
    let obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    
    let randomSize = Math.random() * (80 - 50) + 50; // Random size between 50 and 80px
    let randomSpeed = Math.random() * (2 - 1.5) + 1.5; // Random speed
    
    obstacle.style.width = randomSize + 'px';
    obstacle.style.animationDuration = randomSpeed + 's';
    
    document.querySelector('.gameContainer').appendChild(obstacle);
}

setInterval(() => {
    if (!isPaused) {
        createObstacle();
    }
}, 3000); // Create a new obstacle every 3 seconds

function resetGame() {
    score = 0;
    cross = true;
    document.querySelector('.dino').style.left = '50px';
    document.querySelector('.gameContainer').innerHTML = ''; // Remove all obstacles
    audio.play();
}
