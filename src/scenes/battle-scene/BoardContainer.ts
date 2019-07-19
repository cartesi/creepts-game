import { EnemyActor } from "./EnemyActor";
import { TowerActor } from "./TowerActor";
import { Board } from "./Board";
import { GameConstants } from "../../GameConstants";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static currentInstance: BoardContainer;

    private board: Board;
    private enemies: EnemyActor[];
    private towers: TowerActor[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        BoardContainer.currentInstance = this;

        this.x = GameConstants.GAME_WIDTH / 2 - GameConstants.CELLS_SIZE * GameConstants.BOARD_SIZE.c / 2;
        this.y = GameConstants.GAME_HEIGHT / 2 - GameConstants.CELLS_SIZE * GameConstants.BOARD_SIZE.r / 2;

        this.enemies = [];
        this.towers = [];

        this.board = new Board(this.scene);
        this.add(this.board);

        // temporalmente añadimos una torre
        this.addTower(1, {r: 3, c: 2});
        this.addTower(1, {r: 6, c: 2});
    }

    public update(time: number, delta: number): void {

        this.enemies.forEach(function (enemy) {
            enemy.update(time, delta);
        }); 

        this.towers.forEach(function (tower) {
            tower.update(time, delta);
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

    public addTower(id: number, position: {r: number, c: number}): void {
        
        const tower = new TowerActor(this.scene, id, position);
        this.add(tower);

        this.towers.push(tower);
    }

    public upgradeTower(id: number): void {
        //
    }

    public onEnemyHit(id: number, damage: number): void {
        //
    }
}
