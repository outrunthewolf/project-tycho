// ES6 Class adding a method to the Person prototype
class GameOverScreen {
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
    const that = this;

    // Load in the planet
    const planetTextures = [];
    var arraySize = Object.keys(this.resources.moonAnimated.spritesheet.data.frames).length;

    for (var i = 0; i < arraySize; i++) {
      const framekey = `background-moon-animated ${i}.aseprite`;
      const texture = PIXI.Texture.from(framekey);
      const time = this.resources.moonAnimated.spritesheet.data.frames[framekey].duration;
      planetTextures.push({ texture, time });
    }
    this.planet = new PIXI.AnimatedSprite(planetTextures);
    this.planet.height = 175;
    this.planet.width = 175;
    this.planet.x = (this.app.view.width / 2) - (this.planet.width / 2);
    this.planet.y = this.app.view.height / 2  - this.planet.height;
    this.planet.alpha = 1;
    this.planet.vx = 0;
    this.planet.vy = 0;
    this.planet.name = "planet";
    this.menuHolder.addChild(this.planet);
    this.planet.gotoAndStop(6);

    //
    // // Title
    var titleText = new PIXI.Text("Game Over", new PIXI.TextStyle({
      fontFamily: "emery",
      fontSize: 50,
      fill: '#f2bb05',
      stroke: '#222034',
      strokeThickness: 7,
      align: 'center'
    }));
    titleText.x = (this.app.view.width / 2) - (titleText.width / 2);
    titleText.y = 100;
    this.menuHolder.addChild(titleText);

    // Score
    var levelText = new PIXI.Text("You reached\nLevel: " + level + "!", new PIXI.TextStyle({
      fontFamily: "patlabour",
      fontSize: 40,
      stroke: '#222034',
      strokeThickness: 7,
      fill: '#f0f0c9',
      align: "center"
    }));
    levelText.x = (this.app.view.width / 2) - (levelText.width / 2);
    levelText.y = 300;
    this.menuHolder.addChild(levelText);

    var scoreText = new PIXI.Text("Humans saved: " + score.toFixed(2) + "k", new PIXI.TextStyle({
      fontFamily: "patlabour",
      fontSize: 20,
      stroke: '#222034',
      strokeThickness: 7,
      fill: '#f0f0c9',
      align: "center"
    }));
    scoreText.x = (this.app.view.width / 2) - (scoreText.width / 2);
    scoreText.y = 390;
    this.menuHolder.addChild(scoreText);

    // Main Menu Button
    var exitButton = new ButtonLarge(this.resources, "Main Menu");
    exitButton.x = (this.app.view.width / 2) - (exitButton.width / 2);
    exitButton.y = this.app.view.height - 230;
    this.menuHolder.addChild(exitButton);

    exitButton.on('pointerdown', function (e) {
      document.body.dispatchEvent(new CustomEvent("event:showmainmenu", {
        bubbles: true,
        detail: {
          scene: that
        }
      }));
    });

    // Restart Button
    var restartButton = new ButtonLarge(this.resources, "Play Again", 75, 150, "playAgainButton");
    restartButton.x = (this.app.view.width / 2) - (restartButton.width / 2);
    restartButton.y = exitButton.y + 95;
    this.menuHolder.addChild(restartButton);

    restartButton.on('pointerdown', function (e) {
      document.body.dispatchEvent(new CustomEvent("event:playgame", {
        bubbles: true,
        detail: {
          scene: that
        }
      }));
    });
  }

  destroy() {
    this.menuHolder.destroy();
  }
}
