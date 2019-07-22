import { EnemyActor } from "./actors/EnemyActor";
import { TowerActor } from "./actors/TowerActor";
import { Board } from "./Board";
import { GameConstants } from "../../GameConstants";
import { BulletActor } from "./actors/BulletActor";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static currentInstance: BoardContainer;

    private board: Board;
    private enemies: EnemyActor[];
    private towers: TowerActor[];
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

        // temporalmente añadimos una torre
        this.addTower("tower_1", {r: 3, c: 2});
        this.addTower("tower_1", {r: 6, c: 2});
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
        
        const tower = new TowerActor(this.scene, name, position);
        this.add(tower);

        this.towers.push(tower);
    }

    public addBullet(anutoBullet: Anuto.Bullet): void {

        const bullet = new BulletActor(this.scene, anutoBullet);
        this.add(bullet);

        this.bullets.push(bullet);
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

    public onEnemyHit(id: number, damage: number): void {
        //
    }
}
