class Asteroid{
    // predstavlja asteroid koji treba izbjeci
    // oblik kvadrata
    constructor(x, y, size, trajectoryX, trajectoryY, speed){
        this.x = x;
        this.y = y;
        this.size = size; // ovo ce biti visina i sirika kvadrata
        this.trajectoryX = trajectoryX;
        this.trajectoryY = trajectoryY; // smjerovi kretanja po X i Y osi
        this.speed = speed;
    }
    draw(canvas_context){
        // crta kvadrat na canvasu
        canvas_context.beginPath();
        canvas_context.rect(this.x, this.y, this.size, this.size);
        canvas_context.fillStyle = "gray";
        canvas_context.fill();
        canvas_context.stroke();
    }
    move(canvas, asteroids){
        // pomice asteroid po canvasu
        this.x += this.trajectoryX * this.speed;
        this.y += this.trajectoryY * this.speed;
        if(this.amIDead(canvas)){
            this.destroy(asteroids);
        }
    }
    amIDead(canvas){
        // provjerava je li asteroid izvan canvasa i ne moze se vratiti
        if(this.trajectoryX < 0 && this.x < 0 - this.size){ // asteroid ide lijevo i izasao je van canvasa s lijeve strane
            return true;
        }
        if(this.trajectoryX > 0 && this.x > canvas.width){ // obratno...
            return true;
        }
        if(this.trajectoryY < 0 && this.y < 0 - this.size){
            return true;
        }
        if(this.trajectoryY > 0 && this.y > canvas.height){
            return true;
        }
        return false;
    }
    destroy(asteroidi){
        // unisti asteroid, makni ga iz liste
        let index = asteroidi.indexOf(this);
        if(index > -1){
            asteroidi.splice(index, 1);
        }
    }
}

class Player{
    // predstavlja igraca
    // također oblik kvadrata
    constructor(x, y, size, speed){
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }
    draw(canvas_context){
        // crta kvadrat na canvasu
        canvas_context.beginPath();
        canvas_context.rect(this.x, this.y, this.size, this.size);
        canvas_context.fillStyle = "red";
        canvas_context.fill();
    }
    move(pressedKeys){
        // pomice igraca po canvasu
        if("ArrowUp" in pressedKeys){
            this.y -= this.speed;
        }
        if("ArrowDown" in pressedKeys){
            this.y += this.speed;
        }
        if("ArrowLeft" in pressedKeys){
            this.x -= this.speed;
        }
        if("ArrowRight" in pressedKeys){
            this.x += this.speed;
        }
    }

    checkCollision(asteroids){
        // provjerava je li igrac udario u asteroide
        for(let i = 0; i < asteroids.length; i++){
            if(this.x < asteroids[i].x + asteroids[i].size && this.x + this.size > asteroids[i].x && this.y < asteroids[i].y + asteroids[i].size && this.y + this.size > asteroids[i].y){
                console.log("udario");
                return true;
            }
        }
        return false;
    }

}

function generateRandomAsteroids(canvas, startTime, currentTime){
    // asteroidi se skaliraju prema vremenu, razina raste svakih 15 sekundi
    let level = Math.floor((currentTime - startTime)/1000/15) + 1;
    if(level > 10){
        level = 10; // najveci level je 10
    }
    let numberOfAsteroids = Math.floor(Math.random() * level/2) + 1; // broj asteroida je izmedu 1 i level/2

    let newAsteroids = [];
    for(let i = 0; i < numberOfAsteroids; i++){
        // generira asteroid sa nasumicnim parametrima (velicina, smjer, brzina, pocetna pozicija)
        // velicina asteroida
        let asteroidSize = Math.floor(Math.random() * 190) + 10; // velicina asteroida je izmedu 10 i 200
        // smjer asteroida
        let asteroidTrajectoryX = Math.random()*2 - 1 // smjer asteroida po X osi, izmedu -1 i 1
        let asteroidTrajectoryY = Math.random()*2 - 1 // smjer asteroida po Y osi, izmedu -1 i 1
        // brzina asteroida
        let asteroidSpeed = Math.floor(Math.random() * 15) + 5; // brzina asteroida je izmedu 5 i 20
        // pocetna pozicija asteroida, treba biti izvan canvasa
        let asteroidX = 0;
        let asteroidY = 0;
        let randomUdaljenostIzvanX = Math.floor(Math.random() * 200) + 1; // udaljenost izvan canvasa je izmedu 1 i 200
        let randomUdaljenostIzvanY = Math.floor(Math.random() * 200) + 1; // udaljenost izvan canvasa je izmedu 1 i 200
        if(asteroidTrajectoryX < 0){ // asteroid ide lijevo
            asteroidX = canvas.width + randomUdaljenostIzvanX;
        }
        else{ // asteroid ide desno
            asteroidX = 0 - randomUdaljenostIzvanX;
        }
        if(asteroidTrajectoryY < 0){ // asteroid ide gore
            asteroidY = canvas.height + randomUdaljenostIzvanY;
        }
        else{ // asteroid ide dolje
            asteroidY = 0 - randomUdaljenostIzvanY;
        }
        newAsteroids.push(new Asteroid(asteroidX, asteroidY, asteroidSize, asteroidTrajectoryX, asteroidTrajectoryY, asteroidSpeed));
    }

    return newAsteroids;
}

