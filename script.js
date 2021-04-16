
// Class for the data structure vector for x and y positions
class Vec {

    // constructor for the x and y positions
    constructor(x = 0, y = 0) {
        this.x = x; // position for x 
        this.y = y; // position for y
    }

    // hypotenuse of a triangle
    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    // factor between the value
    set len(value) {
        const fact = value / this.len; 
        this.x *= fact; 
        this.y *= fact; 
    }
}

// Class for the data structure rectangle
class Rect {

    // constructor for the width and height
    constructor(w, h) {
        this.pos = new Vec; // position for vector
        this.size = new Vec(w, h); // position for the size
    }

    // get left side of the ball
    get left() {
        return this.pos.x - this.size.x / 2; // ball reflects
    }

    //get right side of the ball
    get right() {
        return this.pos.x + this.size.x / 2; // ball reflects
    }

    // get the top side of the ball
    get top() {
        return this.pos.y - this.size.y / 2; // ball reflects
    }

    // get the bottom side of the ball
    get bottom() {
        return this.pos.y + this.size.y / 2; // ball reflects
    }
}

// class for the data structure representing the ball and extends the rectangle data structure (Player's Paddle)
class Ball extends Rect{
    constructor() {
        super(10, 10); // super set to 10x10
        this.vel = new Vec; // velocity set to equal to new Vec
    }
}

// player class is set up and extends rectangles
class Player extends Rect {
    constructor() {
        super(20, 100); // 20 in width and 100 in height
        this.score = 0; // player's score is set to zero
    }
}

// declaring a pong class
class Pong {
    constructor (canvas) {
        this._canvas = canvas; 
        this._context = canvas.getContext('2d');

        // This will be used to paint the ball
        this.ball = new Ball;

        

        // array for the players
        this.players = [
            new Player, 
            new Player,
        ];

        this.players[0].pos.x = 40; // puts player 1 on left
        this.players[1].pos.x = this._canvas.width - 40; // puts player 2 on the right

        // puts the players in the middle
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2; 
        });

        // animation frame when browser is ready to draw magnitude and direction of ball
        let lastTime;

        // animation frame at milliseconds
        const callback = (millis) => {

            // if animation frame happened last time, we can calculate the div
            if (lastTime) {
                this.update ((millis - lastTime) / 1000);
            }

            // callback only happens once
            lastTime = millis; 
            requestAnimationFrame(callback); // animation is added to the ball so it will fly over the screen
        };
        callback(); // with this function, you will see the ball move across the screen on the black canvas


        this.CHAR_PIXEL = 10;
        // sets up the graphics for score (align them in a three column matrix to see)
        this.CHARS = [
            '111101101101111', // zero
            '010010010010010', // one
            '111001111100111', // two
            '111001111001111', // three
            '101101111001001', // four
            '111100111001111', // five
            '111100111101111', // six
            '111001001001001', // seven
            '111101111101111', // eight
            '111101111001111', // nine

            // draws out a new canvas
        ].map(str => {
            const canvas = document.createElement('canvas');
            canvas.height = this.CHAR_PIXEL * 5; 
            canvas.width = this.CHAR_PIXEL * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#fff';
            str.split('').forEach((fill, i) => {
                // if fill is equal to one, then paint a pixel 10x10
                if (fill === '1') {
                    context.fillRect(
                        (i % 3) * this.CHAR_PIXEL, 
                        (i / 3 | 0) * this.CHAR_PIXEL,
                        this.CHAR_PIXEL,
                        this.CHAR_PIXEL);
                }
            });
            return canvas;
        });

        this.reset(); // reset initially
    }

    // collision method where the ball will reflect off the players' paddle
    collide(player, ball) {

        // If the ball is colliding with the player's paddle, then the ball will reflect
        if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
            const len = ball.vel.len; // save the current ball velocity
            ball.vel.x = -ball.vel.x; // negate the vertical velocity
            ball.vel.y += 300 * (Math.random() - .5); // fudge the horizontal velocity
            ball.vel.len *= 1.05; // increases the ball's speed when it gets hit by the paddle
        }
    }

    // draw method
    draw() {
        // This will put out the board
        this._context.fillStyle = '#000'; // displays the canvas as black
        this._context.fillRect(0, 0, 
            this._canvas.width, this._canvas.height); // draws out the canvas width and height
            
        
        this.drawRect(this.ball); // draws the ball
        this.players.forEach(player => this.drawRect(player)); // draws out the two paddles the players will use

        this.drawScore();
    }

    // method to draw the rectangle
    drawRect(rect) {
        // This will put out the ball
        this._context.fillStyle = '#fff'; // displays the ball as white
        this._context.fillRect(rect.left, rect.top, 
                                rect.size.x, rect.size.y); // draws the ball out 10x10 pixels
    }

    // draws out the score method
    drawScore() {
        const align = this._canvas.width / 3; // splits the canvas into three spots
        const CHAR_W = this.CHAR_PIXEL * 4; // draws out the width
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * 
                            (index + 1) - 
                            (CHAR_W * chars.length / 2) + 
                            this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0],
                                        offset + pos * CHAR_W, 20);
            });
        });
    }

    // ball resets when it hits left or right side of the screen
    reset() {
        // Change the ball's position on the canvas
        this.ball.pos.x = this._canvas.width / 2; // puts the ball in the middle of x axis
        this.ball.pos.y = this._canvas.height / 2; // puts the ball in the middle of the y axis

        this.ball.vel.x = 0; // ball's velocity at x (numbers represents speed)
        this.ball.vel.y = 0; // ball's velocity at y (numbers represent speed)
    }

    // start method that checks the ball's speed
    start() {
        // if the ball does not move, we can give it speed
        if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {

            // Math.random() will set different directions for the ball to take when game starts 
            this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1); // ball's velocity at x (numbers represents speed)
            this.ball.vel.y = 300 * (Math.random() * 2 - 1); // ball's velocity at y (numbers represent speed)
            this.ball.vel.len = 200; // the ball will have a consistent speed
        }
    }

    // update method
    update(dt) { 
        this.ball.pos.x += this.ball.vel.x * dt; // movment of the ball (on x axis) is relative to the time difference
        this.ball.pos.y += this.ball.vel.y * dt; // movment of the ball (on y axis) is relative to the time difference
    
        // detects if the ball comes in contact with any corner of the screen of the x positions
        if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
            const playerId = this.ball.vel.x < 0 | 0; // player scores when it touches ball
            this.players[playerId].score++; // adds score counter
            this.reset(); // resets the ball
            //console.log(playerId);
            //this.ball.vel.x = -this.ball.vel.x; // reverses the velocity of the ball, when it comes in contact with screen
        }
    
        // detects if the ball comes in contact with any corner of the screen of the y positions
        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y; // reverses the velocity of the ball, when it comes in contact with screen
        }

        // allows player 2 to move the paddle
        this.players[1].pos.y = this.ball.pos.y; // this will make player 2's paddle follow the ball

        this.players.forEach(player => this.collide(player, this.ball));

        this.draw();
    } 
}

const canvas = document.getElementById('pong'); // access the canvas
const pong = new Pong(canvas); // initializes the game

// player 1 can control the paddle by moving the mouse (Feel free to change the controls at your own leisure)
canvas.addEventListener('mousemove', event => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
});

// player clicks on the canvas to start the game
canvas.addEventListener('click', event => {
    pong.start();
});




