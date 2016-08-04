/**
 * The collision object for the physics engine
 *
 * @author Akshay Nair<phenax5@gmail.com>
 */
export class CollisionObject {


    // Static function as constant due to lack of static variables
    static CIRCLE() { return 1; }




    /**
     * CollisionObject
     *
     * @param  {Object} config  The collision object configuration
     */
    constructor(config) {
        this.name= name || "obj";

        // Object size
        this.size= config.size || 4;

        // Shape of the object
        this.shape= config.shape || CollisionObject.CIRCLE();                      // TODO: Add more object shapes

        // Initial position, velocity and acceleration of the object
        this.position= config.startPosition || { x: 0, y: 0 };                     // TODO: Add getters and setters for position,
        this.velocity= config.startVelocity || { x: 0, y: 0 };                     //  velocity and acceleration (maybe)
        this.acceleration= config.startAcc  || { x: 0, y: 0 };

        // External acceleration(between two particles)
        this.extAcceleration= { x: 0, y: 0 };

        this.fieldStrength= config.fieldStrength || 0;
    }









    /**
     * Gets the distance between two CollisionObjects
     *
     * @param  {CollisionObject} collisionObject  The object to measure the
     *                                            distance to
     *
     * @return {Number}                           The distance between this
     *                                            and collisionObject
     */
    getDistanceFromObject(collisionObject) {

        // sqrt( (x1 - x2)^2 + (y1 - y2)^2 )
        return Math.sqrt(
            Math.pow( this.position.x - collisionObject.position.x, 2 ) +
            Math.pow( this.position.y - collisionObject.position.y, 2 )
        );
    }


    /**
     * Gets the shortest distance betweeen the surfaces between the two objects
     *
     * @param  {CollisionObject} collisionObject  The object to measure the
     *                                            distance to
     *
     * @return {Number}                           The surface distance between
     *                                            this and collisionObject
     */
    getSurfaceDistanceFromObject(collisionObject) {

        // center_distance - radius1 - radius2
        return (
            this.getDistanceFromObject(collisionObject) -
            collisionObject.size -
            this.size
        );
    }








    /**
     * Gets the angle of motion of the collision object
     *
     * @return {Number}  The angle in radians
     */
    getAngle() {

        // If vx/vy == inf, angle= 90deg
        if(this.velocity.x == 0)
            return Math.PI/2;

        // tan_inverse( vx / vy )
        return Math.atan( this.velocity.y / this.velocity.x );
    }


    /**
     * Get the angle of contact between two objects
     *
     * @param  {CollisionObject} collisionObject  The object about to collide
     *                                            with this
     * @return {Number}                           The angle of contact
     */
    getContactAngleWith(collisionObject) {

        // If angle could be inf, return 90deg
        if(( this.position.x - collisionObject.position.x ) == 0)
            return Math.PI/2;

        // tan_inverse((y2 - y1) / (x2 - x1))
        return Math.atan(
            ( this.position.y - collisionObject.position.y ) /
            ( this.position.x - collisionObject.position.x )
        );
    }







    /**
     * The netvelocity of the object
     *
     * @return {Number}  The velocity of this
     */
    getVelocity() {

        // sqrt( vx^2 + vy^2 )
        return Math.sqrt(
            Math.pow(this.velocity.x, 2) +
            Math.pow(this.velocity.y, 2)
        );
    }








    /**
     * Finds the velocity of this when its collided with collisionObject
     *
     * @param  {CollisionObject} collisionObject  The object this collides with
     *
     * @return {Object}                           The velocity { x, y }
     */
    finalVelocity(collisionObject) {
        let k1;

        // Their angle of motion
        const angle1= this.getAngle();
        const angle2= collisionObject.getAngle();

        // The contact angle of object 1 and 2
        const angleC= Math.abs(this.getContactAngleWith(collisionObject));

        // Their masses
        const mass1= this.getArea();
        const mass2= collisionObject.getArea();

        const k2= this.getVelocity()*Math.sin(angle1 - angleC);

        k1= (mass1 - mass2) * this.getVelocity() *
            Math.cos( angle1 - angleC );

        k1+= 2*mass2 * collisionObject.getVelocity() *
            Math.cos( angle2 - angleC );

        k1/= (mass1 + mass2);


        // Velocity of the object after collision
        const velocity= {
            x: k1*Math.cos(angleC) + k2*Math.cos((Math.PI/2) + angleC),
            y: k1*Math.sin(angleC) + k2*Math.sin((Math.PI/2) + angleC)
        };

        return velocity;
    }



