(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AwesomeGame = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PhysicsEngine = require('./PhysicsEngine');

var _CollisionObject = require('./CollisionObject');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Methods to debug objects from console
 */
function debugObjectMethods(objects) {
    window.moveStuff = function () {
        for (var i = 0; i < objects.length; i++) {
            objects[i].teleport(arguments[2 * i], arguments[2 * i + 1]).stop();
        }
    };

    window.moveObject = function (i, x1, y1) {
        objects[i].teleport(x1, y1).stop();
    };
}

/**
 * A really awesome game (The author doesnt know what this is yet)
 *
 * @author Akshay Nair<phenax5@gmail.com>
 */

var AwesomeGame = exports.AwesomeGame = function () {

    /**
     * AwesomeGame
     *
     * @param  {Object} config  Create an awesome game
     */
    function AwesomeGame(config) {
        var _this = this;

        _classCallCheck(this, AwesomeGame);

        this.canvas = config.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.dimen = {
            width: this.canvas.width,
            height: this.canvas.height
        };

        // Create a new universe
        this.engine = new _PhysicsEngine.PhysicsEngine({
            dimen: this.dimen,
            acceleration: { x: 0, y: 0 },
            restitution: 1
        });

        // Introduce random collision objects in the system
        this.createRandomObjects(1);

        window.explode = function () {
            _this.engine.explode(0, [1, 1], 4);
        };
    }

    /**
     * Create random collision objects
     *
     * @param  {number} num  Number of objects to create
     */


    _createClass(AwesomeGame, [{
        key: 'createRandomObjects',
        value: function createRandomObjects(num) {
            var cObject = [];

            // Generates random number between min to max
            var randomNum = function randomNum(min, max) {
                return Math.random() * (max - min) + min;
            };

            var randomVal = function randomVal(arr) {
                return arr[Math.floor(randomNum(0, arr.length))];
            };

            for (var i = 0; i < num; i++) {

                // More objects
                cObject.push(this.engine.createObject({
                    name: 'O-' + 1,
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

    }, {
        key: 'start',
        value: function start() {
            this.drawGame = this.drawGame.bind(this);
            window.requestAnimationFrame(this.drawGame);
        }

        /**
         * Draws objects on the canvas
         */

    }, {
        key: 'drawGame',
        value: function drawGame() {

            // Ball colors
            this.ctx.fillStyle = "#51e980";

            // Clear the canvas
            this.ctx.clearRect(0, 0, this.dimen.width, this.dimen.height);

            // For every object
            for (var i = 0; i < this.engine.objects.length; i++) {
                var obj = this.engine.objects[i];

                this.ctx.beginPath();

                // Draw a circle
                this.ctx.arc(obj.position.x, obj.position.y, obj.size, 0, Math.PI * 2);

                this.ctx.fill();
            }

            // Call again
            window.requestAnimationFrame(this.drawGame);
        }
    }]);

    return AwesomeGame;
}();

},{"./CollisionObject":2,"./PhysicsEngine":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The collision object for the physics engine
 *
 * @author Akshay Nair<phenax5@gmail.com>
 */
var CollisionObject = exports.CollisionObject = function () {
    _createClass(CollisionObject, null, [{
        key: "CIRCLE",


        // Static function as constant due to lack of static variables
        value: function CIRCLE() {
            return 1;
        }

        /**
         * CollisionObject
         *
         * @param  {Object} config  The collision object configuration
         */

    }]);

    function CollisionObject(config) {
        _classCallCheck(this, CollisionObject);

        this.name = name || "obj";

        // Object size
        this.size = config.size || 4;

        // Shape of the object
        this.shape = config.shape || CollisionObject.CIRCLE(); // TODO: Add more object shapes

        // Initial position, velocity and acceleration of the object
        this.position = config.startPosition || { x: 0, y: 0 }; // TODO: Add getters and setters for position,
        this.velocity = config.startVelocity || { x: 0, y: 0 }; //  velocity and acceleration (maybe)
        this.acceleration = config.startAcc || { x: 0, y: 0 };

        // External acceleration(between two particles)
        this.extAcceleration = { x: 0, y: 0 };

        this.fieldStrength = config.fieldStrength || 0;
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


    _createClass(CollisionObject, [{
        key: "getDistanceFromObject",
        value: function getDistanceFromObject(collisionObject) {

            // sqrt( (x1 - x2)^2 + (y1 - y2)^2 )
            return Math.sqrt(Math.pow(this.position.x - collisionObject.position.x, 2) + Math.pow(this.position.y - collisionObject.position.y, 2));
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

    }, {
        key: "getSurfaceDistanceFromObject",
        value: function getSurfaceDistanceFromObject(collisionObject) {

            // center_distance - radius1 - radius2
            return this.getDistanceFromObject(collisionObject) - collisionObject.size - this.size;
        }

        /**
         * Gets the angle of motion of the collision object
         *
         * @return {Number}  The angle in radians
         */

    }, {
        key: "getAngle",
        value: function getAngle() {

            // If vx/vy == inf, angle= 90deg
            if (this.velocity.x == 0) return Math.PI / 2;

            // tan_inverse( vx / vy )
            return Math.atan(this.velocity.y / this.velocity.x);
        }

        /**
         * Get the angle of contact between two objects
         *
         * @param  {CollisionObject} collisionObject  The object about to collide
         *                                            with this
         * @return {Number}                           The angle of contact
         */

    }, {
        key: "getContactAngleWith",
        value: function getContactAngleWith(collisionObject) {

            // If angle could be inf, return 90deg
            if (this.position.x - collisionObject.position.x == 0) return Math.PI / 2;

            // tan_inverse((y2 - y1) / (x2 - x1))
            return Math.atan((this.position.y - collisionObject.position.y) / (this.position.x - collisionObject.position.x));
        }

        /**
         * The netvelocity of the object
         *
         * @return {Number}  The velocity of this
         */

    }, {
        key: "getVelocity",
        value: function getVelocity() {

            // sqrt( vx^2 + vy^2 )
            return Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
        }

        /**
         * Finds the velocity of this when its collided with collisionObject
         *
         * @param  {CollisionObject} collisionObject  The object this collides with
         *
         * @return {Object}                           The velocity { x, y }
         */

    }, {
        key: "finalVelocity",
        value: function finalVelocity(collisionObject) {
            var k1 = void 0;

            // Their angle of motion
            var angle1 = this.getAngle();
            var angle2 = collisionObject.getAngle();

            // The contact angle of object 1 and 2
            var angleC = Math.abs(this.getContactAngleWith(collisionObject));

            // Their masses
            var mass1 = this.getArea();
            var mass2 = collisionObject.getArea();

            var k2 = this.getVelocity() * Math.sin(angle1 - angleC);

            k1 = (mass1 - mass2) * this.getVelocity() * Math.cos(angle1 - angleC);

            k1 += 2 * mass2 * collisionObject.getVelocity() * Math.cos(angle2 - angleC);

            k1 /= mass1 + mass2;

            // Velocity of the object after collision
            var velocity = {
                x: k1 * Math.cos(angleC) + k2 * Math.cos(Math.PI / 2 + angleC),
                y: k1 * Math.sin(angleC) + k2 * Math.sin(Math.PI / 2 + angleC)
            };

            return velocity;
        }

        /**
         * Calulates the collision between two objects
         *
         * @param  {CollisionObject} collisionObject  Collision object
         */

    }, {
        key: "collisionWith",
        value: function collisionWith(collisionObject) {
            var vel = [];

            // Calculate and store final velocity of the objects
            vel[0] = this.finalVelocity(collisionObject);
            vel[1] = collisionObject.finalVelocity(this);

            // Change object velocity
            this.velocity = vel[0];
            collisionObject.velocity = vel[1];
        }

        /**
         * Checks if this will collide with the wall
         *
         * @param  {Object}  dimen  The dimensions / boundaries
         */

    }, {
        key: "wallCollision",
        value: function wallCollision(dimen, restitution) {
            var upperBound = void 0,
                // The upper bound condition
            lowerBound = void 0; // The lower bound condition

            upperBound = this.position.x + this.size >= dimen.width;
            lowerBound = this.position.x - this.size <= 0;

            // If either of them are crossed, invert the velocity
            if (upperBound || lowerBound) {
                this.velocity.x *= -(1 / restitution);
            }

            upperBound = this.position.y + this.size >= dimen.height;
            lowerBound = this.position.y - this.size <= 0;

            // What he said ^
            if (upperBound || lowerBound) {
                this.velocity.y *= -(1 / restitution);
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

    }, {
        key: "calculateForceFieldsWith",
        value: function calculateForceFieldsWith(collisionObject, constant) {

            // By default, repulsion
            constant = constant || 1;

            // Compares two numbers
            var evSign = function evSign(d1, d2) {
                return d1 > d2 ? 1 : -1;
            };

            // Center-to-center distance
            var distance = this.getDistanceFromObject(collisionObject);

            var gConst = this.fieldStrength * collisionObject.fieldStrength;

            // Tweak the value of force field strength
            gConst *= constant;

            // inversly proportional to distance-squared
            gConst /= distance * distance;

            // Angle of contact(Angle made by the center)
            var angC = Math.abs(this.getContactAngleWith(collisionObject));

            // The direction of motion of the
            var signs = [];
            signs.push(evSign(this.position.x, collisionObject.position.x));
            signs.push(evSign(this.position.y, collisionObject.position.y));

            var acc1 = gConst * this.size;
            var acc2 = -gConst * collisionObject.size;

            return [{
                x: signs[0] * acc1 * Math.cos(angC),
                y: signs[1] * acc1 * Math.sin(angC)
            }, {
                x: signs[0] * acc2 * Math.cos(angC),
                y: signs[1] * acc2 * Math.sin(angC)
            }];
        }

        /**
         * Teleports the object to a new position
         *
         * @param  {Number} x The X coordinate of the new position
         * @param  {Number} y The Y coordinate of the new position
         */

    }, {
        key: "teleport",
        value: function teleport(x, y) {
            this.position = { x: x, y: y };

            return this;
        }

        /**
         * Stop the object in motion i.e. acceleration and velocity become 0
         */

    }, {
        key: "stop",
        value: function stop() {
            this.velocity = { x: 0, y: 0 };
            this.acceleration = { x: 0, y: 0 };

            return this;
        }

        /**
         * Find area of the object
         *
         * @return {Number}  The area of the object
         */

    }, {
        key: "getArea",
        value: function getArea() {

            // Only a circle for now
            return Math.PI * this.size * this.size;
        }

        /**
         * Find the dimension(s) of the object
         *
         * @param  {Number} area The area of the object
         *
         * @return {Number}      The dimension of the object
         */

    }, {
        key: "getDimenFromArea",
        value: function getDimenFromArea(area) {

            // Only for a circle
            return Math.sqrt(area / Math.PI);
        }
    }]);

    return CollisionObject;
}();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PhysicsEngine = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Engine for handling object physics
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @author Akshay Nair<phenax5@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _CollisionObject = require('./CollisionObject');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhysicsEngine = exports.PhysicsEngine = function () {

    /**
     * PhysicsEngine
     *
     * @param  {Object} config  Engine configurations
     */
    function PhysicsEngine(config) {
        _classCallCheck(this, PhysicsEngine);

        // The canvas dimensions
        this.dimen = config.dimen;

        // True if you want to emulate gravity
        this.systemAcceleration = config.acceleration || { x: 0, y: 0 };

        // Coefficient of restitution
        this.restitution = config.restitution || 1;

        // List of CollisionObject
        this.objects = [];

        // Starts looping frames in a new thread
        this.iterateFrames();
    }

    /**
     * Starts looping through frames
     *
     * @param  {Number} timeout The delay between each frame in ms(default= 0)
     */


    _createClass(PhysicsEngine, [{
        key: 'iterateFrames',
        value: function iterateFrames() {
            var _this = this;

            var timeout = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];


            setInterval(function () {

                // Setup the next frame
                _this.getNextFrame();
            }, timeout);
        }

        /**
         * Calculates the properties of the next frame
         */

    }, {
        key: 'getNextFrame',
        value: function getNextFrame() {

            // Cycle through the objects
            for (var i = 0; i < this.objects.length; i++) {

                // Change the position of the object(Velocity)
                this.objects[i].position.x += this.objects[i].velocity.x;
                this.objects[i].position.y += this.objects[i].velocity.y;

                // Change in velocity(The net acceleration acting on the object)
                this.objects[i].velocity.x += this.objects[i].acceleration.x + this.objects[i].extAcceleration.x + this.systemAcceleration.x;

                this.objects[i].velocity.y += this.objects[i].acceleration.y + this.objects[i].extAcceleration.y + this.systemAcceleration.y;

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

    }, {
        key: 'createObject',
        value: function createObject(config) {
            var object = new _CollisionObject.CollisionObject(config);

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

    }, {
        key: 'createNObjects',
        value: function createNObjects(numberOfObjects, callback) {
            for (var i = 0; i < numberOfObjects; i++) {
                this.createObject(callback(i));
            }
        }

        /**
         * Checks if the surfaces of any two objects are touching each other,
         * and if they are, apply elastic collision.
         */

    }, {
        key: 'checkIfObjectsWillCollide',
        value: function checkIfObjectsWillCollide() {
            var i = void 0,
                j = void 0,
                object = void 0,
                distance = void 0;

            // Iterate through objects
            for (i = 1; i < this.objects.length; i++) {

                // Checks from i-1 to 0 for collision between objects
                for (j = i - 1; j >= 0; j--) {

                    // Object #1
                    object = this.objects[i];

                    // Distance between Object #1 and object at j index position
                    distance = object.getSurfaceDistanceFromObject(this.objects[j]);

                    // If they havent collided, dont collide
                    if (distance >= 0) {

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

    }, {
        key: 'evaluateExternalAcceleration',
        value: function evaluateExternalAcceleration(object1, object2) {

            // Calculate the acceleration due to the force fields
            var forceFieldAcc = object1.calculateForceFieldsWith(object2);

            // Apply external accelerations
            object1.extAcceleration = forceFieldAcc[0];
            object2.extAcceleration = forceFieldAcc[1];
        }

        /**
         * Destroy a collision object from this universe
         *
         * @param  {Number} index  The index position of the object being removed
         */

    }, {
        key: 'annihilate',
        value: function annihilate(index) {
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

    }, {
        key: 'calculateExplosionVelocity',
        value: function calculateExplosionVelocity(collisionObject, radius, explosionFactor) {

            // The angle of projection of the first exploded particle
            var angle = Math.PI / 2 + collisionObject.getAngle();

            // Coordinates
            var x = -Math.cos(angle) * explosionFactor / radius[0];
            var y = -Math.sin(angle) * explosionFactor / radius[0];

            return [{ x: x, y: y }, { x: -x, y: -y }];
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

    }, {
        key: 'explode',
        value: function explode(index, parts, explosionFactor) {

            // Only two partitions for now
            if (parts.length != 2) return;

            // The object exploding
            var object = this.objects[index];

            // The sum of the partitions
            var sum = parts.reduce(function (total, val) {
                return total + val;
            }, 0);

            // The list of radius of particles(the partitions)
            var radius = parts.map(function (val) {
                return object.getDimenFromArea(object.getArea() * val / sum);
            });

            // The velocity of the new particles
            var startVelocity = this.calculateExplosionVelocity(object, radius, explosionFactor);

            // The inital position constants
            var positionConst = {
                x: object.size * Math.cos(90 + object.getAngle()),
                y: object.size * Math.sin(90 + object.getAngle())
            };

            // Get the position of the i-th partition
            var getStartPosition = function getStartPosition(i) {
                return {
                    x: Math.pow(-1, i + 1) * positionConst.x + object.position.x,
                    y: Math.pow(-1, i + 1) * positionConst.y + object.position.y
                };
            };

            // Create all the partitions and introduce them to this universe
            this.createNObjects(radius.length, function (i) {
                return {
                    size: radius[i],
                    name: 'O-wow',
                    startPosition: getStartPosition(i),
                    startVelocity: {
                        x: startVelocity[i].x + object.velocity.x,
                        y: startVelocity[i].y + object.velocity.y
                    }
                };
            });

            // Destroy the initial particle from existence
            this.annihilate(index);
        }
    }]);

    return PhysicsEngine;
}();

},{"./CollisionObject":2}],4:[function(require,module,exports){
'use strict';

var _AwesomeGame = require('./AwesomeGame');

var canvas = document.getElementById('game');

canvas.width = 400;
canvas.height = 400;

var game = new _AwesomeGame.AwesomeGame({
    canvas: canvas
});

game.start();

},{"./AwesomeGame":1}]},{},[4])


//# sourceMappingURL=script.js.map
