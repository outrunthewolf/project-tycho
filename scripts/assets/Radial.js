
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
    this.app = window.app;

    // Pixi container
    this.radialContainer = new PIXI.Container();
    this.radialContainer.visible = false;
    this.radialContainer.name = "radialContainer";

    //
    let hitOnce = false;
    var that = this;

    // How many items?
    var bgcircle = new PIXI.Graphics();
    bgcircle.beginFill(0x222034);
    bgcircle.alpha = 0.5;
    bgcircle.drawCircle(0, 30, 100); // cx, cy, radius, startAngle, endAngle
    this.radialContainer.addChild(bgcircle);

    var semicircleL = new PIXI.Graphics();
    semicircleL.lineStyle(2, 0xf0f0c9);
    semicircleL.arc(0, 35, 60, 2.8, 6.6); // cx, cy, radius, startAngle, endAngle
    semicircleL.x = (semicircleL.width/2) + 30 - 1;
    this.radialContainer.addChild(semicircleL);

    bgcircle.x = (semicircleL.width/2) + 30 - 5;

    var circle = new PIXI.Graphics();
    circle.lineStyle(5, 0xf0f0c9);
    circle.drawCircle(0, 30, 10); // cx, cy, radius, startAngle, endAngle
    circle.x = (semicircleL.width/2) + 30 - 2.5;
    this.radialContainer.addChild(circle);

    // Load in the radial
    for (var i = 0; i < this.radialItems.length; i++) {
      //let radial = new PIXI.Graphics();
      let radial = new PIXI.Sprite(resources.avatarPaper.texture);
      let radialY = 0;
      if (i == 1) radialY = -60;

      radial.x = (60 * i);
      radial.y = radialY;
      radial.width = 60;
      radial.height = 60;
      radial.interactive = true;
      radial.name = this.radialItems[i].name;
      radial.metaTexture = this.radialItems[i].texture;
      this.radialContainer.addChild(radial);

      radial.on('pointerup', function(e) {
        that.attackRadial = new PIXI.Sprite(resources[e.target.metaTexture].texture);
        that.attackRadial.y = 440;
        that.attackRadial.width = 60;
        that.attackRadial.height = 60;
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
      that.radialContainer.x = event.data.global.x;// - (that.radialContainer.width / 2);
      that.radialContainer.y = event.data.global.y - 30;
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
