import { CollisionObject } from './CollisionObject';

/**
 * Engine for handling object physics
 *
 * @author Akshay Nair<phenax5@gmail.com>
 */
export class PhysicsEngine {


    /**
     * PhysicsEngine
     *
     * @param  {Object} config  Engine configurations
     */
    constructor(config) {

        // The canvas dimensions
        this.dimen= config.dimen;

        // True if you want to emulate gravity
        this.gravity= config.gravity;

        this.accGravity= 0.001;

        // List of CollisionObject
        this.objects= [];

        // Starts looping frames in a new thread
        this.iterateFrames();
    }


    /**
     * Starts looping through frames
     *
     * @param  {Number} timeout The delay between each frame in ms(default= 0)
     */
    iterateFrames(timeout= 0) {

        setInterval(()=> {

            // Setup the next frame
            this.getNextFrame();

        }, timeout);
    }


    /**
     * Calculates the properties of the next frame
     */
    getNextFrame() {

        // Cycle through the objects
        for(let i= 0; i< this.objects.length; i++) {

            // Change the position of the object
            this.objects[i].position.x+= this.objects[i].velocity.x;
            this.objects[i].position.y+= this.objects[i].velocity.y;


            if(this.gravity)
                this.objects[i].velocity.y+= this.accGravity;

            // Check for wall collisions
            this.objects[i].wallCollision(this.dimen);
        }

        // Check if objects are about to collide
        this.checkIfObjectsWillCollide();
    }



    /**
     * Creates a new collision object
     *
     * @param  {Object} config   Collision object configurations
     *
     * @return {CollisionObject} The new object
     */
    createObject(config) {
        const object= new CollisionObject(config);

        // Push object to the list of collision objects
        this.objects.push(object);

        return object;
    }


    /**
     * Checks if the surfaces of any two objects are touching each other,
     * and if they are, apply elastic collision.
     */
    checkIfObjectsWillCollide() {
        let i, j, object, distance;

        // Iterate through objects
        for(i= 1; i< this.objects.length; i++) {

            // Checks from i-1 to 0 for collision between objects
            for(j= i - 1; j>= 0; j--) {

                // Object #1
                object= this.objects[i];

                // Distance between Object #1 and object at j index position
                distance= object.getSurfaceDistanceFromObject(this.objects[j]);

                // If they havent collided, dont collide
                if(distance >= 0)
                    continue;

                // Collide Object #1 with object at `j`
                object.collisionWith(this.objects[j]);
            }
        }
    }


}
