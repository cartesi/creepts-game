import Phaser from "phaser";

export class MenuButton extends Phaser.GameObjects.Container {

    public static readonly HEIGHT = 50;
    public static readonly WIDTH = 360;

    private text: Phaser.GameObjects.Text;

    private enabled: boolean;

    constructor(scene: Phaser.Scene, label: string, onClick: (button: MenuButton) => void) {
        super(scene);
        this.enabled = true;
        this.setSize(MenuButton.WIDTH, MenuButton.HEIGHT);

        // behaviour
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, MenuButton.WIDTH, MenuButton.HEIGHT), Phaser.Geom.Rectangle.Contains);
        this.on("pointerover", () => { 
            if (this.enabled && this.alpha === 1) {
                this.setScale(1.025);
            }    
        });
        this.on("pointerout", () => { 
            if (this.enabled && this.alpha === 1) {
                this.setScale(1);
            }    
         });
        this.on("pointerdown", () => {
            if (this.enabled) {
                onClick(this);
            }    
        });

        const margin = 5;
        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFFFF);
        background.fillRect(-MenuButton.WIDTH / 2 + margin, -MenuButton.HEIGHT / 2 + margin, MenuButton.WIDTH - (margin * 2), MenuButton.HEIGHT - (margin * 2));
        background.lineStyle(2, 0xFFFFFF);
        background.strokeRect(-MenuButton.WIDTH / 2, -MenuButton.HEIGHT / 2, MenuButton.WIDTH, MenuButton.HEIGHT);
        this.add(background);

        // text
        this.text = new Phaser.GameObjects.Text(this.scene, 0, 0, label, {fontFamily: "Rubik-Regular", fontSize: "24px", color: "#000000"});
        this.text.setOrigin(.5);
        this.add(this.text);
    }

    public setLabel(label: string) {
        this.text.setText(label);
    }

    public setEnabled(enabled: boolean) {
        this.text.setColor(enabled ? "#000" : "#ccc");
        this.enabled = enabled;
   }
}
