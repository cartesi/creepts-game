import Phaser from "phaser";

export class MenuTitle extends Phaser.GameObjects.Container {

    public static readonly WIDTH = 360;

    public static readonly HEIGHT = 70;

    constructor(scene: Phaser.Scene, label: string) {
        super(scene);
        this.setSize(MenuTitle.WIDTH, MenuTitle.HEIGHT);

        const titleBck = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "title_area");
        this.add(titleBck);

        // text
        const title = new Phaser.GameObjects.Text(this.scene, 0, 0, label, { fontFamily: "Rubik-Regular", fontSize: "35px", color: "#FFFFFF" });
        title.setSize(MenuTitle.WIDTH, MenuTitle.HEIGHT);
        title.setAlign("center");
        title.setOrigin(0.5, 0.5);
        this.add(title);
   }

}
