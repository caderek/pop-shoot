import { game } from '../../../app.js';
import { DamageNumber } from '../../Effects/Misc/DamageNumber.js';
import { Movement } from './Movement.js';
import { Drone } from '../../Lasers/Friendly/Drone.js';
import { Dart } from '../../Lasers/Friendly/Dart.js';
import { Slash } from '../../Effects/Misc/Slash.js';
import { RedPackage } from '../../Actors/Packages/RedPackage.js';
import { OrangePackage } from '../../Actors/Packages/OrangePackage.js';
import { SceneUtils } from '../../Scene/SceneUtils.js';

export class CollisionActions {
    static BluelasersEnemies(enemy, laser) {
        // Pushback & play sound if the laser is not a drone or dart
        if (laser.constructor !== Drone && laser.constructor !== Dart) {
            enemy.pushBack();
            // Determine which hit-sound to play
            if (enemy.constructor === RedPackage || enemy.constructor === OrangePackage) {
                game.audiocontroller.playSound('hitMetal');
            } else if (game.buffcontroller.quaddamage) {
                game.audiocontroller.playSound('hitQuad');
            } else {
                game.audiocontroller.playSound('hit');
            }
        }

        enemy.takeDamage(laser.damage);
        game.effects.add(new DamageNumber(enemy.x, enemy.y, laser.damage));
        game.effects.add(new Slash(enemy.x, enemy.y));
        laser.shatter();

        if (game.itemactioncontroller.bomb) {
            game.itemactioncontroller.bombAll(laser);
        }

        if (game.itemactioncontroller.airstrike) {
            game.itemactioncontroller.sendAirstrike(laser);
        }

        if (game.itemactioncontroller.darts && !enemy.name) {
            game.itemactioncontroller.stunWithDart(laser, enemy);
        }
    }

    static PlayerEnemies(enemy) {
        if (game.player.shield.isCharged() && !enemy.name) {
            SceneUtils.flashScreen();
            enemy.takeDamage(enemy.hp);
            game.player.shield.deplete();
            if (game.itemactioncontroller.emp) {
                game.itemactioncontroller.blowEmp();
            }
        } else if (game.player.clock.isReady && !game.player.clock.active) {
            game.player.clock.activate();
        } else if (!game.player.clock.active) {
            game.state.setGameOver();
        }
    }

    static PlayerFirelasers(firelaser) {
        if (game.player.shield.isCharged()) {
            SceneUtils.flashScreen();
            firelaser.shatter();
            game.player.shield.deplete();
            if (game.itemactioncontroller.emp) {
                game.itemactioncontroller.blowEmp();
            }
        } else if (game.player.clock.isReady && !game.player.clock.active) {
            game.player.clock.activate();
        } else if (!game.player.clock.active) {
            game.state.setGameOver();
        }
    }

    static CoinPlayer(coin, player) {
        coin.removeAndCount();
    }

    static EnemiesEnemies(enemy1, enemy2) {
        Movement.moveAway(enemy1, enemy2);
    }

    static EnemyCanvas(enemy) {
        Movement.moveToCanvas(enemy);
    }
}
