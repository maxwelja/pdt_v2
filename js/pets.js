/*
**
*   Premium De-Tedium!
*   Hack DFW 2022 Submission
*   Author: Jacob Maxwell
*   Last Edit: 9/25/2022
*
*   Interactive educational tool intended to simplify
*   exposure to new material
**
*/

//global variables for rendering and physics
function petsIt(){
    // const carImg = new Image();
    const petImg = new Image();
    const parkImg = new Image();
    petImg.src = "assets/dog.jpg";
    parkImg.src = "assets/park.png";
    const NUMPLAYERS = 3;
    const SCREEN_WIDTH = 1440;
    const SCREEN_HEIGHT = 700;
    const CENTER_X = SCREEN_WIDTH/2;
    const CENTER_Y = SCREEN_HEIGHT/2;
    const COLLISION_FACTOR = 1;
    const BOUNDARY_OFFSET = 25; //debugging value for collision detection
    PLAYER_SPEED = 4;   //effectively adjusts the game speed
    const canvas = document.getElementById("game");
    const context = canvas.getContext("2d");

    //flags for collision detection and scoring
    let state = "";
    let colFlag = false;
    let point = 0;
    let score = 0;
    let allEntities = [];

    //polygon class for collision detection
    class pVec{
        constructor(e){
            console.log(e);
            for (let i = 0; i < e.length/2; i++){
                this.edges[i] = -e[(2*i)+1];
                this.edges[i] = e[2*i];
            }
        }
    }

    //player class object represents the player controlled entity
    class player{
        constructor(x,y,width,height,color,id){
            this.x = x;
            this.y = y;
            this.angle = 0;
            this.width = width;
            this.height = height;
            this.speed = 0;
            this.color = color;
            this.id = id;
            this.edges = [this.x-this.width*COLLISION_FACTOR, this.y-this.height*COLLISION_FACTOR,
                            this.x+this.width*COLLISION_FACTOR, this.y+this.height*COLLISION_FACTOR];
            this.colR = ((this.width + this.height)/2) / Math.sqrt(2);
        //     this.colVertices = this.getVertices();
        //     this.colEdges = this.getEdges();
        // }
        // //calculates vertices in clockwise order from top-left corner
        // getVertices(){
        //     let v1x = this.x-this.width/2;
        //     let v2x = this.x+this.width/2;
        //     let v1y = this.y-this.height/2;
        //     let v2y = this.y+this.height/2;
        //     let v1 = [v1x,v1y]; //top left
        //     let v2 = [v2x,v1y]; //top right
        //     let v3 = [v1x,v2y]; //bot right
        //     let v4 = [v2x,v2y]; //bot left
        //     return v1.concat(v2,v3,v4);
        // }
        // //calculates edges: starting from v1
        // getEdges(){
        //     let e1 = [this.colVertices[0] - this.colVertices[2], this.colVertices[1] - this.colVertices[3]];
        //     let e2 = [this.colVertices[2] - this.colVertices[4], this.colVertices[3] - this.colVertices[5]];
        //     let e3 = [this.colVertices[4] - this.colVertices[6], this.colVertices[5] - this.colVertices[7]];
        //     let e4 = [this.colVertices[6] - this.colVertices[0], this.colVertices[7] - this.colVertices[1]];
        //     return e1.concat(e2,e3,e4);
        // }
        // sat(a){
        //     let pLine = null;
        //     let dot = 0;
        //     let pStack = [];
        //     let amin = null;
        //     let amax = null;
        //     let bmin = null;
        //     let bmax = null;

        //     //calculate perpendicular vectors from player edges
        //     for (let i = 0; i < this.colEdges.length; i++){
        //         pLine = new pVec(this.colEdges);
        //         pStack.push(pLine);
        //     }
        //     //same for object checked against
        //     for (let i = 0; i < a.colEdges.length; i++){
        //         pLine = new pVec(a.colEdges);
        //         pStack.push(pLine);
        //     }
        //     //calculate dot product from new perpendicular vectors
        //     //this creates a projected from the player onto the checked entity
        //     for (let i = 0; i < pStack.length; i++){    
        //         amin = null;
        //         amax = null;
        //         bmin = null;
        //         bmax = null;
        //         //dot product values from player
        //         for (let j = 0; j < this.colVertices.length/2; i++){
        //                 dot = this.colVertices[2*j] *
        //                         pStack[i].edges[2*i] +
        //                         this.colVertices[(2*j)+1] *
        //                         pStack[j].edges[(2*i)+1];

        //                 if (amax === null || dot > amax){
        //                     amax = dot;
        //                 }
        //                 if (amin === null || dot < amin){
        //                     amin = dot;
        //                 }
        //             }
        //         //same for checked entity
        //         for (let j = 0; j < a.colVertices.length/2; i++){
        //             dot = a.colVertices[2*j] *
        //                     pStack[i].edges[2*i] +
        //                     a.colVertices[(2*j)+1] *
        //                     pStack[j].edges[(2*i)+1];

        //             if (bmax === null || dot > bmax){
        //                 bmax = dot;
        //             }
        //             if (bmin === null || dot < bmin){
        //                 bmin = dot;
        //             }
        //         }
        //         //if no gap (collision detected) continue to next calc
        //         if ((amin < bmax && amin > bmin) ||
        //             (bmin < amax && bmin > amin)){
        //                 continue;
        //         } else {
        //             //no collision, we're done, skip looping through rest of the vectors
        //             return false;
        //         }
        //         //if true, collision found after searching all vectors
        //         return true;
        //     }
        }
        colliderRect(e){
            //tricky entity collision: suspect it's an issue with canvas shuffling
            //in order: test car into -> right or top or left or bottom
            if (this.x < e.x+e.width && this.x+this.width > e.x &&
                this.y < e.y+e.height && this.y+this.height > e.y){
                colFlag = true;
            } else {
                colFlag = false;
            }
            // if (this.edges[0] < e.edges[2] && this.edges[2] > this.edges[0] && this.edges[1] < e.edges[3] && this.edges[3] > e.edges [1]){
            //     colFlag = true;
            // } else {
            //     colFlag = false;
            // // }
            // if (colFlag == true){
            //     point += e.eventID;
            // }
            return colFlag;
        }
        collider(ent){
            if ((this.x+this.colR) > ent.x && (this.x-this.colR) < ent.x + ent.width/2 &&
            (this.y+this.colR) > ent.y + ent.height/2 && (this.y-this.colR) < ent.y){
                colFlag = true;
            } else {
                colFlag = false;
            }
        }
        draw(){
            context.save();
            this.rotate();
            context.drawImage(petImg, this.x-(this.width/2), this.y-(this.height/2), this.width, this.height);               
            context.restore();  
        }
        rotate(){
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.translate(-this.x,-this.y);
        }
        update(){
            
        }
        reset(){
            this.x = CENTER_X;
            this.y = CENTER_Y;
        }
    }

    //entity class object to ease building the 2D scene
    class entity{
        constructor(x,y,width,height,color,eventID){
            this.x = x;
            this.y = y;
            this.angle = 0;
            this.width = width;
            this.height = height;
            this.color = color;
            this.eventID = eventID;
            this.edges = [this.x-this.width*COLLISION_FACTOR, this.y-this.height*COLLISION_FACTOR,
                            this.x+this.width*COLLISION_FACTOR, this.y+this.height*COLLISION_FACTOR]
        //     this.colVertices = this.getVertices();
        //     this.colEdges = this.getEdges();
        // }
        // //calculates vertices in clockwise order from top-left corner
        // getVertices(){
        //     let v1x = this.x-this.width/2;
        //     let v2x = this.x+this.width/2;
        //     let v1y = this.y-this.height/2;
        //     let v2y = this.y+this.height/2;
        //     let v1 = [v1x,v1y]; //top left
        //     let v2 = [v2x,v1y]; //top right
        //     let v3 = [v1x,v2y]; //bot right
        //     let v4 = [v2x,v2y]; //bot left
        //     return v1.concat(v2,v3,v4);
        // }
        // //calculates edges: starting from v1
        // getEdges(){
        //     let e1 = [this.colVertices[0] - this.colVertices[2], this.colVertices[1] - this.colVertices[3]];
        //     let e2 = [this.colVertices[2] - this.colVertices[4], this.colVertices[3] - this.colVertices[5]];
        //     let e3 = [this.colVertices[4] - this.colVertices[6], this.colVertices[5] - this.colVertices[7]];
        //     let e4 = [this.colVertices[6] - this.colVertices[0], this.colVertices[7] - this.colVertices[1]];
        //     return e1.concat(e2,e3,e4);
        }
        draw(){
            context.save();
            this.rotate();
            context.fillStyle = this.color;
            context.fillRect(this.x-(this.width/2), this.y-(this.height/2), this.width, this.height);
            context.restore();  
        }
        rotate(){
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.translate(-this.x,-this.y);
        }
        update(){
            
        }
    }

    //player control
    var keys = [];
    window.addEventListener("keydown",function(e){
        keys[e.keyCode] = true;
    })
    window.addEventListener("keyup",function(e){
        keys[e.keyCode] = false;
    })
    //helper function for rotation
    function DegToRad(num) {
        return (num * (Math.PI/180));
    }

    //initialize starting values and create objects
    function init(){
        if (state == "AUTO"){
            p1 = new player(CENTER_X-150,CENTER_Y,75,50,"red",1);
            p2 = new player(CENTER_X,CENTER_Y,75,50,"blue",2); 
            p3 = new player(CENTER_X+150,CENTER_Y,75,50,"green",3);
        } else if (state == "HOME"){
            p1 = new player(CENTER_X-150,CENTER_Y,75,50,"red",4);
            p2 = new player(CENTER_X,CENTER_Y,75,50,"blue",4); 
            p3 = new player(CENTER_X+150,CENTER_Y,75,50,"green",4);
        } else if (state == "PET"){
            p1 = new player(CENTER_X-150,CENTER_Y,75,50,"red",5);
            p2 = new player(CENTER_X,CENTER_Y,75,50,"blue",5); 
            p3 = new player(CENTER_X+150,CENTER_Y,75,50,"green",5);
        } else {
            p1 = new player(CENTER_X-150,CENTER_Y,75,50,"red",0);
            p2 = new player(CENTER_X,CENTER_Y,75,50,"blue",0); 
            p3 = new player(CENTER_X+150,CENTER_Y,75,50,"green",0);
        }

        block1 = new entity(1000,100,100,100,"darkred",1);
        block2 = new entity(1000,200,100,100,"darkred",2);
        block3 = new entity(900,100,100,100,"darkred",3);
        block4 = new entity(100,550,10,25,"goldenrod",4);
        block5 = new entity(500,100,25,10,"goldenrod",5);
        block6 = new entity(50,50,25,10,"goldenrod",6);
        block7 = new entity(175,200,50,50,"darkgreen",7);
        block8 = new entity(75,450,50,50,"darkgreen",8);
        block9 = new entity(400,500,50,50,"darkgreen",9);
        block10 = new entity(350, 100, 50, 50,"darkgreen",10);
        block11 = new entity(SCREEN_WIDTH-50,SCREEN_HEIGHT-50,10,25,"goldenrod",11);
        colFlag = false;
        
        allEntities = [ block1, block2, block3,block4, block5, block6,
                        block7, block8, block9, block10, block11, p1, p2, p3 ];
    }

    // function switcher(){
    //     if (keys[189] == true){

    //     }
    // }

    //update handles entity animation and collision
    function update(){
        if (keys[27] == true){
            window.clearInterval(killme);
        }
        if (keys[96] == true){
            state = "TEST";
            init(state);
        }
        if (keys[97] == true){
            state = "AUTO";
            init(state);
        }
        if (keys[98] == true){
            state = "HOME";
            init(state);
        }
        if (keys[99] == true){
            state = "PET";
            init(state);
        }
        //Player 1
        //Q 90deg left
        if (keys[81] == true){
            p1.angle -= Math.PI/2;
        }
        //E 90deg right
        if (keys[69] == true){
            p1.angle += Math.PI/2;
        }
        //Move up on [W, up, 8]
        if (keys[87] == true){ 
            // if (BOUNDARY_OFFSET + p1.width/2 < p1.x && p1.x < SCREEN_WIDTH - BOUNDARY_OFFSET - p1.width/2){
                let dx = PLAYER_SPEED * Math.cos(p1.angle);
                p1.x += dx;
                p1.edges[0] += dx;
                p1.edges[2] += dx;
            // } else {
            //     p1.reset();
            // }
            // if (BOUNDARY_OFFSET + p1.height/2 < p1.y && p1.y < SCREEN_HEIGHT - BOUNDARY_OFFSET - p1.height/2){
                let dy = PLAYER_SPEED * Math.sin(p1.angle);
                p1.y += dy;
                p1.edges[1] += dy;
                p1.edges[3] += dy;
            // } else {
            //     p1.reset();
            // }
        }
        //move left on [A, left, 4]
        if (keys[65] == true){
            p1.angle -= 0.1;
        }
        //move right on [D, right, 6]
        if (keys[68] == true){
            p1.angle += 0.1;
        }
        //move down on [S, down, 2]
        if (keys[83] == true){
            if (p1.width/2 < p1.x && p1.x < SCREEN_WIDTH - p1.width/2){
                let dx = -PLAYER_SPEED * Math.cos(p1.angle);
                p1.x += dx;
                p1.edges[0] += dx;
                p1.edges[2] += dx;
            } else {
                p1.reset();
            }
            if (p1.height/2 < p1.y && p1.y < SCREEN_HEIGHT - p1.height/2){
                let dy = -PLAYER_SPEED * Math.sin(p1.angle);
                p1.y += dy;
                p1.edges[1] += dy;
                p1.edges[3] += dy;
            } else {
                p1.reset();
            }
        }
        //Player 2
        //Move up on [W, up, 8]
        if (keys[38] == true){ 
            if (BOUNDARY_OFFSET + p2.width/2 < p2.x && p2.x < SCREEN_WIDTH - BOUNDARY_OFFSET - p2.width/2){
                let dx = PLAYER_SPEED * Math.cos(p2.angle);
                p2.x += dx;
                p2.edges[0] += dx;
                p2.edges[2] += dx;
            } else {
                p2.reset();
            }
            if (BOUNDARY_OFFSET + p2.height/2 < p2.y && p2.y < SCREEN_HEIGHT - BOUNDARY_OFFSET - p2.height/2){
                let dy = PLAYER_SPEED * Math.sin(p2.angle);
                p2.y += dy;
                p2.edges[1] += dy;
                p2.edges[3] += dy;
            } else {
                p2.reset();
            }
        }
        //move left on [A, left, 4]
        if (keys[37] == true){
            p2.angle -= 0.1;
        }
        //move right on [D, right, 6]
        if (keys[39] == true){
            p2.angle += 0.1;
        }
        //move down on [S, down, 2]
        if (keys[40] == true){
            if (p2.width/2 < p2.x && p2.x < SCREEN_WIDTH - p2.width/2){
                let dx = -PLAYER_SPEED * Math.cos(p2.angle);
                p2.x += dx;
                p2.edges[0] += dx;
                p2.edges[2] += dx;
            } else {
                p2.reset();
            }
            if (p2.height/2 < p2.y && p2.y < SCREEN_HEIGHT - p2.height/2){
                let dy = -PLAYER_SPEED * Math.sin(p2.angle);
                p2.y += dy;
                p2.edges[1] += dy;
                p2.edges[3] += dy;
            } else {
                p2.reset();
            }
        }
        //Player 3
        //Move up on [W, up, 8]
        if (keys[104] == true){ 
            if (BOUNDARY_OFFSET + p3.width/2 < p3.x && p3.x < SCREEN_WIDTH - BOUNDARY_OFFSET - p3.width/2){
                let dx = PLAYER_SPEED * Math.cos(p3.angle);
                p3.x += dx;
                p3.edges[0] += dx;
                p3.edges[2] += dx;
            } else {
                p3.reset();
            }
            if (BOUNDARY_OFFSET + p3.height/2 < p3.y && p3.y < SCREEN_HEIGHT - BOUNDARY_OFFSET - p3.height/2){
                let dy = PLAYER_SPEED * Math.sin(p3.angle);
                p3.y += dy;
                p3.edges[1] += dy;
                p3.edges[3] += dy;
            } else {
                p3.reset();
            }
        }
        //move left on [A, left, 4]
        if (keys[100] == true){
            p3.angle -= 0.1;
        }
        //move right on [D, right, 6]
        if (keys[102] == true){
            p3.angle += 0.1;
        }
        //move down on [S, down, 2]
        if (keys[101] == true){
            if (p3.width/2 < p3.x && p3.x < SCREEN_WIDTH - p3.width/2){
                let dx = -PLAYER_SPEED * Math.cos(p3.angle);
                p3.x += dx;
                p3.edges[0] += dx;
                p3.edges[2] += dx;
            } else {
                p3.reset();
            }
            if (p3.height/2 < p3.y && p3.y < SCREEN_HEIGHT - p3.height/2){
                let dy = -PLAYER_SPEED * Math.sin(p3.angle);
                p3.y += dy;
                p3.edges[1] += dy;
                p3.edges[3] += dy;
            } else {
                p3.reset();
            }
        }
        
        //surprise on 'Backspace'
        if (keys[8] == true){
            for (let i = 0; i < allEntities.length; i++){
                allEntities[i].angle += 0.1;
            }
        }

        //coin animation
        for (let i = 0; i < allEntities.length-NUMPLAYERS; i++){
            // if (p1.collider(allEntities[i])){
            //     console.log(p1.collider(allEntities[i]));
            //     p1.reset();
            // }
            if (p1.colliderRect(allEntities[i]) ||
                p2.colliderRect(allEntities[i]) ||
                p3.colliderRect(allEntities[i]) ){
                    point = allEntities[i].eventID;
            }
            console.log(colFlag);
            if (allEntities[i].color == "goldenrod"){
                allEntities[i].angle += 0.1;
            }
        }

        //big scary collision detection
        // for (let i = 0; i < allEntities.length - NUMPLAYERS; i++){
        //     if (p1.sat(allEntities[i])){
        //         colFlag = true;
        //     } else {
        //         colFlag = false;
        //     }
        // }
    }

    //entity collision detector: incomplete
    /*function collider(e){
        //tricky entity collision: suspect it's an issue with canvas shuffling
        //in order: test car into -> right or top or left or bottom
        if (player.edges[0] < e.edges[2] && e.edges[3] > player.edges[1] && player.edges[1] < e.edges[3]){ colFlag = true; }
        if (player.edges[1] < e.edges[3] && e.edges[2] > player.edges[0] && player.edges[2] > e.edges[0]){ colFlag = true; }
        if (player.edges[2] > e.edges[0] && e.edges[3] > player.edges[1] && player.edges[3] > e.edges[1]){ colFlag = true; }
        if (player.edges[3] < e.edges[1] && e.edges[0] < player.edges[2] && player.edges[0] < e.edges[2]){ colFlag = true; }
        if (colFlag == true){
            point = performEvent(e.eventID);
        }
    }
    */

    //function for intended popup prompts
    function performEvent(eID){
        console.log(eID);
        let answer = "";
        while (answer == null){
            //example: Maserati increases premium and decreases player score
            prompt("Given the option, would you prefer a flashy Maserati or an eco-friendly Tesla?");
        }
    }

    //the artist: draw objects on the screen
    function render(){
        //clear screen
        context.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
        console.log(state);
        context.drawImage(parkImg,0,0);
        context.fillStyle = "black";
        context.fillRect((SCREEN_WIDTH/2)-205, 5, (SCREEN_WIDTH/2)-490, 60,);
        context.fillStyle = "darkslategrey";
        context.fillRect((SCREEN_WIDTH/2)-200, 10, (SCREEN_WIDTH/2)-500, 50,);
        context.fillStyle = "black";
        context.font = "36pt courier";
        context.textAlign = "center";
        context.fillText("Event: ", (SCREEN_WIDTH/2)-100, 50);
        context.fillText(point, SCREEN_WIDTH/2, 50);
        // console.log("colFlag point score collide pEdges");
        // console.log(colFlag, point, score, p1.x, p1.y, p1.edges, p2.x, p2.y, p2.edges, p3.x, p3.y, p3.edges);

        //draw all entities; player last
        for (let i = 0; i < allEntities.length; i++){
            allEntities[i].draw();
            allEntities[i].update();
        }
    }

    //set frame interval and start
    killme = window.setInterval(gameLoop,1000/60);

    //the entire game happens here
    function gameLoop(){
        update();
        render();
    }
    init();
}