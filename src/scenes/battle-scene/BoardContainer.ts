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

export class BoardContainer extends Phaser.GameObjects.Container {

    public static currentInstance: BoardContainer;

    private board: Board;
    private enemyActors: EnemyActor[];
    private turretActors: TurretActor[];
    private bulletActors: BulletActor[];

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

        this.board = new Board(this.scene);
        this.add(this.board);

        if (GameConstants.SHOW_DEBUG_GEOMETRY) {
            this.drawDebugGeometry();
        }

        // temporalmente añadimos una torre
        this.addTower(Anuto.GameConstants.TURRET_LASER, {r: 3, c: 2});
        this.addTower(Anuto.GameConstants.TURRET_PROJECTILE, {r: 6, c: 2});
        this.addTower(Anuto.GameConstants.TURRET_PROJECTILE, {r: 8, c: 6});
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
                break;
            case Anuto.GameConstants.TURRET_LASER:
                break;
            default:
        }
        
        this.board.add(turret);

        this.turretActors.push(turret);
    }

    public addBullet(anutoBullet: Anuto.Bullet): void {

        const bullet = new BulletActor(this.scene, anutoBullet);
        this.board.add(bullet);

        this.bulletActors.push(bullet);
    }

    public onEnemyHit(anutoEnemy: Anuto.Enemy): void {
        
        // encontrar el enemigo en cuestion
        let enemy: EnemyActor = this.getEnemyByID(anutoEnemy.id);

        if (enemy) {
            enemy.hit();
        }
    }

    public onEnemyKilled(anutoEnemy: Anuto.Enemy): void {

        let enemy: EnemyActor = this.getEnemyByID(anutoEnemy.id);

        if (enemy) {

            const i = this.enemyActors.indexOf(enemy);
            this.enemyActors.splice(i, 1);

            enemy.destroy();
        }
    }

    public removeBullet(anutoBullet: Anuto.Bullet): void {

        let bullet: BulletActor = null;

        for (let i = 0; i < this.bulletActors.length; i ++) {

            if (this.bulletActors[i].anutoBullet.id === anutoBullet.id) {
                bullet = this.bulletActors[i];
                break;
            }
        }

        if (bullet) {
            const i = this.bulletActors.indexOf(bullet);
            this.bulletActors.splice(i, 1);
            bullet.destroy();
        }
    }


    public upgradeTower(id: number): void {
        //
    }

    private getEnemyByID(id: number): EnemyActor {

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
