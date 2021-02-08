
// ES6 Class adding a method to the Person prototype
class Radial {
  constructor(app, loader, resources) {

    this.app = app;
    this.resources = resources;
    this.currentPlayerAttack = "";
    this.currentPlayerAttackObject = { };
    this.radialDefenseY = 440;
    this.ready = false;
    this.enableKeyboard = true;
    this.radialArc = 87;
    this.animating = false;

    //
    this.radialItems = [
      {
        name: "rock",
        button: "Q",
        keyColour: "#a0dbe4",
        rotation: 1,
        radialTexture: "radialIconRock",
        attackTexture: "defenseIconRock"
      },{
        name: "scissors",
        button: "W",
        keyColour: "#b2f8a2",
        rotation: 0,
        radialTexture: "radialIconScissors",
        attackTexture: "defenseIconScissors"
      },{
        name: "paper",
        button: "E",
        keyColour: "#e399de",
        rotation: -1,
        radialTexture: "radialIconPaper",
        attackTexture: "defenseIconPaper"
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

    var semicircleL = new PIXI.Graphics();
    semicircleL.lineStyle(2, 0xf0f0c9);
    semicircleL.arc(0, 0, this.radialArc, 2.8, 6.6); // cx, cy, radius, startAngle, endAngle
    semicircleL.x = this.radialArc + 30 - 1;//(this.radialArc / 2) - 2.5;
    this.radialContainer.addChild(semicircleL);

    // Load in the radial
    for (var i = 0; i < this.radialItems.length; i++) {
      //let radial = new PIXI.Graphics();
      var radialIconTexture = this.radialItems[i].radialTexture;
      let radial = new PIXI.Sprite(resources[radialIconTexture].texture);
      let radialY = 0;
      if (i == 1) radialY = -this.radialArc;
      if (i !== 1) radialY = radialY - 10;

      radial.width = 60;
      radial.height = 60;
      radial.interactive = true;
      radial.name = this.radialItems[i].name;
      radial.metaTexture = this.radialItems[i].attackTexture;
      radial.metaRotation = this.radialItems[i].rotation;
      radial.x = (this.radialArc * i);
      radial.y = radialY - (radial.height / 2);

      this.radialContainer.addChild(radial);

      // Add text
      if (this.enableKeyboard == true) {
        var text = new PIXI.Text(this.radialItems[i].button, new PIXI.TextStyle({
          fontFamily: "emery",
          fontSize: 35,
          stroke: '#222034',
          strokeThickness: 5,
          fill: '#FFFFFF'//this.radialItems[i].keyColour
        }));
        text.x = (radial.width / 2) + (text.width / 2);
        text.y = radial.height - 10;
        radial.addChild(text);
      }

      // On click on a
      radial.on('pointerup', function(event) {
        that.hitDefense(event, app);
      });

      // Clear defense on clicking on nothing
      app.renderer.plugins.interaction.on('pointerdown', function(event) {

        if(that.attackRadial) {
          that.attackRadial.destroy();
          that.attackRadial = false;
        }

        that.currentPlayerAttack = "";
      });
    }

    // Keyboard events
    if(this.enableKeyboard == true) {
      document.addEventListener('keydown', function(event) {
        if (event.code == "KeyQ") {
          event.target.metaTexture = "defenseIconRock";
          event.target.metaRotation = 2;
          event.target.name = "rock";
          that.hitDefense(event, app);
        }

        if (event.code == "KeyW") {
          event.target.metaTexture = "defenseIconScissors";
          event.target.metaRotation = 0;
          event.target.name = "scissors";
          that.hitDefense(event, app);
        }

        if (event.code == "KeyE") {
          event.target.metaTexture = "defenseIconPaper";
          event.target.metaRotation = -2;
          event.target.name = "paper";
          that.hitDefense(event, app);
        }
      });
    }

    this.radialContainer.x = (app.view.width / 2 );
    this.radialContainer.y = app.view.height - 30;
    this.radialContainer.pivot.x = semicircleL.x;
    this.radialContainer.pivot.y = 0;


    return this;
  }

  /**
   *
   */
  hitDefense(e, app) {

    var target = this.radialContainer.getChildByName(e.target.name);

    // All this shit is here to stop animations playing before they're finished.
    var that = this;
    var shakeAnimation = this.shakeUpDownAnimation(target.y);
    shakeAnimation.onStart = function() {
      console.log("starting");
      that.animating = true;
    };
    shakeAnimation.onComplete = function() {
      that.animating = false;
    };
    if(this.animating == false) gsap.to(target, shakeAnimation);
    //

    if(this.attackRadial) {
      this.attackRadial.destroy();
      this.attackRadial = false;
    }

    this.attackRadial = new PIXI.Sprite(this.resources[e.target.metaTexture].texture);
    this.attackRadial.y = this.radialDefenseY;
    this.attackRadial.width = 40;
    this.attackRadial.height = 40;
    this.attackRadial.x = (app.view.width / 2) - (this.attackRadial.width / 2);
    this.attackRadial.name = e.target.name;

    app.stage.addChild(this.attackRadial);
    this.currentPlayerAttackObject = this.attackRadial;
    this.currentPlayerAttack = e.target.name;

    document.body.dispatchEvent(new CustomEvent("playerAttackDropped", {
      bubbles: true
    }));
  }

  /**
   *
   */
  shakeUpDownAnimation(y) {
    return { keyframes: [{
          y: y + 15,
          duration: 0.1
        },
        {
            y: y + 5,
            duration: 0.1
          },
        {
          y: y,
          duration: 0.1
        }
      ],
      ease: "elastic"
    };
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
  setRadialDefenseY(y) {
    this.radialDefenseY = y;
  }

  /**
  *
  */
  getCurrentPlayerAttack() {
    return this.currentPlayerAttack;
  }

  /**
  *
  */
  getCurrentPlayerAttackObject() {
    return this.currentPlayerAttackObject;
  }

  /**
   *
   */
  destroy() {
    // Remove elements
    if (this.attackRadial) this.attackRadial.destroy();
    if (this.radialContainer) this.radialContainer.destroy();

    // Remove some mouse events
    app.renderer.plugins.interaction.off('pointerdown');
    app.renderer.plugins.interaction.off('pointerup');
  }
}
