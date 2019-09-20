import Phaser from "phaser";

export class MenuButton extends Phaser.GameObjects.Container {

    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, width: number, height: number, label: string, onClick: (button: MenuButton) => void) {
        super(scene);

        // behaviour
        this.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        this.on("pointerover", () => { 
            if (this.alpha === 1) {
                this.setScale(1.025);
            }    
        });
        this.on("pointerout", () => { 
            if (this.alpha === 1) {
                this.setScale(1);
            }    
         });
        this.on("pointerdown", () => { onClick(this); });

        // background
        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFFFF);
        background.fillRect(-width / 2, -height / 2, width, height);
        background.lineStyle(2, 0xFFFFFF);
        background.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
        this.add(background);

        // text
        this.text = new Phaser.GameObjects.Text(this.scene, 0, 0, label, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        this.text.setOrigin(.5);
        this.add(this.text);
   }

   public setLabel(label: string) {
       this.text.setText(label);
   }
}
