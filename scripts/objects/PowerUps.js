
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
    this.powerUps = [{
      name: "powerShield",
      count: 0,
      action: that.powerShield,
      context: that
    },{
      name: "timeDilation",
      count: 0,
      action: that.timeDilation,
      context: that
    }];
    this.rerender = false;
    this.powerUpContainer = { };

    this.boot();
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
  }

  // Watch for events
  play() {

    // Evaluate the success count
    if (this.successCount !== 0 ) {
      if (this.trackedSuccess != this.successCount) {

        // Track powerups for PowerShield
        if (this.successCount % 2 == 0) {
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

      console.log(powerUp);
      powerUp.action();

      this.rerender = true;
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
    console.log("You got one! Success Count: " + this.successCount);
  }

  // Failure
  onFailedDefense(e) {
    this.successCount = 0;
    console.log("You got wiped out! Success Count: " + this.successCount);
  }

  // Spefici opowerup functons
  timeDilation() {
    console.log("Setting attack speed");
    this.context.gameScene.alien.setAttackSpeed(0.2);
  }

  powerShield() {
    console.log("Creating shield");
    console.log(this.context.gameScene.alien.getAttackSpeed());
  }
}
