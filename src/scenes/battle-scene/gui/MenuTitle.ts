import Phaser from "phaser";

export class MenuTitle extends Phaser.GameObjects.Container {

    public static readonly WIDTH = 360;

    public static readonly HEIGHT = 70;

    constructor(scene: Phaser.Scene, label: string) {
        super(scene);
        this.setSize(MenuTitle.WIDTH, MenuTitle.HEIGHT);

        const padding = 10;
        // lines
        const lines = new Phaser.GameObjects.Graphics(this.scene);
        lines.lineStyle(4, 0xffffff);
        lines.strokeRect(-MenuTitle.WIDTH / 2, -MenuTitle.HEIGHT / 2, MenuTitle.WIDTH, MenuTitle.HEIGHT);
        lines.lineStyle(2, 0xffffff);
        lines.strokeRect((-MenuTitle.WIDTH / 2) + padding, (-MenuTitle.HEIGHT / 2) + padding, MenuTitle.WIDTH - (2 * padding), MenuTitle.HEIGHT - (2 * padding));
        this.add(lines);

        // text
        const title = new Phaser.GameObjects.Text(this.scene, 0, 0, label, { fontFamily: "Rubik-Regular", fontSize: "35px", color: "#FFFFFF" });
        title.setSize(MenuTitle.WIDTH, MenuTitle.HEIGHT);
        title.setAlign("center");
        title.setOrigin(0.5, 0.5);
        this.add(title);
   }

}
