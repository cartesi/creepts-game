import { EnemyActor } from "./actors/EnemyActor";
import { TurretActor } from "./actors/TurretActor";
import { Board } from "./Board";
import { GameConstants } from "../../GameConstants";
import { BulletActor } from "./actors/BulletActor";
import { GameVars } from "../../GameVars";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static currentInstance: BoardContainer;

    private board: Board;
    private enemies: EnemyActor[];
    private towers: TurretActor[];
    private bullets: BulletActor[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        BoardContainer.currentInstance = this;

        this.x = GameConstants.GAME_WIDTH / 2 - GameConstants.CELLS_SIZE * GameConstants.BOARD_SIZE.c / 2;
        this.y = GameConstants.GAME_HEIGHT / 2 - GameConstants.CELLS_SIZE * GameConstants.BOARD_SIZE.r / 2;

        this.enemies = [];
        this.towers = [];
        this.bullets = [];

        this.board = new Board(this.scene);
        this.add(this.board);

        if (GameConstants.SHOW_DEBUG_GEOMETRY) {
            this.drawDebugGeometry();
        }

        // temporalmente añadimos una torre
        this.addTower("turret_1", {r: 3, c: 2});
        this.addTower("turret_1", {r: 6, c: 2});
        this.addTower("turret_1", {r: 8, c: 6});
        this.addTower("turret_1", {r: 11, c: 2});
    }

    public update(time: number, delta: number): void {

        this.enemies.forEach(function (enemy) {
            enemy.update(time, delta);
        }); 

        this.towers.forEach(function (tower) {
            tower.update(time, delta);
        }); 

        this.bullets.forEach(function (bullet) {
            bullet.update(time, delta);
        }); 
    }

    public addEnemy(anutoEnemy: Anuto.Enemy, position: {r: number, c: number}): void {
        
        const enemy = new EnemyActor(this.scene, anutoEnemy, position);
        this.add(enemy);

        this.enemies.push(enemy);
    }

    public removeEnemy(id: number): void {

        let i: number;
        for (i = 0; i < this.enemies.length; i ++) {
            if (this.enemies[i].id === id) {
               break; 
            }
        }

        const enemy = this.enemies[i];

        if (enemy) {
            this.enemies.splice(i, 1);
            enemy.destroy();
        }
    }

    public addTower(name: string, position: {r: number, c: number}): void {
        
        const tower = new TurretActor(this.scene, name, position);
        this.add(tower);

        this.towers.push(tower);
    }

    public addBullet(anutoBullet: Anuto.Bullet): void {

        const bullet = new BulletActor(this.scene, anutoBullet);
        this.add(bullet);

        this.bullets.push(bullet);
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

            const i = this.enemies.indexOf(enemy);
            this.enemies.splice(i, 1);

            enemy.destroy();
        }
    }

    public removeBullet(anutoBullet: Anuto.Bullet): void {

        let bullet: BulletActor = null;

        for (let i = 0; i < this.bullets.length; i ++) {

            if (this.bullets[i].anutoBullet.id === anutoBullet.id) {
                bullet = this.bullets[i];
                break;
            }
        }

        if (bullet) {
            const i = this.bullets.indexOf(bullet);
            this.bullets.splice(i, 1);
            bullet.destroy();
        }
    }


    public upgradeTower(id: number): void {
        //
    }

    private getEnemyByID(id: number): EnemyActor {

        let enemy = null;

        for (let i = 0; i < this.enemies.length; i ++) {
            if (this.enemies[i].id === id) {
                enemy = this.enemies[i];
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

        this.add(path);
    }
}
