/* 
El script está elaborado con las siguientes variables y funciones
*/
//Ancho y largo relacionado a el cuadro del juego (canvas)
var canvasWidth = 600;
var canvasHeight = 400;

//Jugador con la ubicación respectiva
var player;
var playerYPosition = 100;

var fallSpeed = 0;
var interval = setInterval(updateCanvas, 20);

var isJumping = false;
var jumpSpeed = 0;

var block;

// Variable para crear la puntuación del jugador desde 0
var score = 0;
//Variable relacionada para escribir el texto de la Puntuacion
var scoreLabel;

/* 
    Función para iniciar el juego, en la que se instancia el jugador junto al bloque
*/
function startGame() {
    gameCanvas.start();
    player = new createPlayer(30, 30, 10);
    block = new createBlock();
    // Assign your scoreLabel variable a value from scoreLabel()
    scoreLabel = new createScoreLabel(10, 30);
}

/* 
    Con la siguiente instruccion se crea un elemento llamado canvas
    en el cual empezara el juego.
*/
var gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}


/*
    Creacion del jugador, tomando en cuenta las 
    ubicaciones dentro del canvas dentro de ella 
    existen las siguientes instancias:
*/
function createPlayer(width, height, x) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = playerYPosition;
    
    /* 
        instancia con una función para mostrar el 
        cuadro que saltará en el juego
    */
    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /*
        instancia que permitira habilitar el tiempo de caida del bloque y si 
        llega a chocar el juego debe parar stopPlayer()
    */
    this.makeFall = function() {
        if (!isJumping) {
            this.y += fallSpeed;
            fallSpeed += 0;
            this.stopPlayer();
        }
    }

    /**
     * funcion para parar al jugador o bloque
     */
    this.stopPlayer = function() {
        var ground = canvasHeight - this.height;
        if (this.y > ground) {
            this.y = ground;
        }
    }

    /**
     * Funcion para darle un tiempo de salto al bloque
     */
    this.jump = function() {
        if (isJumping) {
            this.y -= jumpSpeed;
            jumpSpeed += 0.99;
        }
    }
}

/**
 * Funcion para crear los obstaculos aleatoriamente y de diferente tamaños
 */
function createBlock() {
    var width = randomNumber(10, 50);
    var height = randomNumber(10, 200);
    var speed = randomNumber(2, 6);
    
    this.x = canvasWidth;
    this.y = canvasHeight - height;
    
    /**
     * Colocara un color a cada obstaculo
     */
    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, width, height);
    }

    /**
     * Funcion para atacar
     */
    this.attackPlayer = function() {
        this.x -= speed;
        this.returnToAttackPosition();
    }
    this.returnToAttackPosition = function() {
        if (this.x < 0) {
            width = randomNumber(10, 50);
            height = randomNumber(50, 200);
            speed = randomNumber(4, 6);
            this.y = canvasHeight - height;
            this.x = canvasWidth;
            // incremeta la puntacion mientras vaya avanzando
            score++;
        }
    }
}


/**
 * Funcion para detectar un choque con los obstaculos
 * 
 */
function detectCollision() {
    var playerLeft = player.x
    var playerRight = player.x + player.width;
    var blockLeft = block.x;
    var blockRight = block.x + block.width;
    
    var playerBottom = player.y + player.height;
    var blockTop = block.y;
    //Condicion para el choque del jugador con el bloque
    if (playerRight > blockLeft && 
        playerLeft < blockLeft && 
        playerBottom > blockTop) {
        
        gameCanvas.stop();
    }
}
/**
 * Creacion de el label para indicar que el numero que aparece
 * sera sobre la Puntuacion
 * @param {*} x con este parametro se indica tanto la posicion 1
 * @param {*} y con el parametro y muestra la posicion 2
 */

function createScoreLabel(x, y) {
    this.score = 0;  
    this.x = x;
    this.y = y;
    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.font = "25px Marker Felt";
        ctx.fillStyle = "black";
        ctx.fillText(this.text, this.x, this.y);
    }
}

/**
 * Funcion para ir actualizando cada vez que se haga un salto
 */
function updateCanvas() {
    detectCollision();
    
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    player.makeFall();
    player.draw();
    player.jump();
    
    block.draw();
    block.attackPlayer();
    
    // Redraw your score and update the value
    scoreLabel.text = "SCORE: " + score;
    scoreLabel.draw();
}

/**
 * Con un max y min  numero aleatorio se puede determinar y 
 * mostrar la puntuacion del jugador 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Resetea tanto la puntacion como el juego 
 */
function resetJump() {
    jumpSpeed = 0;
    isJumping = false;
}

/**
 * Controlador de errores al programa 
 * @param {} e 
 */
document.body.onkeyup = function(e) {
    if (e.keyCode == 32) {
        isJumping = true;
        setTimeout(function() { resetJump(); }, 1000);
    }
}

