
// ES6 Class adding a method to the Person prototype
class PowerUps {
  constructor(app, loader, resources) {
    this.stage = app.stage;
    this.app = app;
    this.loader = loader;
    this.resources = resources;

    this.successCount = 0;
    this.trackedSuccess = 1;
    this.powerUps = [ ];
    this.rerender = false;
    this.powerUpContainer = { };

    this.boot();
  }

  //
  boot() {
    this.powerUpContainer = new PIXI.Container();
    this.powerUpContainer.name = "power-up-container";
    this.stage.addChild(this.powerUpContainer);
    this.powerUpContainer.x = 50;
    this.powerUpContainer.y = (this.app.view.height / 2);
    this.powerUpContainer.zIndex = 99999;

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
  /*

    - How many defenses we've acheived in a row
      - 1 - Nothing
        2 - Nothing
        3 - Shield
        4 - Speed Reduction
        5 - Shield

        Miss - restart


  */
  play() {

    // Evaluate the success count
    if (this.successCount !== 0 && (this.successCount % 2) == 0) {

      if (this.trackedSuccess == this.successCount) return;

      this.powerUps.push({
        name: "Slow Time",
        action: function() {
          console.log("I SHALL SLOW TIME!!");
        }
      });

      console.log("We're in");
      console.log(this.trackedSuccess);

      this.trackedSuccess = this.successCount;
      this.rerender = true;
    }

    if(this.rerender === true) {
      this.render();
      this.rerender = false;
    }
  }

  // Render powerUps
  render() {

    for(var i = 0; i < this.powerUps.length; ++i) {
      var powerUpBox = new PIXI.Graphics();
      powerUpBox.lineStyle(4, 0xFF9600, 1);
      powerUpBox.beginFill(0xFF9600);
      powerUpBox.drawRect(0, 0, 50, 50);
      powerUpBox.endFill();
      powerUpBox.x = 10 + (50 * i);
      powerUpBox.y = 0;
      powerUpBox.zIndex = 99999;
      powerUpBox.interactive = true;
      powerUpBox.buttonMode = true;
      powerUpBox.alpha = 0.8;
      powerUpBox.name = this.powerUps[i].name;

      powerUpBox.click = function (e) {
        this.powerUps[i].action();
      };

      this.powerUpContainer.addChild(powerUpBox);
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
}
