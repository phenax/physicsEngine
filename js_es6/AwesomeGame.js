
import { PhysicsEngine } from './PhysicsEngine';
import { CollisionObject } from './CollisionObject';

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

        this.engine= new PhysicsEngine({
            dimen: this.dimen,
            gravity: true
        });


        this.createRandomObjects(1);
    }


    /**
     * Create random collision objects
     *
     * @param  {number} num  Number of objects to create
     */
    createRandomObjects(num) {
        for(let i= 0; i< num; i++) {
            this.engine.createObject({
                name: 'wow',
                size: 5,
                startPosition: {
                    x: Math.random()*(this.canvas.width),
                    y: Math.random()*(this.canvas.height)
                },
                startVelocity: {
                    x: Math.random() - 0.5,
                    y: Math.random() - 0.5
                }
            });
        }
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
        this.ctx.fillStyle= "#444444";

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
