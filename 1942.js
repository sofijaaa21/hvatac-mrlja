var score = 0;
var hero = {   
    x: 300,
    y: 400,
    width: 20,
    height: 20,
    speed: 10
};

var enemies = [
    {x: 50, y: 50}, 
    {x: 250, y: 50}, 
    {x: 450, y: 250}, 
    {x: 550, y: 250}
];

var bullets = [];
var keys = {}; 

function displayHero() { 
    const heroElement = document.getElementById('hero');
    if (heroElement) {
        heroElement.style.top = hero.y + "px";
        heroElement.style.left = hero.x + "px";
    }
}

function displayEnemies() {
    var output = '';
    for (var i = 0; i < enemies.length; i++) {
        output += `<div class='enemy1' style='top:${enemies[i].y}px; left:${enemies[i].x}px;'></div>`;
    }
    document.getElementById('enemies').innerHTML = output;
}

function moveEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].y += 5;
        if (enemies[i].y > 480) {
            enemies[i].y = 0;
            enemies[i].x = Math.random() * 980;
        }
    }
}

function moveBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].y -= 5;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function displayBullets() {
    var output = '';
    for (var i = 0; i < bullets.length; i++) {
        output += `<div class='bullet' style='top:${bullets[i].y}px; left:${bullets[i].x}px;'></div>`; 
    }
    document.getElementById('bullets').innerHTML = output;
}

function displayScore() {
    document.getElementById('score').innerHTML = "Score: " + score;  
}



function gameLoop() {
    moveEnemies();
    moveBullets();
    detectCollision();
    respawnEnemies(); // Dodaj ovu liniju

    displayHero();
    displayEnemies();
    displayBullets();
    displayScore();
}


function moveHero(direction) {
    const maxWidth = 1000;
    const maxHeight = 563;

    if (direction === "up" && hero.y > 0) {
        hero.y -= hero.speed;
    } else if (direction === "down" && hero.y + hero.height < maxHeight - 120) {
        hero.y += hero.speed;
    } else if (direction === "left" && hero.x > 30) {
        hero.x -= hero.speed;
    } else if (direction === "right" && hero.x + hero.width < maxWidth - 120) {
        hero.x += hero.speed;
    }
}

function detectCollision() {
    for (var i = 0; i < bullets.length; i++) {
        for (var j = 0; j < enemies.length; j++) {
            if (Math.abs(bullets[i].x - enemies[j].x) < 30 && Math.abs(bullets[i].y - enemies[j].y) < 30) {
                score += 10;
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                i--; 
                break;
            }
        }
    }
}

document.onkeydown = function(event) {
    keys[event.key] = true;
};

document.onkeyup = function(event) {
    keys[event.key] = false;
};

function updateGame() {
    if (keys["ArrowUp"]) moveHero("up");
    if (keys["ArrowDown"]) moveHero("down");
    if (keys["ArrowLeft"]) moveHero("left");
    if (keys["ArrowRight"]) moveHero("right");
    if (keys[" "]) {
        bullets.push({x: hero.x + hero.width / 2 - 2, y: hero.y - 10});

        const shootSound = document.getElementById("shoot-sound");
        if (shootSound) {
            shootSound.currentTime = 0;
            shootSound.play();
        }

        keys[" "] = false;
    }
}

document.addEventListener("keydown", function(event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        shootBullet();
    }
});

function simulateSpace() {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: " " }));
}

let interval = setInterval(() => {
    updateGame();
    gameLoop();
}, 20);

setTimeout(() => {
    clearInterval(interval);
    showEndMessage();
}, 20000);

function showEndMessage() {
    let popup = document.createElement("div");
    popup.innerText = "KRAJ, score je: " + score;
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "black";
    popup.style.color = "white";
    popup.style.padding = "20px";
    popup.style.fontSize = "24px";
    popup.style.borderRadius = "10px";
    popup.style.textAlign = "center";
    popup.style.zIndex = "1000";
    document.body.appendChild(popup);
}

function respawnEnemies() {
    if (enemies.length === 0) {
        enemies = [
            {x: 50, y: 50}, 
            {x: 250, y: 50}, 
            {x: 450, y: 250}, 
            {x: 550, y: 250}
        ];
    }
}


displayHero(); 
displayEnemies();
