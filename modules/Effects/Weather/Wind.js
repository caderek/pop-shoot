import {
    WIND0SPRITE,
    WIND1SPRITE,
    WIND2SPRITE,
    WIND3SPRITE,
    WIND4SPRITE,
    WIND5SPRITE,
    WIND6SPRITE,
    WIND7SPRITE,
    WIND8SPRITE,
} from '../../Assets/Effects.js';
import { CANVAS } from '../../Assets/OtherGfx.js';
import { game } from '../../../app.js';
import { Shake } from '../../Logic/Helpers.js';
import { flashScreen } from '../../Logic/Helpers.js';

const SPRITE = [
    WIND0SPRITE,
    WIND1SPRITE,
    WIND2SPRITE,
    WIND3SPRITE,
    WIND4SPRITE,
    WIND5SPRITE,
    WIND6SPRITE,
    WIND7SPRITE,
    WIND8SPRITE,
];

const SHAKEFREQUENCY = 50; // in ticks, higher = longer

export class Wind {
    constructor() {
        this.x = CANVAS.width / 2;
        this.y = CANVAS.height / 2;
        this.ticks = 0;
        this.duration = 1;
        this.sprite = SPRITE[this.ticks % SPRITE.length];
        game.audiocontroller.playWindSound();
        flashScreen();
    }

    move() {
        this.ticks++;
        this.sprite = SPRITE[this.ticks % SPRITE.length];

        if (this.ticks % SHAKEFREQUENCY === 0) {
            Shake.addShake(2, 1);
        }
    }

    stop() {
        game.audiocontroller.stopWindSound();
        flashScreen();
        this.duration = 0;
    }
}
