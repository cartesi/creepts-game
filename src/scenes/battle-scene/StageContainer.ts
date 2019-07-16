import { EnemyActor } from "./EnemyActor";
import { TowerActor } from "./TowerActor";

export class StageContainer extends Phaser.GameObjects.Container {

    private enemies: EnemyActor[];
    private towers: TowerActor[];
    
    constructor(scene: Phaser.Scene) {

        super(scene);

        this.enemies = [];
        this.towers = [];
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
