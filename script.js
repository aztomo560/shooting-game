document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameArea = document.getElementById('game-area');
    const scoreElement = document.getElementById('score');
    
    let playerX = 180;
    let score = 0;
    let bullets = [];
    let enemies = [];
    let gameLoopInterval;
    let enemySpawnInterval;
    
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        ' ': false
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.code in keys) {
            keys[e.code] = true;
            e.preventDefault();
            if (e.code === ' ' && !e.repeat) {
                shoot();
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.code in keys) {
            keys[e.code] = false;
            e.preventDefault();
        }
    });

    function movePlayer() {
        if (keys.ArrowLeft && playerX > 0) {
            playerX -= 5;
        }
        if (keys.ArrowRight && playerX < 360) {
            playerX += 5;
        }
        player.style.left = playerX + 'px';
    }

    function shoot() {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.style.left = (playerX + 18) + 'px';
        bullet.style.top = '540px';
        gameArea.appendChild(bullet);
        
        bullets.push({
            element: bullet,
            x: playerX + 18,
            y: 540
        });
    }

    function spawnEnemy() {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        const x = Math.random() * 370;
        enemy.style.left = x + 'px';
        enemy.style.top = '0px';
        gameArea.appendChild(enemy);
        
        enemies.push({
            element: enemy,
            x: x,
            y: 0,
            speed: 1 + Math.random() * 2
        });
    }

    function moveBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.y -= 7;
            bullet.element.style.top = bullet.y + 'px';
            if (bullet.y < 0) {
                gameArea.removeChild(bullet.element);
                bullets.splice(i, 1);
            }
        }
    }

    function moveEnemies() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            enemy.y += enemy.speed;
            enemy.element.style.top = enemy.y + 'px';
            if (enemy.y > 600) {
                alert('ゲームオーバー！');
                stopGame();
            }
        }
    }

    function checkCollisions() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (
                    bullet.x > enemy.x &&
                    bullet.x < enemy.x + 30 &&
                    bullet.y > enemy.y &&
                    bullet.y < enemy.y + 30
                ) {
                    gameArea.removeChild(bullet.element);
                    gameArea.removeChild(enemy.element);
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    score += 10;
                    scoreElement.textContent = `スコア: ${score}`;
                    break;
                }
            }
        }
    }

    function gameLoop() {
        movePlayer();
        moveBullets();
        moveEnemies();
        checkCollisions();
    }

    function startGame() {
        bullets = [];
        enemies = [];
        score = 0;
        scoreElement.textContent = 'スコア: 0';
        clearInterval(gameLoopInterval);
        clearInterval(enemySpawnInterval);
        gameLoopInterval = setInterval(gameLoop, 16);
        enemySpawnInterval = setInterval(spawnEnemy, 1500);
    }

    function stopGame() {
        clearInterval(gameLoopInterval);
        clearInterval(enemySpawnInterval);
    }

    startGame();
});
