// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


import * as Creepts from "@cartesi/creepts-engine";
import { GameOverLayer } from "./GameOverLayer";
import { MineActor } from "./turret-actors/MineActor";
import { TurretMenu } from "./TurretMenu";
import { GluePool } from "./turret-actors/GluePool";
import { EnemyActor } from "./enemy-actors/EnemyActor";
import { TurretActor } from "./turret-actors/TurretActor";
import { Board } from "./Board";
import { GameConstants } from "../../GameConstants";
import { BulletActor } from "./turret-actors/BulletActor";
import { GameVars } from "../../GameVars";
import { HealerEnemyActor } from "./enemy-actors/HealerEnemyActor";
import { ProjectileTurretActor } from "./turret-actors/ProjectileTurretActor";
import { LaserTurretActor } from "./turret-actors/LaserTurretActor";
import { LaserBeam } from "./turret-actors/LaserBeam";
import { LaunchTurretActor } from "./turret-actors/LaunchTurretActor";
import { MortarActor } from "./turret-actors/MortarActor";
import { GlueTurretActor } from "./turret-actors/GlueTurretActor";
import { BattleManager } from "./BattleManager";
import { PauseMenu } from "./PauseMenu";
import { GlueBulletActor } from "./turret-actors/GlueBulletActor";
import { AudioManager } from "../../AudioManager";
import { RoundCompletedLayer } from "./RoundCompletedLayer";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static currentInstance: BoardContainer;

    private board: Board;
    private deadEnemyActors: EnemyActor[];
    private enemyActors: EnemyActor[];
    private turretActors: TurretActor[];
    private bulletActors: BulletActor[];
    private glueBulletActors: GlueBulletActor[];
    private mortarActors: MortarActor[];
    private mineActors: MineActor[];

    private rangeCircles: Phaser.GameObjects.Image[];
    private glueCircles: Phaser.GameObjects.Graphics[];

    private turretMenu: TurretMenu;
    private pauseMenu: PauseMenu;
    private gameOverLayer: GameOverLayer;
    private roundCompletedLayer: RoundCompletedLayer;

    private pointerContainer: Phaser.GameObjects.Container;
    private glueCirclesContainer: Phaser.GameObjects.Container;
    private circlesContainer: Phaser.GameObjects.Container;
    private actorsContainer: Phaser.GameObjects.Container;

    private gluePools: GluePool[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        BoardContainer.currentInstance = this;

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = GameConstants.GAME_HEIGHT / 2 + GameConstants.CELLS_SIZE;

        this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleCorrectionFactor * GameVars.scaleY;

        this.deadEnemyActors = [];
        this.enemyActors = [];
        this.turretActors = [];
        this.bulletActors = [];
        this.glueBulletActors = [];
        this.mortarActors = [];
        this.mineActors = [];
        this.rangeCircles = [];

        this.gluePools = [];
        this.glueCircles = [];

        this.board = new Board(this.scene);
        this.add(this.board);

        if (GameConstants.SHOW_DEBUG_GEOMETRY) {
            this.drawDebugGeometry();
        }

        this.pointerContainer = new Phaser.GameObjects.Container(this.scene);
        this.board.add(this.pointerContainer);

        this.glueCirclesContainer = new Phaser.GameObjects.Container(this.scene);
        this.board.add(this.glueCirclesContainer);

        this.pointerContainer.setInteractive(new Phaser.Geom.Rectangle(0, - GameConstants.GAME_HEIGHT, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT * 4), Phaser.Geom.Rectangle.Contains);
        this.pointerContainer.on("pointerdown", () => { this.onPointerDown(); });

        this.actorsContainer = new Phaser.GameObjects.Container(this.scene);
        this.board.add(this.actorsContainer);

        this.circlesContainer = new Phaser.GameObjects.Container(this.scene);
        this.board.add(this.circlesContainer);

        this.createAnimations();
    }

    public addInitialTowers(): void {

        this.addTurret(Creepts.GameConstants.TURRET_LASER, {r: 0, c: 5});
        this.addTurret(Creepts.GameConstants.TURRET_LASER, {r: 1, c: 7});
        this.addTurret(Creepts.GameConstants.TURRET_LASER, {r: 2, c: 4});
        this.addTurret(Creepts.GameConstants.TURRET_LASER, {r: 3, c: 7});
        this.addTurret(Creepts.GameConstants.TURRET_LASER, {r: 4, c: 6});

        this.addTurret(Creepts.GameConstants.TURRET_GLUE, {r: 0, c: 4});
        this.addTurret(Creepts.GameConstants.TURRET_GLUE, {r: 0, c: 6});
        this.addTurret(Creepts.GameConstants.TURRET_GLUE, {r: 2, c: 3});
        this.addTurret(Creepts.GameConstants.TURRET_GLUE, {r: 2, c: 5});
        this.addTurret(Creepts.GameConstants.TURRET_GLUE, {r: 2, c: 7});
        this.addTurret(Creepts.GameConstants.TURRET_GLUE, {r: 4, c: 3});
        this.addTurret(Creepts.GameConstants.TURRET_GLUE, {r: 4, c: 5});
    }

    public update(time: number, delta: number): void {

        for (let i = 0; i < this.deadEnemyActors.length; i++) {
            const index = this.enemyActors.indexOf(this.deadEnemyActors[i]);
            if (index !== -1) {
                this.enemyActors.splice(index, 1);
            }
        }

        this.enemyActors.forEach(function (enemy) {
            enemy.update(time, delta);
        }); 

        this.turretActors.forEach(function (tower) {
            tower.update(time, delta);
        }); 

        this.bulletActors.forEach(function (bullet) {
            bullet.update(time, delta);
        }); 

        this.glueBulletActors.forEach(function (bullet) {
            bullet.update(time, delta);
        }); 

        this.mortarActors.forEach(function (mortar) {
            mortar.update(time, delta);
        }); 
    }

    public updateTurretMenu(): void {

        if (this.turretMenu) {
            this.turretMenu.checkAndUpdateInfo();
        }
    }

    public addEnemy(enemy: Creepts.Enemy, position: {r: number, c: number}): void {

        let enemyActor: EnemyActor = null;

        switch (enemy.type) {

            case Creepts.GameConstants.ENEMY_HEALER:
                enemyActor = new HealerEnemyActor(this.scene, enemy, position);
                break;
            default:
                enemyActor = new EnemyActor(this.scene, enemy, position);
                break;
        }
        
        if (enemyActor) {
            this.actorsContainer.add(enemyActor);
            this.enemyActors.push(enemyActor);
        }
    }

    public removeEnemy(id: number): void {

        let i: number;
        for (i = 0; i < this.enemyActors.length; i ++) {
            if (this.enemyActors[i].id === id) {
               break; 
            }
        }

        const enemy = this.enemyActors[i];

        if (enemy) {
            this.enemyActors.splice(i, 1);
            enemy.destroy();
        }
    }

    public addTurret(type: string, position: {r: number, c: number}): void {

        if ( position.r < 0 || position.c < 0 || position.r >= GameVars.currentMapData.size.r || position.c >= GameVars.currentMapData.size.c) {
            return;
        }

        for (let i = 0; i < GameVars.enemiesPathCells.length; i++) {
            if (position.c === GameVars.enemiesPathCells[i].c && position.r === GameVars.enemiesPathCells[i].r) {
                return;
            }
        }

        for (let i = 0; i < this.turretActors.length; i++) {
            if (position.c === this.turretActors[i].turret.position.c && position.r === this.turretActors[i].turret.position.r) {
                return;
            }
        }

        let isOnPlateau = false;

        if (GameVars.plateausCells.length !== 0) {
            for (let i = 0; i < GameVars.plateausCells.length; i++) {
                if (GameVars.plateausCells[i].c === position.c && GameVars.plateausCells[i].r === position.r) {
                    isOnPlateau = true;
                    break;
                }
            }
        } else {
            isOnPlateau = true;
        }

        if (!isOnPlateau) {
            return;
        }

        let turretActor: TurretActor;
        let turret = BattleManager.addTurret(type, position);

        if (!turret) {
            return;
        }

        switch (type) {

            case Creepts.GameConstants.TURRET_PROJECTILE:
                turretActor = new ProjectileTurretActor(this.scene, position, turret);
                break;
            case Creepts.GameConstants.TURRET_LASER:
                turretActor = new LaserTurretActor(this.scene, position, turret);
                break;
            case Creepts.GameConstants.TURRET_LAUNCH:
                turretActor = new LaunchTurretActor(this.scene, position, turret);
                break;
            case Creepts.GameConstants.TURRET_GLUE:
                turretActor = new GlueTurretActor(this.scene, position, turret);
                break;
            default:
        }
        
        this.actorsContainer.add(turretActor);
        this.turretActors.push(turretActor);
        
    }

    public removeTurret(id: number): void {

        this.hideTurretMenu();
        this.hideRangeCircles();

        let i: number;
        for (i = 0; i < this.turretActors.length; i ++) {
            if (this.turretActors[i].id === id) {
               break; 
            }
        }

        const turret = this.turretActors[i];

        if (turret) {
            this.turretActors.splice(i, 1);
            turret.destroy();
        }
    }

    public addBullet(bullet: Creepts.Bullet, projectileTurret: Creepts.ProjectileTurret): void {

        const projectileTurretActor = <ProjectileTurretActor> this.getTurretActorByID(projectileTurret.id);
        projectileTurretActor.shootBullet();

        const bulletActor = new BulletActor(this.scene, bullet);
        this.board.add(bulletActor);

        this.bulletActors.push(bulletActor);
    }

    public addGlueBullet(bullet: Creepts.GlueBullet, projectileTurret: Creepts.GlueTurret): void {

        const glueTurretActor = <GlueTurretActor> this.getTurretActorByID(projectileTurret.id);
        glueTurretActor.shootGlue();

        const bulletActor = new GlueBulletActor(this.scene, bullet);
        this.board.add(bulletActor);

        this.glueBulletActors.push(bulletActor);
    }

    public addLaserBeam (laserTurret: Creepts.LaserTurret, enemies: Creepts.Enemy[]): void {

        const laserTurretActor = <LaserTurretActor> this.getTurretActorByID(laserTurret.id);

        let enemyActors = [];

        for (let i = 0; i < enemies.length; i++) {
            enemyActors.push(this.getEnemyActorByID(enemies[i].id));
        }

        laserTurretActor.shootLaser(enemyActors);

        const laserBeam = new LaserBeam(this.scene, laserTurretActor, enemyActors, laserTurret.grade);
        this.actorsContainer.add(laserBeam);
    }

    public addMortar(mortar: Creepts.Mortar, launchTurret: Creepts.LaunchTurret): void {

        const launchTurretActor = <LaunchTurretActor> this.getTurretActorByID(launchTurret.id);
        launchTurretActor.shootMortar();

        const mortarActor = new MortarActor(this.scene, mortar);
        this.actorsContainer.add(mortarActor);

        this.mortarActors.push(mortarActor);
    }

    public addMine(mine: Creepts.Mine, launchTurret: Creepts.LaunchTurret): void {

        const launchTurretActor = <LaunchTurretActor> this.getTurretActorByID(launchTurret.id);
        launchTurretActor.shootMine();

        const mineActor = new MineActor(this.scene, mine, launchTurretActor);
        this.actorsContainer.add(mineActor);
        this.actorsContainer.sendToBack(mineActor);

        this.mineActors.push(mineActor);
    }

    public addGlue(glue: Creepts.Glue, glueTurret: Creepts.GlueTurret): void {

        const glueTurretActor = <GlueTurretActor> this.getTurretActorByID(glueTurret.id);
        glueTurretActor.shootGlue();

        const gluePool = new GluePool(this.scene, glueTurretActor, glue);
        this.board.add(gluePool);
        this.board.sendActorBack(gluePool);
        this.gluePools.push(gluePool);
    }

    public onGlueConsumed(glue: Creepts.Glue): void {

        let gluePool: GluePool = null;

        for (let i = 0; i < this.gluePools.length; i++) {

            if (glue.id === this.gluePools[i].id) {
                gluePool = this.gluePools[i];
                this.gluePools.splice(i, 1);
                gluePool.destroy();
                break;
            }
        }
    }

    public onEnemyHit(enemy: Creepts.Enemy): void {
        
        let enemyActor: EnemyActor = this.getEnemyActorByID(enemy.id);

        if (enemyActor) {
            enemyActor.hit();
        }
    }

    public onEnemyGlueHit(enemy: Creepts.Enemy): void {
        
        let enemyActor: EnemyActor = this.getEnemyActorByID(enemy.id);

        if (enemyActor) {
            enemyActor.glueHit();
        }
    }

    public onEnemyKilled(enemy: Creepts.Enemy): void {

        let enemyActor: EnemyActor = this.getEnemyActorByID(enemy.id);

        if (enemyActor) {
            enemyActor.die();
            this.deadEnemyActors.push(enemyActor);
        }
    }

    public teleportEnemy(enemy: Creepts.Enemy, glueTurret: Creepts.GlueTurret): void {

        let enemyActor: EnemyActor = this.getEnemyActorByID(enemy.id);

        if (enemyActor) {
            enemyActor.teleport(glueTurret);
            AudioManager.playSound("t3_teleport");
        } 
    }

    public removeBullet(bullet: Creepts.Bullet): void {

        let bulletActor: BulletActor = null;

        for (let i = 0; i < this.bulletActors.length; i ++) {

            if (this.bulletActors[i].bullet.id === bullet.id) {
                bulletActor = this.bulletActors[i];
                break;
            }
        }

        if (bulletActor) {
            const i = this.bulletActors.indexOf(bulletActor);
            this.bulletActors.splice(i, 1);
            bulletActor.destroy();
        }
    }

    public removeGlueBullet(bullet: Creepts.GlueBullet): void {

        let bulletActor: GlueBulletActor = null;

        for (let i = 0; i < this.glueBulletActors.length; i ++) {

            if (this.glueBulletActors[i].glueBullet.id === bullet.id) {
                bulletActor = this.glueBulletActors[i];
                break;
            }
        }

        if (bulletActor) {
            const i = this.glueBulletActors.indexOf(bulletActor);
            this.glueBulletActors.splice(i, 1);
            bulletActor.destroy();
        }
    }

    public detonateMortar(mortar: Creepts.Mortar): void {

        let mortarActor: MortarActor = null;

        for (let i = 0; i < this.mortarActors.length; i ++) {

            if (this.mortarActors[i].mortar.id === mortar.id) {
                mortarActor = this.mortarActors[i];
                break;
            }
        }

        if (mortarActor) {
            mortarActor.detonate();
        }
    }

    public detonateMine(mine: Creepts.Mine): void {

        let mineActor: MineActor = null;

        for (let i = 0; i < this.mineActors.length; i ++) {

            if (this.mineActors[i].mine.id === mine.id) {
                mineActor = this.mineActors[i];
                break;
            }
        }

        if (mineActor) {
            mineActor.detonate();
        }
    }

    public removeMortar(mortarActor: MortarActor): void {

        const i = this.mortarActors.indexOf(mortarActor);
        this.mortarActors.splice(i, 1);
        mortarActor.destroy();
    }

    public removeMine(mineActor: MineActor): void {

        const i = this.mineActors.indexOf(mineActor);
        this.mineActors.splice(i, 1);
        mineActor.destroy();
    }
    
    public upgradeTurret(id: number): void {
        
        const turretActor = this.getTurretActorByID(id);
        turretActor.upgrade();
    }

    public improveTurret(id: number): void {
        
        const turretActor = this.getTurretActorByID(id);
        turretActor.improve();
    }
    
    public getTurretActorByID(id: number): TurretActor {

        let turretActor = null;

        for (let i = 0; i < this.turretActors.length; i ++) {
            if (this.turretActors[i].id === id) {
                turretActor = this.turretActors[i];
                break;
            }
        }

        return turretActor;
    }

    public getEnemyActorByID(id: number): EnemyActor {

        let enemy = null;

        for (let i = 0; i < this.enemyActors.length; i ++) {
            if (this.enemyActors[i].id === id) {
                enemy = this.enemyActors[i];
                break;
            }
        }

        return enemy;
    }

    public createRangeCircle(range: number, x: number, y: number, type: string): Phaser.GameObjects.Image {

        let rangeCircle = new Phaser.GameObjects.Image(this.scene, x, y, "texture_atlas_1", "area_" + type);
        rangeCircle.setScale((range * 2) / rangeCircle.width);
        rangeCircle.visible = false;
        this.circlesContainer.add(rangeCircle);

        this.rangeCircles.push(rangeCircle);

        return rangeCircle;
    }

    public hideRangeCircles(): void {

        for (let i = 0; i < this.rangeCircles.length; i ++) {
            this.rangeCircles[i].visible = false;
        }
    }

    public showTurretMenu(turret: Creepts.Turret): void {

        if (!this.turretMenu) {
            this.turretMenu = new TurretMenu(this.scene, turret);
            this.add(this.turretMenu);
        }
    }

    public hideTurretMenu(): void {

        if (this.turretMenu) {
            this.remove(this.turretMenu);
            this.turretMenu = null;
        }
    }

    public showPauseMenu(): void {

        if (!this.pauseMenu) {
            BattleManager.pause();
            this.pauseMenu = new PauseMenu(this.scene);
            this.add(this.pauseMenu);

            this.hideRangeCircles();
            this.hideTurretMenu();
        } else {
            this.hidePauseMenu();
        }
    }

    public hidePauseMenu(): void {

        if (this.pauseMenu) {

            BattleManager.resume();    
            this.remove(this.pauseMenu);
            this.pauseMenu = null;
        }
    }

    public showGameOverLayer(): void {

        this.gameOverLayer = new GameOverLayer(this.scene);
        this.add(this.gameOverLayer);

        this.hideTurretMenu();

        if (this.pauseMenu) {
            this.hidePauseMenu();
        }
    }

    public showRoundCompletedLayer(): void {

        if (GameVars.timeStepFactor === 8 || GameVars.autoSendWave) {
            return;
        } 

        this.roundCompletedLayer = new RoundCompletedLayer(this.scene);
        this.add(this.roundCompletedLayer);
    }

    public hideRoundCompletedLayer(): void {

        this.remove(this.roundCompletedLayer);
        this.roundCompletedLayer = null;
    }

    private drawDebugGeometry(): void {
        
        const path = new Phaser.GameObjects.Graphics(this.scene);

        path.lineStyle(2, 0xFFA500);

        for (let i = 0; i < GameVars.enemiesPathCells.length - 1; i ++) {

            let x = (GameVars.enemiesPathCells[i].c + .5) * GameConstants.CELLS_SIZE;
            let y = (GameVars.enemiesPathCells[i].r + .5) * GameConstants.CELLS_SIZE;
            
            path.moveTo(x, y);

            x = (GameVars.enemiesPathCells[i + 1].c + .5) * GameConstants.CELLS_SIZE;
            y = (GameVars.enemiesPathCells[i + 1].r + .5) * GameConstants.CELLS_SIZE;

            path.lineTo(x, y);

            path.stroke();
        }

        this.board.add(path);
    }

    private onPointerDown(): void {

        if (this.pauseMenu) {
            this.hidePauseMenu();
        } else {
            this.hideRangeCircles();
            this.hideTurretMenu();
        }
        
    }

    private createAnimations(): void {

        this.scene.anims.create({ key: "enemy_soldier_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_soldier_", start: 1, end: 6, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "enemy_runner_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_runner_", start: 1, end: 6, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "enemy_healer_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_healer_", start: 1, end: 6, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "enemy_flier_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_flier_", start: 1, end: 5, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "enemy_blob_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_blob_", start: 1, end: 5, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "enemy_healer_heal", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_healing_", start: 1, end: 6, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        
        this.scene.anims.create({ key: "enemy_soldier_run_frozen", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_soldier_", start: 1, end: 6, zeroPad: 1, suffix: "_frozen"}), frameRate: 8, repeat: -1});
        this.scene.anims.create({ key: "enemy_runner_run_frozen", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_runner_", start: 1, end: 6, zeroPad: 1, suffix: "_frozen"}), frameRate: 8, repeat: -1});
        this.scene.anims.create({ key: "enemy_healer_run_frozen", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_healer_", start: 1, end: 6, zeroPad: 1, suffix: "_frozen"}), frameRate: 8, repeat: -1});
        this.scene.anims.create({ key: "enemy_flier_run_frozen", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_flier_", start: 1, end: 5, zeroPad: 1, suffix: "_frozen"}), frameRate: 8, repeat: -1});
        this.scene.anims.create({ key: "enemy_blob_run_frozen", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_blob_", start: 1, end: 5, zeroPad: 1, suffix: "_frozen"}), frameRate: 8, repeat: -1});
        this.scene.anims.create({ key: "enemy_healer_heal_frozen", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_healing_", start: 1, end: 6, zeroPad: 1, suffix: "_frozen"}), frameRate: 8, repeat: -1});
        
        this.scene.anims.create({ key: "glue_fx", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "fx_snow_shoot_", start: 1, end: 16, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: 0});
        this.scene.anims.create({ key: "explosion", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "tower4_fx_", start: 1, end: 21, zeroPad: 2, suffix: ""}), frameRate: 60, repeat: 0});
        this.scene.anims.create({ key: "mine", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "mina_", start: 1, end: 5, zeroPad: 2, suffix: ""}), frameRate: 30, repeat: 0});
    }
}