    /**
     * Calulates the collision between two objects
     *
     * @param  {CollisionObject} collisionObject  Collision object
     */
    collisionWith(collisionObject) {
        const vel= [];

        // Calculate and store final velocity of the objects
        vel[0]= this.finalVelocity(collisionObject);
        vel[1]= collisionObject.finalVelocity(this);


        // Change object velocity
        this.velocity= vel[0];
        collisionObject.velocity= vel[1];
    }



    /**
     * Checks if this will collide with the wall
     *
     * @param  {Object}  dimen  The dimensions / boundaries
     */
    wallCollision(dimen, restitution) {
        let upperBound,  // The upper bound condition
            lowerBound;  // The lower bound condition

        upperBound= (this.position.x + this.size >= dimen.width);
        lowerBound= (this.position.x - this.size <= 0);

        // If either of them are crossed, invert the velocity
        if(upperBound || lowerBound) {
            this.velocity.x*= -(1/restitution);
        }

        upperBound= (this.position.y + this.size >= dimen.height);
        lowerBound= (this.position.y - this.size <= 0);

        // What he said ^
        if(upperBound || lowerBound) {
            this.velocity.y*= -(1/restitution);
        }
    }







    /**
     * Calculates the acceleration between two collision objects(particles)
     * due to the mutual interactions
     *
     * @param  {CollisionObject}  collisionObject   Second force field source
     * @param  {Number}           constant          Alter the force field
     *                                              -ve to change direction
     *
     * @return {List}                               List of acceleration of the
     *                                              two objects
     */
    calculateForceFieldsWith(collisionObject, constant) {

        // By default, repulsion
        constant= constant || 1;

        // Compares two numbers
        const evSign= (d1, d2)=> (( d1 > d2 )? 1: -1);

        // Center-to-center distance
        const distance= this.getDistanceFromObject(collisionObject);


        let gConst= this.fieldStrength * collisionObject.fieldStrength;

        // Tweak the value of force field strength
        gConst*= constant;

        // inversly proportional to distance-squared
        gConst/= (distance*distance);


        // Angle of contact(Angle made by the center)
        const angC= Math.abs(this.getContactAngleWith(collisionObject));

        // The direction of motion of the
        const signs= [ ];
        signs.push(evSign(this.position.x, collisionObject.position.x));
        signs.push(evSign(this.position.y, collisionObject.position.y));

        const acc1= gConst*this.size;
        const acc2= -gConst*collisionObject.size;


        return [
            {
                x: signs[0]*acc1*Math.cos(angC),
                y: signs[1]*acc1*Math.sin(angC)
            },
            {
                x: signs[0]*acc2*Math.cos(angC),
                y: signs[1]*acc2*Math.sin(angC)
            }
        ];
    }








    /**
     * Teleports the object to a new position
     *
     * @param  {Number} x The X coordinate of the new position
     * @param  {Number} y The Y coordinate of the new position
     */
    teleport(x, y) {
        this.position= { x, y };

        return this;
    }




    /**
     * Stop the object in motion i.e. acceleration and velocity become 0
     */
    stop() {
        this.velocity= { x: 0, y: 0 };
        this.acceleration= { x: 0, y: 0 };

        return this;
    }






    /**
     * Find area of the object
     *
     * @return {Number}  The area of the object
     */
    getArea() {

        // Only a circle for now
        return Math.PI*this.size*this.size;
    }

    /**
     * Find the dimension(s) of the object
     *
     * @param  {Number} area The area of the object
     *
     * @return {Number}      The dimension of the object
     */
    getDimenFromArea(area) {

        // Only for a circle
        return Math.sqrt(area/Math.PI);
    }
}
