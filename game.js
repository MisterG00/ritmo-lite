const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- AUDIO ---
const hitSound = document.getElementById("hitSound");

const music = new Audio("audio/music.mp3");
music.loop = true;
music.volume = 0.4;

let musicStarted = false;

function startMusic() {
    if (!musicStarted) {
        musicStarted = true;

        music.play().catch(() => {
            console.log("La música está esperando interacción del usuario...");
        });
    }
}

// --- CÍRCULO DINÁMICO ---
let circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    growing: true
};

// --- VARIABLES DE JUEGO ---
let score = 0;
let combo = 0;
const PERFECT_RADIUS = 60;
const TOLERANCE = 8;

// --- DIBUJAR ---
function drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // círculo azul dinámico
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0af";
    ctx.fill();

    // círculo blanco objetivo
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, PERFECT_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
}

// --- ACTUALIZAR ANIMACIÓN ---
function update() {
    if (circle.growing) {
        circle.radius += 1.0;
        if (circle.radius >= 90) {
            circle.growing = false;
        }
    } else {
        circle.radius -= 1.0;
        if (circle.radius <= 10) {
            circle.growing = true;
        }
    }
}

// --- LOOP PRINCIPAL ---
function gameLoop() {
    update();
    drawCircle();
    requestAnimationFrame(gameLoop);
}

// --- CHECK HIT ---
function checkHit() {
    startMusic(); // iniciar música cuando el jugador interactúe

    let diff = Math.abs(circle.radius - PERFECT_RADIUS);

    // --- REPRODUCIR SONIDO DEL HIT ---
    hitSound.pause();
    hitSound.currentTime = 0;
    hitSound.play().catch(() => {});

    // PERFECT
    if (diff <= TOLERANCE) {
        score += 100;
        combo++;
        flashColor("#00ff00"); // verde
    } else {
        combo = 0;
        flashColor("#ff0000"); // rojo
    }

    document.getElementById("score").textContent = score;
    document.getElementById("combo").textContent = combo;
}

// --- INPUT ---
document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        checkHit();
    }
});

// --- INICIAR MÚSICA CON CLIC TAMBIÉN ---
document.body.addEventListener("click", () => startMusic(), { once: true });

// --- EFECTO VISUAL ---
function flashColor(color) {
    canvas.style.border = `3px solid ${color}`;
    setTimeout(() => {
        canvas.style.border = "none";
    }, 120);
}

// iniciar juego
gameLoop();
