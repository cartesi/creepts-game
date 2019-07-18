import { EnemyActor } from "./EnemyActor";
import { TowerActor } from "./TowerActor";
import { Board } from "./Board";
import { GameConstants } from "../../GameConstants";

export class BoardContainer extends Phaser.GameObjects.Container {

    private board: Board;
    private enemies: EnemyActor[];
    private towers: TowerActor[];
    
    constructor(scene: Phaser.Scene) {

        super(scene);

        this.x = GameConstants.GAME_WIDTH / 2 - GameConstants.CELLS_SIZE * GameConstants.BOARD_SIZE.c / 2;
        this.y = GameConstants.GAME_HEIGHT / 2 - GameConstants.CELLS_SIZE * GameConstants.BOARD_SIZE.r / 2;

        this.enemies = [];
        this.towers = [];

        this.board = new Board(this.scene);
        this.add(this.board);


        // temporalmente añadimos una torre
        let tower = new TowerActor(this.scene, {r: 3, c: 2});
        this.add(tower);

        tower = new TowerActor(this.scene, {r: 6, c: 2});
        this.add(tower);
    }

    public update(time: number, delta: number): void {
        
        this.enemies.forEach(function (enemy) {
            enemy.update(time, delta);
        }); 

        this.towers.forEach(function (tower) {
            tower.update(time, delta);
        }); 
    }

    public addEnemy(id: number, position: {r: number, c: number}): void {
        //
    }

    public addTower(id: number, position: {r: number, c: number}): void {
        //
    }

    public upgradeTower(id: number): void {
        //
    }

    public onEnemyHit(id: number, damage: number): void {
        //
    }
}
