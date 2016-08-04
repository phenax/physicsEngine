/**
* Engine for handling object physics
*
* @author Akshay Nair<phenax5@gmail.com>
*/


import { CollisionObject } from './CollisionObject';



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
        this.systemAcceleration= config.acceleration || { x: 0, y: 0 };

        // Coefficient of restitution
        this.restitution= config.restitution || 1;

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

            // Change the position of the object(Velocity)
            this.objects[i].position.x+= this.objects[i].velocity.x;
            this.objects[i].position.y+= this.objects[i].velocity.y;

            // Change in velocity(The net acceleration acting on the object)
            this.objects[i].velocity.x+= this.objects[i].acceleration.x +
                this.objects[i].extAcceleration.x +
                this.systemAcceleration.x;

            this.objects[i].velocity.y+= this.objects[i].acceleration.y +
                this.objects[i].extAcceleration.y +
                this.systemAcceleration.y;


            // Check for wall collisions
            this.objects[i].wallCollision(this.dimen, this.restitution);
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
     * Creates N number of objects
     *
     * @param  {Number}   numberOfObjects  Number of collison objects added
     * @param  {Function} callback         The callback function to fetch the
     *                                     required configuration(params: index)
     */
    createNObjects(numberOfObjects, callback) {
        for(let i= 0; i< numberOfObjects; i++)
        this.createObject(callback(i));
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
                if(distance >= 0) {

                    // Evaluate external acceleration
                    this.evaluateExternalAcceleration(object, this.objects[j]);

                    continue;
                }


                // Collide Object #1 with object at `j`
                object.collisionWith(this.objects[j]);
            }
        }
    }







    /**
     * Evaluates all types of external acceleration applied
     *
     * @param  {CollisionObject} object1   A collision object
     * @param  {CollisionObject} object2   A collision object
     */
    evaluateExternalAcceleration(object1, object2) {

        // Calculate the acceleration due to the force fields
        let forceFieldAcc= object1.calculateForceFieldsWith(object2);

        // Apply external accelerations
        object1.extAcceleration= forceFieldAcc[0];
        object2.extAcceleration= forceFieldAcc[1];
    }








    /**
     * Destroy a collision object from this universe
     *
     * @param  {Number} index  The index position of the object being removed
     */
    annihilate(index) {
        this.objects.splice(index, 1);
    }








    /**
     * Calculate the velocity of the exploded particles
     *
     * @param  {CollisionObject} collisionObject The particle to explode
     * @param  {Number}          radius          The radius of the particle
     * @param  {Number}          explosionFactor The energy involved in the
     *                                           explosion
     *
     * @return {Object}                          The list of velocity of the
     *                                           particles created after the
     *                                           explosion
     */
    calculateExplosionVelocity(collisionObject, radius, explosionFactor) {

        // The angle of projection of the first exploded particle
        const angle= (Math.PI/2) + collisionObject.getAngle();

        // Coordinates
        const x= -Math.cos(angle)*explosionFactor/radius[0];
        const y= -Math.sin(angle)*explosionFactor/radius[0];

        return [
            { x:  x, y:  y },
            { x: -x, y: -y }
        ];
    }








    /**
     * Explodes a collision object
     *
     * @param  {Number} index           The index position of the element to
     *                                  explode
     * @param  {List}   parts           Ratio to explode the particles
     *                                  Eg - [ 3, 2, 1 ] = Ratio 3:2:1
     * @param  {Number} explosionFactor The energy involved in the explosion
     */
    explode(index, parts, explosionFactor) {

        // Only two partitions for now
        if(parts.length != 2) return;

        // The object exploding
        const object= this.objects[index];

        // The sum of the partitions
        const sum= parts.reduce((total, val) => total + val, 0);

        // The list of radius of particles(the partitions)
        const radius=
            parts.map((val)=>
                object.getDimenFromArea(object.getArea()*val/sum));

        // The velocity of the new particles
        const startVelocity=
            this.calculateExplosionVelocity(object, radius, explosionFactor);

        // The inital position constants
        const positionConst= {
            x: object.size*Math.cos(90 + object.getAngle()),
            y: object.size*Math.sin(90 + object.getAngle())
        };

        // Get the position of the i-th partition
        const getStartPosition=
            (i)=> {
                return {
                    x: Math.pow(-1, i + 1)*positionConst.x + object.position.x,
                    y: Math.pow(-1, i + 1)*positionConst.y + object.position.y
                }
            };

        // Create all the partitions and introduce them to this universe
        this.createNObjects(radius.length,
            (i)=> ({
                size: radius[i],
                name: 'O-wow',
                startPosition: getStartPosition(i),
                startVelocity: {
                    x: startVelocity[i].x + object.velocity.x,
                    y: startVelocity[i].y + object.velocity.y,
                },
            })
        );

        // Destroy the initial particle from existence
        this.annihilate(index);
    }
}
