import { TurretMenu } from './TurretMenu';
import { GluePool } from './turret-actors/GluePool';
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

export class BoardContainer extends Phaser.GameObjects.Container {

    public static currentInstance: BoardContainer;

    private board: Board;
    private deadEnemyActors: EnemyActor[];
    private enemyActors: EnemyActor[];
    private turretActors: TurretActor[];
    private bulletActors: BulletActor[];
    private mortarActors: MortarActor[];

    private rangeCircles: Phaser.GameObjects.Graphics[];

    private turretMenu: TurretMenu;

    private pointerContainer: Phaser.GameObjects.Container;
    private circlesContainer: Phaser.GameObjects.Container;
    private actorsContainer: Phaser.GameObjects.Container;

    private gluePools: GluePool[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        BoardContainer.currentInstance = this;

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = GameConstants.GAME_HEIGHT / 2 + GameConstants.CELLS_SIZE * GameVars.scaleY;

        this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleCorrectionFactor * GameVars.scaleY;

        this.deadEnemyActors = [];
        this.enemyActors = [];
        this.turretActors = [];
        this.bulletActors = [];
        this.mortarActors = [];
        this.rangeCircles = [];

        this.gluePools = [];

        this.board = new Board(this.scene);
        this.add(this.board);

        if (GameConstants.SHOW_DEBUG_GEOMETRY) {
            this.drawDebugGeometry();
        }

        this.pointerContainer = new Phaser.GameObjects.Container(this.scene);
        this.board.add(this.pointerContainer);

        this.pointerContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT), Phaser.Geom.Rectangle.Contains);
        this.pointerContainer.on("pointerdown", () => { this.onPointerDown(); });

        this.actorsContainer = new Phaser.GameObjects.Container(this.scene);
        this.board.add(this.actorsContainer);

        this.circlesContainer = new Phaser.GameObjects.Container(this.scene);
        this.board.add(this.circlesContainer);

        this.createAnimations();
    }

    public initialTurrets(): void {

        // temporalmente añadimos una torre
        this.addTurret(Anuto.GameConstants.TURRET_PROJECTILE, {r: 0, c: 2});
        this.addTurret(Anuto.GameConstants.TURRET_PROJECTILE, {r: 1, c: 2});
        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 2, c: 2});
        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 2, c: 3});
        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 2, c: 4});
        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 0, c: 4});
        this.addTurret(Anuto.GameConstants.TURRET_LASER, {r: 0, c: 5});
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

        this.mortarActors.forEach(function (mortar) {
            mortar.update(time, delta);
        }); 
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

        if ( position.r < 0 || position.c < 0 || position.r >= GameConstants.BOARD_SIZE.r || position.c >= GameConstants.BOARD_SIZE.c) {
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
            if (position.c === this.turretActors[i].getInfo().position.c && position.r === this.turretActors[i].getInfo().position.r) {
                return;
            }
        }

        let turret: TurretActor;

        switch (type) {

            case Anuto.GameConstants.TURRET_PROJECTILE:
                turret = new ProjectileTurretActor(this.scene, position);
                break;
            case Anuto.GameConstants.TURRET_LASER:
                turret = new LaserTurretActor(this.scene, position);
                break;
            case Anuto.GameConstants.TURRET_LAUNCH:
                turret = new LaunchTurretActor(this.scene, position);
                break;
            case Anuto.GameConstants.TURRET_GLUE:
                turret = new GlueTurretActor(this.scene, position);
                break;
            default:
        }
        
        this.actorsContainer.add(turret);

        this.turretActors.push(turret);
    }

    public addBullet(anutoBullet: Anuto.Bullet, anutoProjectileTurret: Anuto.ProjectileTurret): void {

        const projectileTurretActor = <ProjectileTurretActor> this.getTurretActorByID(anutoProjectileTurret.id);
        projectileTurretActor.shootBullet();

        const bullet = new BulletActor(this.scene, anutoBullet);
        this.board.add(bullet);

        this.bulletActors.push(bullet);
    }

    public addLaserBeam (anutoLaserTurret: Anuto.LaserTurret, anutoEnemy: Anuto.Enemy): void {

        const laserTurretActor = <LaserTurretActor> this.getTurretActorByID(anutoLaserTurret.id);
        laserTurretActor.shootLaser();

        const enemyActor = this.getEnemyActorByID(anutoEnemy.id);

        const laserBeam = new LaserBeam(this.scene, laserTurretActor, enemyActor);
        this.actorsContainer.add(laserBeam);
    }

    public addMortar(anutoMortar: Anuto.Mortar, anutoLaunchTurret: Anuto.LaunchTurret): void {

        const launchTurretActor = <LaunchTurretActor> this.getTurretActorByID(anutoLaunchTurret.id);
        launchTurretActor.shootMortar();

        const mortar = new MortarActor(this.scene, anutoMortar, launchTurretActor);
        this.actorsContainer.add(mortar);

        this.mortarActors.push(mortar);
    }

    public addGlue(anutoGlue: Anuto.Glue, anutoGlueTurret: Anuto.GlueTurret): void {

        const glueTurretActor = <GlueTurretActor> this.getTurretActorByID(anutoGlueTurret.id);
        glueTurretActor.shootGlue();

        const gluePool = new GluePool(this.scene, glueTurretActor, anutoGlue);
        this.board.add(gluePool);
        this.board.sendActorBack(gluePool);

        this.gluePools.push(gluePool);
    }

    public onGlueConsumed(anutoGlue: Anuto.Glue): void {

        let glue: GluePool = null;

        for (let i = 0; i < this.gluePools.length; i++) {

            if (anutoGlue.id === this.gluePools[i].id) {
                glue = this.gluePools[i];
                this.gluePools.splice(i, 1);
                glue.destroy();
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

    public onEnemyKilled(anutoEnemy: Anuto.Enemy): void {

        let enemyActor: EnemyActor = this.getEnemyActorByID(anutoEnemy.id);

        if (enemyActor) {
            enemyActor.die();
            this.deadEnemyActors.push(enemyActor);
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

    public removeMortar(mortarActor: MortarActor): void {

        const i = this.mortarActors.indexOf(mortarActor);
        this.mortarActors.splice(i, 1);
        mortarActor.destroy();
    }
    
    public upgradeTower(id: number): void {
        //
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

        this.hideRangeCircles();
        this.hideTurretMenu();
    }

    private createAnimations(): void {

        this.scene.anims.create({ key: "enemy_soldier_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_soldier_", start: 1, end: 6, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "enemy_runner_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_runner_", start: 1, end: 6, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "enemy_healer_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_healer_", start: 1, end: 6, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "enemy_flier_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_flier_", start: 1, end: 5, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
        this.scene.anims.create({ key: "enemy_blob_run", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_blob_", start: 1, end: 5, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});

        this.scene.anims.create({ key: "enemy_healer_heal", frames: this.scene.anims.generateFrameNames( "texture_atlas_1", { prefix: "enemy_healing_", start: 1, end: 6, zeroPad: 1, suffix: ""}), frameRate: 12, repeat: -1});
    }
}
