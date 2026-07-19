const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 450;
canvas.height = 800;

// ================== GAMBAR ==================

const playerImg = new Image();
playerImg.src = "player_car.png";

const enemyImg = new Image();
enemyImg.src = "enemy_car.png";

const coinImg = new Image();
coinImg.src = "coin.png";

const heartImg = new Image();
heartImg.src = "heart.png";

// ================== SOUND ==================

const coinSound = new Audio("coin.wav");
const crashSound = new Audio("crash.wav");
const engineSound = new Audio("engine.mp3");

engineSound.loop = true;
engineSound.volume = 1;

function startSound(){

    engineSound.volume = 1;

    engineSound.play().catch(()=>{});

    document.removeEventListener(
        "click",
        startSound
    );

    document.removeEventListener(
        "touchstart",
        startSound
    );
}

document.addEventListener(
    "click",
    startSound
);

document.addEventListener(
    "touchstart",
    startSound
);

// ================== PLAYER ==================

let player = {
    x: 195,
    y: 520,
    width: 70,
    height: 120,
    speed: 6
};

// ================== MUSUH ==================

let enemies = [

    {
        x: 80,
        y: -100,
        width:70,
        height: 120
    },

    {
        x: 200,
        y: -350,
        width: 60,
        height: 100
    },

    {
        x: 320,
        y: -600,
        width: 60,
        height: 100
    }

];

// ================== KOIN ==================

let coin = {
    x: 200,
    y: -250,
    width: 40,
    height: 40
};

// ================== DATA GAME ==================

let score = 0;
let level = 1;
let lives = 3;

let highScore =
    localStorage.getItem("highScore") || 0;

let gameOver = false;
let gameStarted = false;

let isMobile = /Android||iphone|ipad/i.test(
    navigator.userAgent
);

let enemySpeed = isMobile ? 4 : 2.5;

let lineY = 0;

// ================== KEYBOARD ==================

let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// ================== TOUCH HP ==================

canvas.addEventListener("touchmove", (e) => {

    e.preventDefault();

    let touch = e.touches[0];

    let rect =
        canvas.getBoundingClientRect();

    player.x =
        touch.clientX -
        rect.left -
        player.width / 2;

});

// ================== COLLISION ==================

function hit(a, b) {

    return (
    a.x + 12 < b.x + b.width - 12 &&
    a.x + a.width - 12 > b.x + 12 &&
    a.y + 15 < b.y + b.height - 15 &&
    a.y + a.height - 15 > b.y + 15
);

}

// ================== UPDATE ==================

function update() {

    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }

    if (player.x < 50)
        player.x = 50;

    if (player.x > 340)
        player.x = 340;

    // Garis jalan
    lineY += isMobile ? 8 : 5;

    if (lineY > 120)
        lineY = 0;

    // Koin
    coin.y += isMobile ? 4 : 3;

    if (coin.y > canvas.height) {

        coin.y = -100;

        coin.x =
            60 +
            Math.random() * 280;
    }

    // Musuh
    for (let enemy of enemies) {

        enemy.y += enemySpeed;

        if (enemy.y > canvas.height) {

            enemy.y =
                -200;

            enemy.x =
                60 +
                Math.random() * 280;

            score++;

            if(score > highScore) {
                highScore = score;
                localStorage.setItem("highScore",highScore);
            }
        }

        if (hit(player, enemy)) {

            crashSound.currentTime = 0;
            crashSound.play();

            if(navigator.vibrate){

            navigator.vibrate(200);

            }

            lives--;

            enemy.y = -300;

            if (lives <= 0) {
                
                gameOver = true;
                engineSound.pause();
            }
        }
    }

    // Ambil koin
    if (hit(player, coin)) {

        coinSound.currentTime = 0;
        coinSound.play();

        score += 5;

        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore",highScore);
        }

        coin.y = -200;

        coin.x =
            60 +
            Math.random() * 280;
    }

    // Level
    level =
        Math.floor(score / 15) + 1;

    enemySpeed =
        2.5 + level * 0.25;
}

// ================== DRAW ==================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Rumput

    ctx.fillStyle = "#2e8b57";

    ctx.fillRect(
        0,
        0,
        50,
        canvas.height
    );

    ctx.fillRect(
        400,
        0,
        50,
        canvas.height
    );

    // Jalan

    ctx.fillStyle = "#555";

    ctx.fillRect(
        50,
        0,
        350,
        canvas.height
    );

    ctx.fillStyle = "#dddddd";

ctx.fillRect(
    50,
    0,
    4,
    canvas.height
);

ctx.fillRect(
    396,
    0,
    4,
    canvas.height
);

    // Garis tengah

    ctx.fillStyle = "white";

    for (let i = 0; i < 10; i++) {

        ctx.fillRect(
            215,
            lineY + i * 120 - 120,
            20,
            70
        );

    }

    // Koin

    ctx.drawImage(
        coinImg,
        coin.x,
        coin.y,
        40,
        40
    );

    // Musuh

    for (let enemy of enemies) {

        ctx.drawImage(
            enemyImg,
            enemy.x,
            enemy.y,
            70,
            120
        );

    }

    // Player


    ctx.drawImage(
        playerImg,
        player.x,
        player.y,
        70,
        120
    );

    // Score

    ctx.fillStyle = "white";

    ctx.font = "28px Arial";

    ctx.fillText(
        "Score : " + score,
        10,
        35
    );

    ctx.fillText(
        "Level : " + level,
        10,
        70
    );

    ctx.fillText(
    "Best : " + highScore,
    10,
    105
    );

    // Heart

    for (let i = 0; i < lives; i++) {

        ctx.drawImage(
            heartImg,
            170 + i * 40,
            10,
            30,
            30
        );

    }
    
    // Game Over
if(gameOver){

    ctx.fillStyle =
        "rgba(0,0,0,0.7)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "red";

    ctx.font =
        "60px Arial";

    ctx.fillText(
        "GAME OVER",
        40,
        330
    );

    // tombol
    ctx.fillStyle =
        "#00cc66";

    ctx.fillRect(
        125,
        420,
        200,
        70
    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "35px Arial";

    ctx.fillText(
        "RESTART",
        135,
        467
    );
}


// ================= START SCREEN =================

if(!gameStarted){

    ctx.fillStyle =
        "rgba(0,0,0,0.8)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "white";

    ctx.textAlign =
        "center";

    ctx.font =
        "45px Arial";

    ctx.fillText(
        "TRAFFIC DODGER",
        canvas.width / 2,
        320
    );

    ctx.font =
        "30px Arial";

    ctx.fillText(
        "Tap To Start",
        canvas.width / 2,
        390
    );

    ctx.textAlign =
        "left";
}
    
}

canvas.addEventListener(
    "click",
    restartGame
);

canvas.addEventListener(
    "touchstart",
    restartGame
);

canvas.addEventListener(
    "click",
    () => {
        gameStarted = true;

    engineSound.play().catch(()=>{});
    }
);

canvas.addEventListener(
    "touchstart",
    () => {
        gameStarted = true;

    engineSound.play().catch(()=>{});
    }
);

function restartGame(e){

    if(!gameOver)
        return;

    location.reload();
    
}



// ================== LOOP ==================

function gameLoop() {

    if (gameStarted && ! gameOver) {
        update ();
    }
    draw();

    requestAnimationFrame(gameLoop);

}

gameLoop();