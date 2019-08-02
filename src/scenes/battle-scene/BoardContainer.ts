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
    private enemyActors: EnemyActor[];
    private turretActors: TurretActor[];
    private bulletActors: BulletActor[];
    private mortarActors: MortarActor[];

    private gluePools: GluePool[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        BoardContainer.currentInstance = this;

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = GameConstants.GAME_HEIGHT / 2 + GameConstants.CELLS_SIZE * .75 * GameVars.scaleY;

        this.scaleX = GameVars.scaleCorrectionFactor;
        this.scaleY = GameVars.scaleCorrectionFactor * GameVars.scaleY;

        this.enemyActors = [];
        this.turretActors = [];
        this.bulletActors = [];
        this.mortarActors = [];

        this.gluePools = [];

        this.board = new Board(this.scene);
        this.add(this.board);

        if (GameConstants.SHOW_DEBUG_GEOMETRY) {
            this.drawDebugGeometry();
        }

        // temporalmente añadimos una torre
        this.addTower(Anuto.GameConstants.TURRET_LAUNCH, {r: 3, c: 3});
        this.addTower(Anuto.GameConstants.TURRET_LASER, {r: 6, c: 2});
        this.addTower(Anuto.GameConstants.TURRET_GLUE, {r: 8, c: 5});
        this.addTower(Anuto.GameConstants.TURRET_PROJECTILE, {r: 11, c: 2});
    }

    public update(time: number, delta: number): void {

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
            this.board.add(enemyActor);
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

    public addTower(type: string, position: {r: number, c: number}): void {

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
        
        this.board.add(turret);

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
        this.board.add(laserBeam);
    }

    public addMortar(anutoMortar: Anuto.Mortar, anutoLaunchTurret: Anuto.LaunchTurret): void {

        const launchTurretActor = <LaunchTurretActor> this.getTurretActorByID(anutoLaunchTurret.id);
        launchTurretActor.shootMortar();

        const mortar = new MortarActor(this.scene, anutoMortar, launchTurretActor);
        this.board.add(mortar);

        this.mortarActors.push(mortar);
    }

    public addGlue(anutoGlue: Anuto.Glue, anutoGlueTurret: Anuto.GlueTurret): void {

        const glueTurretActor = <GlueTurretActor> this.getTurretActorByID(anutoGlueTurret.id);
        glueTurretActor.shootGlue();

        const gluePool = new GluePool(this.scene, glueTurretActor, anutoGlue);
        this.board.add(gluePool);
        this.board.sendToBack(gluePool);

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

        let enemy: EnemyActor = this.getEnemyActorByID(anutoEnemy.id);

        if (enemy) {

            const i = this.enemyActors.indexOf(enemy);
            this.enemyActors.splice(i, 1);

            enemy.destroy();
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
}
