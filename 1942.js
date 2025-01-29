var score = 0;
var hero = {   
    x: 300,
    y: 400,
    width: 20, // Dodata širina heroja
    height: 20, // Dodata visina heroja
    speed: 10 // Brzina heroja
};

var enemies = [
    {x: 50, y: 50}, 
    {x: 250, y: 50}, 
    {x: 450, y: 250}, 
    {x: 550, y: 250}
];

var bullets = [];
var keys = {}; // Praćenje pritisnutih tastera

function displayHero() { 
    const heroElement = document.getElementById('hero');
    heroElement.style.top = hero.y + "px";
    heroElement.style.left = hero.x + "px";
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

        if (enemies[i].y > 480) { // Kada neprijatelj izađe iz okvira
            enemies[i].y = 0;
            enemies[i].x = Math.random() * 980; // Nasumična nova pozicija
        }
    }
}

function moveBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].y -= 5;

        if (bullets[i].y < 0) {
            bullets.splice(i, 1); // Uklanjanje metka ako izađe iz okvira
            i--; // Korekcija indeksa nakon uklanjanja
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

    displayHero();
    displayEnemies();
    displayBullets();
    displayScore();
}

function moveHero(direction) {
    const maxWidth = 1000; // Maksimalna širina ekrana
    const maxHeight = 563; // Maksimalna visina ekrana

    if (direction === "up" && hero.y > 0) {
        hero.y -= hero.speed;
    } else if (direction === "down" && hero.y + hero.height < maxHeight-120) {
        hero.y += hero.speed;
    } else if (direction === "left" && hero.x > 30) {
        hero.x -= hero.speed;
    } else if (direction === "right" && hero.x + hero.width < maxWidth-120) {
        hero.x += hero.speed;
    }
}

function detectCollision() {
    for (var i = 0; i < bullets.length; i++) {
        for (var j = 0; j < enemies.length; j++) {
            if (Math.abs(bullets[i].x - enemies[j].x) < 30 && Math.abs(bullets[i].y - enemies[j].y) < 30) {
                console.log('bullet', i, 'and enemy', j, 'collided');
                score += 10;

                enemies.splice(j, 1);
                bullets.splice(i, 1);
                i--; // Korekcija indeksa metaka
                break;
            }
        }
    }
}

document.onkeydown = function(event) {
    keys[event.key] = true; // Obeleži taster kao pritisnut
};

document.onkeyup = function(event) {
    keys[event.key] = false; // Obeleži taster kao otpušten
};

function updateGame() {
    if (keys["ArrowUp"]) moveHero("up");
    if (keys["ArrowDown"]) moveHero("down");
    if (keys["ArrowLeft"]) moveHero("left");
    if (keys["ArrowRight"]) moveHero("right");
    if (keys[" "]) {
        bullets.push({x: hero.x + hero.width / 2 - 2, y: hero.y - 10}); // Dodaj metak

        // Pusti zvuk
        const shootSound = document.getElementById("shoot-sound");
        shootSound.currentTime = 0; // Resetuj audio ako se brzo puca
        shootSound.play();

        keys[" "] = false; // Resetuj space bar da se metak ne dodaje više puta
    }
}
document.addEventListener("keydown", function(event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault(); // Sprečava skrolovanje stranice
    }
});

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault(); // Sprečava pomeranje stranice
        // Pozovi funkciju za ispaljivanje metka
        shootBullet();
    }
});

setInterval(() => {
    updateGame();
    gameLoop();
}, 20);

// Prikazivanje početnog stanja
displayHero(); 
displayEnemies();
