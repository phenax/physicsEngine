
import { PhysicsEngine } from './PhysicsEngine';
import { CollisionObject } from './CollisionObject';


/**
 * Methods to debug objects from console
 */
function debugObjectMethods(objects) {
    window.moveStuff= function() {
        for(let i= 0; i< objects.length; i++) {
            objects[i].teleport(arguments[2*i], arguments[2*i + 1]).stop();
        }
    };

    window.moveObject= function(i, x1, y1) {
        objects[i].teleport(x1, y1).stop();
    };
}



/**
 * A really awesome game (The author doesnt know what this is yet)
 *
 * @author Akshay Nair<phenax5@gmail.com>
 */
export class AwesomeGame {

    /**
     * AwesomeGame
     *
     * @param  {Object} config  Create an awesome game
     */
    constructor(config) {
        this.canvas= config.canvas;
        this.ctx= this.canvas.getContext('2d');

        this.dimen= {
            width: this.canvas.width,
            height: this.canvas.height
        };

        // Create a new universe
        this.engine= new PhysicsEngine({
            dimen: this.dimen,
            acceleration: { x: 0, y: 0 },
            restitution: 1
        });


        // Introduce random collision objects in the system
        this.createRandomObjects(1);

        window.explode= ()=> {
            this.engine.explode(0, [ 1, 1 ], 4);
        };
    }


    /**
     * Create random collision objects
     *
     * @param  {number} num  Number of objects to create
     */
    createRandomObjects(num) {
        let cObject= [];

        // Generates random number between min to max
        const randomNum= (min, max)=> ( Math.random()*(max - min) + min );

        const randomVal= (arr)=> ( arr[Math.floor(randomNum(0, arr.length))] );

        for(let i= 0; i< num; i++) {

            // More objects
            cObject.push(this.engine.createObject({
                name: 'O-'+1,
                size: randomNum(8, 15),
                // fieldStrength: randomVal([ 3, -3 ]), // randomNum(-3, 3),
                startPosition: {
                    x: randomNum(6, this.canvas.width - 6),
                    y: randomNum(6, this.canvas.height - 6)
                },
                startVelocity: {
                    x: randomNum(-1, 1),
                    y: randomNum(-1, 1)
                }
            }));
        }

        debugObjectMethods(cObject);
    }


    /**
     * Starts the canvas animation
     */
    start() {
        this.drawGame= this.drawGame.bind(this);
        window.requestAnimationFrame(this.drawGame);
    }


    /**
     * Draws objects on the canvas
     */
    drawGame() {

        // Ball colors
        this.ctx.fillStyle= "#51e980";

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.dimen.width, this.dimen.height);

        // For every object
        for(let i= 0; i< this.engine.objects.length; i++) {
            const obj= this.engine.objects[i];

            this.ctx.beginPath();

            // Draw a circle
            this.ctx.arc(obj.position.x, obj.position.y, obj.size, 0, Math.PI*2);

            this.ctx.fill();
        }

        // Call again
        window.requestAnimationFrame(this.drawGame);
    }
}
