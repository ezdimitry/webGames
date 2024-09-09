const bird = document.getElementById('bird');
const gameContainer = document.getElementById('gameContainer');
let score = 0;
let controlMode = 'keyboard';

const gravity = 0.5;
let velocity = 0;
const lift = -7;

let pipes = [];
const pipeWidth = 60;
const gap = 150; 

document.getElementById('keyboard-control').onclick = () => controlMode = 'keyboard';
document.getElementById('mouse-control').onclick = () => controlMode = 'mouse';

document.addEventListener('keydown', function (e) {
    if (controlMode === 'keyboard' && e.code === 'Space') {
        velocity = lift;
    }
});

document.addEventListener('mousemove', function (e) {
    if (controlMode === 'mouse') {
        let rect = gameContainer.getBoundingClientRect();
        bird.style.top = `${e.clientY - rect.top - bird.offsetHeight / 2}px`;
        velocity = 0;
    }
});

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (gameContainer.offsetHeight - gap));
    
    
    const topPipe = document.createElement('div');
    topPipe.classList.add('pipe');
    topPipe.style.height = `${pipeHeight}px`;
    topPipe.style.top = '0';
    topPipe.style.left = `${gameContainer.offsetWidth}px`;
    gameContainer.appendChild(topPipe);
    
    
    const bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe');
    bottomPipe.style.height = `${gameContainer.offsetHeight - pipeHeight - gap}px`;
    bottomPipe.style.bottom = '0';
    bottomPipe.style.left = `${gameContainer.offsetWidth}px`;
    gameContainer.appendChild(bottomPipe);

    pipes.push({ topPipe, bottomPipe, x: gameContainer.offsetWidth });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;
        pipe.topPipe.style.left = `${pipe.x}px`;
        pipe.bottomPipe.style.left = `${pipe.x}px`;

        
        if (pipe.x + pipeWidth < 0) {
            pipe.topPipe.remove();
            pipe.bottomPipe.remove();
            pipes.shift();
            score++;
            document.getElementById('score').innerText = `Очки: ${score}`;
        }

        
        const birdRect = bird.getBoundingClientRect();
        const topPipeRect = pipe.topPipe.getBoundingClientRect();
        const bottomPipeRect = pipe.bottomPipe.getBoundingClientRect();
        
        if (
            (birdRect.right > topPipeRect.left && birdRect.left < topPipeRect.right &&
            birdRect.top < topPipeRect.bottom) || 
            (birdRect.right > bottomPipeRect.left && birdRect.left < bottomPipeRect.right &&
            birdRect.bottom > bottomPipeRect.top)
        ) {
            resetGame();
        }
    });

    if (pipes.length === 0 || pipes[pipes.length - 1].x < gameContainer.offsetWidth - 300) {
        createPipe();
    }
}

function update() {
    let birdTop = parseInt(bird.style.top) || 150;
    if (controlMode === 'keyboard') {
        velocity += gravity;
        bird.style.top = `${birdTop + velocity}px`;
    }

    if (birdTop + bird.offsetHeight > gameContainer.offsetHeight || birdTop < 0) {
        resetGame();
    }

    updatePipes();
}

function resetGame() {
    bird.style.top = '150px';
    velocity = 0;
    pipes.forEach(pipe => {
        pipe.topPipe.remove();
        pipe.bottomPipe.remove();
    });
    pipes = [];
    score = 0;
    document.getElementById('score').innerText = `Очки: 0`;
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

resetGame();
gameLoop();