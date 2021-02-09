// ES6 Class adding a method to the Person prototype
class PauseScreen {
  constructor(app, loader, resources) {
    this.stage = app.stage;
    this.app = app;
    this.menuHolder = { };
    this.loader = loader;
    this.resources = resources;
  }

  /**
   * Render the menu
   */
  render(level, score) {

    this.menuHolder = new PIXI.Container();
    this.stage.addChild(this.menuHolder);
    this.playerScore = score;
    this.playerLevel = level;
    const that = this;

    // Background
    var whiteFlash = new PIXI.Graphics();
    whiteFlash.beginFill(0x000000);
    whiteFlash.drawRect(0, 0, this.app.view.width, this.app.view.height);
    whiteFlash.endFill();
    whiteFlash.x = 0;
    whiteFlash.y = 0;
    this.menuHolder.addChild(whiteFlash);

    // // Title
    var titleText = new PIXI.Text("Paused", new PIXI.TextStyle({
      fontFamily: "emery",
      fontSize: 50,
      fill: '#f2bb05',
      stroke: '#222034',
      strokeThickness: 7,
      align: 'center'
    }));
    titleText.x = (this.app.view.width / 2) - (titleText.width / 2);
    titleText.y = 75;
    this.menuHolder.addChild(titleText);

    // Level
    var levelText = new PIXI.Text("Level: " + this.playerLevel, new PIXI.TextStyle({
      fontFamily: "patlabour",
      fontSize: 40,
      stroke: '#222034',
      strokeThickness: 7,
      fill: '#f0f0c9'
    }));
    levelText.x = (this.app.view.width / 2) - (levelText.width / 2);
    levelText.y = 300;
    this.menuHolder.addChild(levelText);

    var scoreText = new PIXI.Text("Humans Saved: " + this.playerScore.toFixed(2) + "k", new PIXI.TextStyle({
      fontFamily: "patlabour",
      fontSize: 20,
      stroke: '#222034',
      strokeThickness: 7,
      fill: '#f0f0c9'
    }));
    scoreText.x = (this.app.view.width / 2) - (scoreText.width / 2);
    scoreText.y = 350;
    this.menuHolder.addChild(scoreText);

    // Play Button
    const returnButton = new ButtonLarge(this.resources, "Resume");
    returnButton.x = (this.app.view.width / 2) - (returnButton.width / 2);
    returnButton.y = this.app.view.height - 250;
    this.menuHolder.addChild(returnButton);

    returnButton.on('pointerdown', function (e) {
      document.body.dispatchEvent(new CustomEvent("event:togglepausegame", {
        bubbles: true,
        detail: {
          scene: that
        }
      }));
    });

    // Restart Button
    var restartButton = new ButtonLarge(this.resources, "End Game");
    restartButton.x = (this.app.view.width / 2) - (restartButton.width / 2);
    restartButton.y = returnButton.y + 95;
    this.menuHolder.addChild(restartButton);

    restartButton.on('pointerdown', function (e) {
      document.body.dispatchEvent(new CustomEvent("event:gameover", {
        bubbles: true,
        detail: {
          scene: that,
          level: that.playerLevel,
          score: that.playerScore
        }
      }));
    });
  }

  destroy() {
    this.menuHolder.destroy();
  }
}
