import { GameOverLayer } from "./GameOverLayer";
import { MineActor } from "./turret-actors/MineActor";
import { BattleScene } from "./BattleScene";
import { TurretMenu } from "./TurretMenu";
import { GluePool } from "./turret-actors/GluePool";
import { EnemyActor } from "./enemy-actors/EnemyActor";
import { TurretActor } from "./turret-actors/TurretActor";
import { Board } from "./Board";
import { GameConstants } from "../../GameConstants";
import { BulletActor } from "./turret-actors/BulletActor";
import { GameVars } from "../../GameVars";
import { SoldierEnemyActor } from "./enemy-actors/SoldierEnemyActor";
import { RunnerEnemyActor } from "./enemy-actors/RunnerEnemyActor";
import { HealerEnemyActor } from "./enemy-actors/HealerEnemyActor";
import { BlobEnemyActor } from "./enemy-actors/BlobEnemyActor";
import { FlierEnemyActor } from "./enemy-actors/FlierEnemyActor";
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

    private rangeCircles: Phaser.GameObjects.Graphics[];
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

        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 0, c: 5});
        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 1, c: 7});
        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 2, c: 4});
        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 3, c: 7});
        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 4, c: 6});

        this.addTurret(Anuto.GameConstants.TURRET_GLUE, {r: 0, c: 4});
        this.addTurret(Anuto.GameConstants.TURRET_GLUE, {r: 0, c: 6});
        this.addTurret(Anuto.GameConstants.TURRET_GLUE, {r: 2, c: 3});
        this.addTurret(Anuto.GameConstants.TURRET_GLUE, {r: 2, c: 5});
        this.addTurret(Anuto.GameConstants.TURRET_GLUE, {r: 2, c: 7});
        this.addTurret(Anuto.GameConstants.TURRET_GLUE, {r: 4, c: 3});
        this.addTurret(Anuto.GameConstants.TURRET_GLUE, {r: 4, c: 5});
    }

    public update(time: number, delta: number): void {

        // eliminar a los enemigos que ya han muerto
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

    public addEnemy(anutoEnemy: Anuto.Enemy, position: {r: number, c: number}): void {

        let enemyActor: EnemyActor = null;

        switch (anutoEnemy.type) {

            case Anuto.GameConstants.ENEMY_SOLDIER:
                enemyActor = new SoldierEnemyActor(this.scene, anutoEnemy, position);
                break;
            case Anuto.GameConstants.ENEMY_RUNNER:
                enemyActor = new RunnerEnemyActor(this.scene, anutoEnemy, position);
                break;
            case Anuto.GameConstants.ENEMY_HEALER:
                enemyActor = new HealerEnemyActor(this.scene, anutoEnemy, position);
                break;
            case Anuto.GameConstants.ENEMY_BLOB:
                enemyActor = new BlobEnemyActor(this.scene, anutoEnemy, position);
                break;
            case Anuto.GameConstants.ENEMY_FLIER:
                enemyActor = new FlierEnemyActor(this.scene, anutoEnemy, position);
                break;
            default:
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

        // mirar si estamos poniendo la torreta encima del camino
        for (let i = 0; i < GameVars.enemiesPathCells.length; i++) {
            if (position.c === GameVars.enemiesPathCells[i].c && position.r === GameVars.enemiesPathCells[i].r) {
                return;
            }
        }

        // mirar si ya hay una torreta
        for (let i = 0; i < this.turretActors.length; i++) {
            if (position.c === this.turretActors[i].anutoTurret.position.c && position.r === this.turretActors[i].anutoTurret.position.r) {
                return;
            }
        }

        let isOnPlateau = false;

        // miramos si esta en una celda en la que se puede posicionar
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

        let turret: TurretActor;
        let anutoTurret = BattleManager.addTurret(type, position);

        if (!anutoTurret) {
            return;
        }

        switch (type) {

            case Anuto.GameConstants.TURRET_PROJECTILE:
                turret = new ProjectileTurretActor(this.scene, position, anutoTurret);
                break;
            case Anuto.GameConstants.TURRET_LASER:
                turret = new LaserTurretActor(this.scene, position, anutoTurret);
                break;
            case Anuto.GameConstants.TURRET_LAUNCH:
                turret = new LaunchTurretActor(this.scene, position, anutoTurret);
                break;
            case Anuto.GameConstants.TURRET_GLUE:
                turret = new GlueTurretActor(this.scene, position, anutoTurret);
                break;
            default:
        }
        
        this.actorsContainer.add(turret);
        this.turretActors.push(turret);
        
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

    public addBullet(anutoBullet: Anuto.Bullet, anutoProjectileTurret: Anuto.ProjectileTurret): void {

        const projectileTurretActor = <ProjectileTurretActor> this.getTurretActorByID(anutoProjectileTurret.id);
        projectileTurretActor.shootBullet();

        const bullet = new BulletActor(this.scene, anutoBullet);
        this.board.add(bullet);

        this.bulletActors.push(bullet);
    }

    public addGlueBullet(anutoBullet: Anuto.GlueBullet, anutoProjectileTurret: Anuto.GlueTurret): void {

        const glueTurretActor = <GlueTurretActor> this.getTurretActorByID(anutoProjectileTurret.id);
        glueTurretActor.shootGlue();

        const bullet = new GlueBulletActor(this.scene, anutoBullet);
        this.board.add(bullet);

        this.glueBulletActors.push(bullet);
    }

    public addLaserBeam (anutoLaserTurret: Anuto.LaserTurret, anutoEnemies: Anuto.Enemy[]): void {

        const laserTurretActor = <LaserTurretActor> this.getTurretActorByID(anutoLaserTurret.id);

        let enemyActors = [];

        for (let i = 0; i < anutoEnemies.length; i++) {
            enemyActors.push(this.getEnemyActorByID(anutoEnemies[i].id));
        }

        laserTurretActor.shootLaser(enemyActors);

        const laserBeam = new LaserBeam(this.scene, laserTurretActor, enemyActors, anutoLaserTurret.grade);
        this.actorsContainer.add(laserBeam);
    }

    public addMortar(anutoMortar: Anuto.Mortar, anutoLaunchTurret: Anuto.LaunchTurret): void {

        const launchTurretActor = <LaunchTurretActor> this.getTurretActorByID(anutoLaunchTurret.id);
        launchTurretActor.shootMortar();

        const mortar = new MortarActor(this.scene, anutoMortar);
        this.actorsContainer.add(mortar);

        this.mortarActors.push(mortar);
    }

    public addMine(anutoMine: Anuto.Mine, anutoLaunchTurret: Anuto.LaunchTurret): void {

        const launchTurretActor = <LaunchTurretActor> this.getTurretActorByID(anutoLaunchTurret.id);
        launchTurretActor.shootMine();

        const mine = new MineActor(this.scene, anutoMine, launchTurretActor);
        this.actorsContainer.add(mine);
        this.actorsContainer.sendToBack(mine);

        this.mineActors.push(mine);
    }

    public addGlue(anutoGlue: Anuto.Glue, anutoGlueTurret: Anuto.GlueTurret): void {

        const glueTurretActor = <GlueTurretActor> this.getTurretActorByID(anutoGlueTurret.id);
        glueTurretActor.shootGlue();

        const gluePool = new GluePool(this.scene, glueTurretActor, anutoGlue);
        this.board.add(gluePool);
        this.board.sendActorBack(gluePool);
        this.gluePools.push(gluePool);

        const glueCircle = new Phaser.GameObjects.Graphics(this.scene);
        glueCircle.setPosition(glueTurretActor.x, glueTurretActor.y);
        glueCircle.lineStyle(2, 0x66CCFF, 1);
        glueCircle.strokeCircle(0, 0, anutoGlue.range * GameConstants.CELLS_SIZE);
        glueCircle.setScale(0);
        glueCircle.alpha = 0;
        glueCircle.name = anutoGlue.id.toString();
        this.glueCirclesContainer.add(glueCircle);
        this.glueCircles.push(glueCircle);

        this.scene.tweens.add({
            targets: glueCircle,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: GameVars.timeStepFactor === 1 ? 600 : 200,
        });
    }

    public onGlueConsumed(anutoGlue: Anuto.Glue): void {

        let glue: GluePool = null;

        for (let i = 0; i < this.gluePools.length; i++) {

            if (anutoGlue.id === this.gluePools[i].id) {
                glue = this.gluePools[i];
                this.gluePools.splice(i, 1);
                glue.destroy();

                let glueCircle = this.glueCircles[i];
                this.glueCircles.splice(i, 1);
                this.scene.tweens.add({
                    targets: glueCircle,
                    alpha: 0,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    duration: GameVars.timeStepFactor === 1 ? 600 : 200,
                    onComplete: () => {
                        glueCircle.destroy();
                    },
                    onCompleteScope: this
                });
                break;
            }
        }
    }

    public onEnemyHit(anutoEnemy: Anuto.Enemy): void {
        
        // encontrar el enemigo en cuestion
        let enemy: EnemyActor = this.getEnemyActorByID(anutoEnemy.id);

        if (enemy) {
            enemy.hit();
        }
    }

    public onEnemyGlueHit(anutoEnemy: Anuto.Enemy): void {
        
        // encontrar el enemigo en cuestion
        let enemy: EnemyActor = this.getEnemyActorByID(anutoEnemy.id);

        if (enemy) {
            enemy.glueHit();
        }
    }

    public onEnemyKilled(anutoEnemy: Anuto.Enemy): void {

        let enemyActor: EnemyActor = this.getEnemyActorByID(anutoEnemy.id);

        if (enemyActor) {
            enemyActor.die();
            this.deadEnemyActors.push(enemyActor);
        }
    }

    public teleportEnemy(anutoEnemy: Anuto.Enemy, anutoGlueTurret: Anuto.GlueTurret): void {

        let enemyActor: EnemyActor = this.getEnemyActorByID(anutoEnemy.id);

        if (enemyActor) {
            enemyActor.teleport(anutoGlueTurret);
            AudioManager.playSound("t3_teleport");
        } 
    }

    public removeBullet(anutoBullet: Anuto.Bullet): void {

        let bulletActor: BulletActor = null;

        for (let i = 0; i < this.bulletActors.length; i ++) {

            if (this.bulletActors[i].anutoBullet.id === anutoBullet.id) {
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

    public removeGlueBullet(anutoBullet: Anuto.GlueBullet): void {

        let bulletActor: GlueBulletActor = null;

        for (let i = 0; i < this.glueBulletActors.length; i ++) {

            if (this.glueBulletActors[i].anutoGlueBullet.id === anutoBullet.id) {
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

    public detonateMortar(anutoMortar: Anuto.Mortar): void {

        let mortarActor: MortarActor = null;

        for (let i = 0; i < this.mortarActors.length; i ++) {

            if (this.mortarActors[i].anutoMortar.id === anutoMortar.id) {
                mortarActor = this.mortarActors[i];
                break;
            }
        }

        if (mortarActor) {
            mortarActor.detonate();
        }
    }

    public detonateMine(anutoMine: Anuto.Mine): void {

        let mineActor: MineActor = null;

        for (let i = 0; i < this.mineActors.length; i ++) {

            if (this.mineActors[i].anutoMine.id === anutoMine.id) {
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

    public createRangeCircle(range: number, x: number, y: number): Phaser.GameObjects.Graphics {

        let rangeCircle = new Phaser.GameObjects.Graphics(this.scene);
        rangeCircle.setPosition(x, y);
        rangeCircle.lineStyle(2, 0x00FF00);
        rangeCircle.strokeCircle(0, 0, range);
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

    public showTurretMenu(anutoTurret: Anuto.Turret): void {

        if (!this.turretMenu) {
            this.turretMenu = new TurretMenu(this.scene, anutoTurret);
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
        this.scene.anims.create({ key: "glue_bullet", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "bullet_3_1_", start: 1, end: 8, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "explosion", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "tower4_fx_", start: 1, end: 21, zeroPad: 2, suffix: ""}), frameRate: 60, repeat: 0});
    }
}
