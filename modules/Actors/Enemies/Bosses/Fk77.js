import { Enemy } from '../Enemy.js';
import { Movement } from '../../../Logic/Motion/Movement.js';
import { game } from '../../../../app.js';
import { flashScreen, randomInRange } from '../../../Logic/Helpers.js';
import { Shake } from '../../../Logic/Helpers.js';
import { YellowUfo } from '../Types/YellowUfo.js';
import { FK77HARDENEDSPRITE, FK77SPRITE } from '../../../Assets/Enemies.js';
import { FireLaser } from '../../../Lasers/Hostile/FireLaser.js';

// MOVEMENT
const SPEED = 5;
const LOWEST_POINT = 165;
const XPOS = 560;
const SOUTH = 90; // Angle (0=EAST 90=South 180=WEST 270=NORTH)

// SHOOTING
const SPAWN_RATE = 150; // UFO SPAWN RATE. LOWER = FASTER
const P2_SPAWN_RATE = 100; // UFO SPAWN RATE. LOWER = FASTER
const P3_SPAWN_RATE = 50; // UFO SPAWN RATE. LOWER = FASTER

// HARDEN
const HARDEN_RATE = 2000; // in ticks. lower = faster
const HARDEN_TIME = 15000; // in ms
const HARDEN_BULLETSPEED = 3;

// STATE
const HP = 50000;
const SCOREBALLS = 120;
const RADIUS = 50;
const SPRITE = FK77SPRITE;
const NAME = '4K77';

// PHASES (Rates, e.g. 0.75 = when boss reaches 75% of HP)
// When the boss reaches a certain HP amount, it will fire
// additional layers of lasers as well as laser-rain
const PHASE2_HP = 0.5;
const PHASE3_HP = 0.25;

export class Fk77 extends Enemy {
    constructor() {
        super(RADIUS, HP, SCOREBALLS, SPRITE, SPEED);
        this.x = XPOS;

        // BOSS SPECIFIC ------------
        this.name = NAME;
        game.state.toggleBoss();
        // --------------------------
        this.spawnUfo();
        this.hardened = false;
    }

    move() {
        if (this.y <= LOWEST_POINT) {
            this.x += Movement.move(SOUTH, this.speed).x;
            this.y += Movement.move(SOUTH, this.speed).y;
        }

        this.step();
    }

    takeDamage(damage) {
        if (this.hardened) {
            this.shoot();
        }
        super.takeDamage(damage);
        Shake.addShake(2, 0.25);
    }

    shoot() {
        game.firelasers.add(new FireLaser(XPOS, LOWEST_POINT, randomInRange(0, 360), HARDEN_BULLETSPEED));
    }

    step() {
        super.step();

        // Set ufo spawnrate according to boss phase & spawn it
        let spawnrate = SPAWN_RATE;
        if (this.hp < HP * PHASE2_HP) {
            spawnrate = P2_SPAWN_RATE;
        }
        if (this.hp < HP * PHASE3_HP) {
            spawnrate = P3_SPAWN_RATE;
        }
        if (this.steps % spawnrate === 0) {
            this.spawnUfo();
        }

        // Harden
        if (this.steps % HARDEN_RATE === 0) {
            this.harden();
        }
    }

    soften() {
        this.hardened = false;
        game.audiocontroller.playSwooshSound();
        flashScreen();
        this.sprite = FK77SPRITE;
        Shake.addShake(3, 0.5);
    }

    harden() {
        this.hardened = true;
        game.audiocontroller.playSwooshSound();
        game.enemies.clear();
        flashScreen();
        this.sprite = FK77HARDENEDSPRITE;
        Shake.addShake(3, 0.5);

        setTimeout(() => {
            this.soften();
        }, HARDEN_TIME);
    }

    spawnUfo() {
        if (!this.hardened) {
            const coordinates = [randomInRange(30, 400), randomInRange(680, 920)];
            const roll = coordinates[randomInRange(0, coordinates.length - 1)];
            game.enemies.add(new YellowUfo(roll));
        }
    }

    die() {
        super.die();
        game.audiocontroller.playAnimationSound('exp_big');
        Shake.addShake(6, 2);
        game.state.toggleBoss();
    }
}
