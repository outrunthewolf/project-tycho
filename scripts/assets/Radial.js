
// ES6 Class adding a method to the Person prototype
class Radial {
  constructor(resources) {

    this.currentPlayerAttack = "";

    //
    this.radialItems = [
      {
        name: "rock",
        texture: "avatarRock"
      },{
        name: "scissors",
        texture: "avatarScissors"
      },{
        name: "paper",
        texture: "avatarPaper"
      }
    ];

    this.attackRadial = false;
    window.app = app;

    // Pixi container
    this.radialContainer = new PIXI.Container();
    this.radialContainer.visible = false;
    this.radialContainer.name = "radialContainer";

    //
    let hitOnce = false;
    var that = this;

    // How many items?

    // Load in the radial
    for (var i = 0; i < this.radialItems.length; i++) {
      //let radial = new PIXI.Graphics();
      let radial = new PIXI.Sprite(resources[this.radialItems[i].texture].texture);
      let radialY = 0;
      if (i == 1) radialY = -80;

      radial.x = (80 * i);
      radial.y = radialY;
      radial.width = 40;
      radial.height = 40;
      radial.interactive = true;
      radial.name = this.radialItems[i].name;
      radial.metaTexture = this.radialItems[i].texture;
      this.radialContainer.addChild(radial);

      radial.on('pointerup', function(e) {
        that.attackRadial = new PIXI.Sprite(resources[e.target.metaTexture].texture);
        that.attackRadial.y = 440;
        that.attackRadial.width = 40;
        that.attackRadial.height = 40;
        that.attackRadial.x = (app.view.width / 2) - (that.attackRadial.width / 2);
        that.attackRadial.name = e.target.name;

        app.stage.addChild(that.attackRadial);
        that.currentPlayerAttack = e.target.name;

        document.body.dispatchEvent(new CustomEvent("playerAttackDropped", {
          bubbles: true
        }));
      });
    }

    app.renderer.plugins.interaction.on('pointerdown', function(event) {
      that.radialContainer.x = event.data.global.x - (that.radialContainer.width / 2) + 20;
      that.radialContainer.y = event.data.global.y;
      that.radialContainer.visible = true;

      if(that.attackRadial) {
        that.attackRadial.destroy();
        that.attackRadial = false;
      }

      that.currentPlayerAttack = "";
    });

    app.renderer.plugins.interaction.on('pointerup', function() {
      that.radialContainer.visible = false;
    });

    return this;
  }

  /**
   *
   */
   getRenderable() {
     return this.radialContainer;
   }

  /**
   *
   */
   getCurrentPlayerAttack() {
     return this.currentPlayerAttack;
   }
}
