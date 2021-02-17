
// ES6 Class adding a method to the Person prototype
class PowerUps {
  constructor(app, loader, resources, gameScene) {
    const that = this;
    this.stage = app.stage;
    this.app = app;
    this.loader = loader;
    this.resources = resources;
    this.gameScene = gameScene;

    this.successCount = 0;
    this.trackedSuccess = 1;
    this.attacksCount = 0; // Amount of attacks we've recieved

    // The list of powerups
    this.powerUps = [{
      name: "powerShield",
      count: 0,
      active: false,
      action: that.powerShield,
      context: that,
      assets: { }
    },{
      name: "timeDilation",
      count: 0,
      active: false,
      action: that.timeDilation,
      context: that
    }];
    this.rerender = false;
    this.powerUpContainer = { };

    document.body.addEventListener("readyToPlay", function (e) {
      that.boot();
    });
  }

  //
  boot() {
    var that = this;

    this.powerUpContainer = new PIXI.Container();
    this.powerUpContainer.name = "power-up-container";
    this.stage.addChild(this.powerUpContainer);
    this.powerUpContainer.x = 50;
    this.powerUpContainer.y = (this.app.view.height / 2);
    this.powerUpContainer.zIndex = 99999;

    for (i = 0; i < this.powerUps.length; ++i) {
      var powerUpBox = new PIXI.Graphics();
      powerUpBox.lineStyle(4, 0xFF9600, 1);
      powerUpBox.beginFill(0xFF9600);
      powerUpBox.drawRect(0, 0, 25, 25);
      powerUpBox.endFill();
      powerUpBox.x = 10 + (50 * i);
      powerUpBox.y = 0;
      powerUpBox.zIndex = 99999;
      powerUpBox.interactive = true;
      powerUpBox.buttonMode = true;
      powerUpBox.alpha = 0.8;
      powerUpBox.name = this.powerUps[i].name;
      powerUpBox.meta = this.powerUps[i];

      powerUpBox.on('pointerdown', function (e) {
        that.activatePowerUp(e.target.meta);
      });

      var text = new PIXI.Text(this.powerUps[i].count, new PIXI.TextStyle({
        fontFamily: "emery",
        fontSize: 35,
        stroke: '#222034',
        strokeThickness: 5,
        fill: '#FFFFFF'
      }));
      text.x = 0;
      text.y = 0;
      text.name = "powerUpTextBox";
      powerUpBox.addChild(text);

      this.powerUpContainer.addChild(powerUpBox);
    }

    this.loadEventListeners();
  }

  // Load Event Listeners
  loadEventListeners() {
    var that = this;
    document.body.addEventListener("event:successfulDefense", function(e) {
      that.onSuccessfulDefense(e);
    });
    document.body.addEventListener("event:failedDefense", function(e) {
      that.onFailedDefense(e);
    });
    document.body.addEventListener("event:drawDefense", function(e) {
      that.onDrawDefense(e);
    });
    document.body.addEventListener("alienAttackDropped", function (e) {
      that.onAlienAttackDropped(e);
    });
  }

  // Watch for events
  play() {

    // Evaluate the success count
    if (this.successCount !== 0 ) {
      if (this.trackedSuccess != this.successCount) {

        // Track powerups for PowerShield But not when shield is active
        if ((this.successCount % 3 == 0) && (this.powerUps[0].active == false)) {
          ++this.powerUps[0].count;
        }

        // Track powerups for TimeDilation
        if (this.successCount % 3 == 0) {
          ++this.powerUps[1].count;
        }

        this.trackedSuccess = this.successCount;
        this.rerender = true;
      }
    }

    if(this.rerender === true) {
      this.render();
      this.rerender = false;
    }
  }

  // Push a powerup buton
  activatePowerUp(powerUp) {

    if(powerUp.count >= 1) {
      --powerUp.count;

      this.attacksCount = 0;
      powerUp.active = true;
      this.rerender = true;

      powerUp.action();
    }
  }

  // Render powerUps
  render() {
    for (i = 0; i < this.powerUps.length; ++i) {
      var powerUpBox = this.powerUpContainer.getChildByName(this.powerUps[i].name);
      var powerUpBoxText = powerUpBox.getChildByName("powerUpTextBox");
      powerUpBoxText.text = this.powerUps[i].count;
    }
  }

  // Success
  onSuccessfulDefense(e) {
    ++this.successCount;
  }

  // Failure
  onFailedDefense(e) {
    this.successCount = 0;
  }

  // Draw
  onDrawDefense(e) {

  }

  onAlienAttackDropped(e) {
    ++this.attacksCount;

    // If shield is active
    if (this.powerUps[0].active == true) {
      this.powerUps[0].action();
    }
  }

  // Spefici opowerup functons
  timeDilation() {
    console.log("Time Dilation Active");
  }

  powerShield() {

    // 3 attacks defended against
    if (this.context.attacksCount <= 2 ) {

      this.active = true;

      // Create the long line
      if (!this.assets.shield) {
        this.assets.shield = new PIXI.Graphics();
        this.assets.shield.lineStyle(4, 0xFFFFFF, 1);
        this.assets.shield.beginFill(0xFFFFFF);
        this.assets.shield.drawRect(0, 0, this.context.app.view.width, 2);
        this.assets.shield.endFill();
        this.assets.shield.x = 0;
        this.assets.shield.y = this.context.gameScene.radialContainer.radialDefenseY + 40;
        this.assets.shield.name = "shield";
        this.context.app.stage.addChild(this.assets.shield);
      }

      // Put words on screen
      if (!this.assets.text) {
        this.assets.text = new PIXI.Text("Power Shield!", new PIXI.TextStyle({
          fontFamily: "emery",
          fontSize: 35,
          stroke: '#f98a8a',
          strokeThickness: 9,
          fill: '#FF0000'
        }));
        this.assets.text.name = "shieldText";
        this.assets.text.x = (this.context.app.view.width / 2) - (this.assets.text.width / 2);
        this.assets.text.y = this.context.app.view.height / 2 + 50;
        this.context.app.stage.addChild(this.assets.text);

        var tl = gsap.timeline();
        tl.to(this.assets.text, {alpha: 0, duration: 3});
      }

      // Set the same defense as attack
      var e = {};
      if (this.context.gameScene.alien.attack.name == 'rock') {
        e.target = this.context.gameScene.radialContainer.radialContainer.getChildByName('paper');
      }
      if (this.context.gameScene.alien.attack.name == 'paper')  {
        e.target = this.context.gameScene.radialContainer.radialContainer.getChildByName('scissors');
      }
      if (this.context.gameScene.alien.attack.name == 'scissors')  {
        e.target = this.context.gameScene.radialContainer.radialContainer.getChildByName('rock');
      }

      // Create and object
      this.context.gameScene.radialContainer.hitDefense(e, this.context.app);
      this.context.gameScene.radialContainer.disable();

    }else{
      if (this.assets) {
        this.assets.shield.destroy();
        this.assets.text.destroy();
        this.assets = { };
      }

      this.context.powerUps[0].active = 0;
      this.context.gameScene.radialContainer.enable();

      this.active = false;
    }

  }
}