function drawAsteroids(asteroids, context){
    // crta sve asteroide iz liste
    for(let i = 0; i < asteroids.length; i++){
        asteroids[i].draw(context);
    }

}

function restartGameListener(event){
    // restarta igru ako je pritisnuta tipka R
    if(event.key == "r"){
        document.removeEventListener("keydown", restartGameListener);
        // restartamo igru
        main();
    }
}

function saveBestTime(startTime, endTime){
    // spremimo vrijeme u local storage ako je bolje od najboljeg
    let gameTime = endTime - startTime;
    let bestTime = localStorage.getItem("bestTime");
    if(bestTime == null || gameTime > bestTime){
        localStorage.setItem("bestTime", gameTime);
    }
}

function updateTime(canvas, context, startTime, bestTime){
    // ispisuje koliko dugo traje igra (minute:sekunde.milisekunde)
    // u gornjem desnom kutu

    //bestTime je vec dobro formatiran

    let currentTime = Date.now();
    context.font = "20px Arial";
    context.fillStyle = "black";
    context.textAlign = "right";
    let minutes = Math.floor((currentTime - startTime)/1000/60);
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    let seconds = Math.floor((currentTime - startTime)/1000) - minutes*60;
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    let milliseconds = Math.floor((currentTime - startTime)%1000);
    if(milliseconds < 10){
        milliseconds = "00" + milliseconds;
    }
    else if(milliseconds < 100){
        milliseconds = "0" + milliseconds;
    }
    context.fillText("Najbolje vrijeme: " + bestTime, canvas.width - 20, 20);
    context.fillText("Vrijeme: " + minutes + ":" + seconds + "." + milliseconds, canvas.width - 20, 50);
}

function main(){ // glavna funkcija, pokrece igru

    let my_canvas = document.getElementById("my_canvas");
    let my_context = my_canvas.getContext("2d");

    my_canvas.width = window.innerWidth * 0.95;
    my_canvas.height = window.innerHeight * 0.95;

    my_context.shadowBlur = 20;
    my_context.shadowColor = "black";

    // nacrtamo igraca u sredini canvasa
    let playerSize = 50;
    let playerSpeed = 10;
    let player = new Player((my_canvas.width - playerSize)/2 , (my_canvas.height - playerSize)/2, playerSize, playerSpeed);
    player.draw(my_context);
    
    // asteroidi
    let asteroids = [];

    let pressedKeys = {}; // lista trenutno pritisnutih tipki

    let startTime = Date.now(); // trenutno vrijeme

    let bestTime = localStorage.getItem("bestTime"); // najbolje vrijeme
    let bestTimeFormatted = "00:00.000";
    if(bestTime != null){
        let minutes = Math.floor(bestTime/1000/60);
        if(minutes < 10){
            minutes = "0" + minutes;
        }
        let seconds = Math.floor(bestTime/1000) - minutes*60;
        if(seconds < 10){
            seconds = "0" + seconds;
        }
        let milliseconds = Math.floor(bestTime%1000);
        if(milliseconds < 10){
            milliseconds = "00" + milliseconds;
        }
        else if(milliseconds < 100){
            milliseconds = "0" + milliseconds;
        }
        bestTimeFormatted = minutes + ":" + seconds + "." + milliseconds;
    }

    // pokrecemo petlju za igru
    let gameLoop = setInterval(function(){

        my_canvas.width = window.innerWidth * 0.95;
        my_canvas.height = window.innerHeight * 0.95;
        // ocistimo canvas
        my_context.clearRect(0, 0, my_canvas.width, my_canvas.height);

        // pomaknemo igraca
        player.move(pressedKeys);
        player.draw(my_context);
        // pomaknemo asteroide
        for(let i = 0; i < asteroids.length; i++){
            asteroids[i].move(my_canvas, asteroids);
        }
        drawAsteroids(asteroids, my_context);

        // ispisemo vrijeme
        updateTime(my_canvas, my_context, startTime, bestTimeFormatted);

        // provjerimo koliziju
        if(player.checkCollision(asteroids)){
            clearInterval(gameLoop);
            clearInterval(asteroidInterval);
            // spremimo vrijeme ako je bolje od najboljeg
            saveBestTime(startTime, Date.now());
            // prikazemo poruku, ponudimo ponovnu igru
            my_context.font = "30px Arial";
            my_context.fillStyle = "red";
            my_context.textAlign = "center";
            my_context.fillText("Game Over", my_canvas.width/2, my_canvas.height/2);
            my_context.font = "20px Arial";
            my_context.fillText("Press R to restart", my_canvas.width/2, my_canvas.height/2 + 50);
            document.addEventListener("keydown", restartGameListener);
        }

    }, 1000/60); // 60 puta u sekundi pokrenemo petlju

    // tu i tamo dodamo novi asteroid
    let asteroidInterval = setInterval(function(){
        let newAsteroids = generateRandomAsteroids(my_canvas, startTime, Date.now());
        for(let i = 0; i < newAsteroids.length; i++){
            asteroids.push(newAsteroids[i]);
        }
    }, 1000); // svake sekunde dodamo nove asteroide

    // provjeravamo inpute
    document.addEventListener("keydown", function(event){
        pressedKeys[event.key] = true;
    });
    document.addEventListener("keyup", function(event){
        delete pressedKeys[event.key];
    });


}

document.addEventListener("DOMContentLoaded", main); // pokrece main funkciju kada se ucita DOM