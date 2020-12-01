// ES6 Class adding a method to the Person prototype
class MainMenuScreen {
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
  render() {

    this.menuHolder = new PIXI.Container();
    this.stage.addChild(this.menuHolder);
    const that = this;

    // Spinning Flash Thingy
    const flashTextures = [];
    var arraySize = Object.keys(this.resources.backgroundFlashAnimated.spritesheet.data.frames).length;
    for (var i = 0; i < arraySize; i++) {
      const framekey = `background-flash-animated ${i}.aseprite`;
      const texture = PIXI.Texture.from(framekey);
      const time = this.resources.backgroundFlashAnimated.spritesheet.data.frames[framekey].duration;
      flashTextures.push({ texture, time });
    }
    var flash = new PIXI.AnimatedSprite(flashTextures);
    flash.height = 600;
    flash.width = 600;
    flash.x = (this.app.view.width / 2) - (flash.width / 2) + 20;
    flash.y = -120;
    flash.alpha = 1;
    flash.vx = 0;
    flash.vy = 0;
    flash.name = "animatedFlash";
    this.menuHolder.addChild(flash);
    flash.play();

    // Load in the moon
    var planet = new PIXI.Sprite(this.resources.backgroundMoon.texture);
    planet.height = 175;
    planet.width = 175;
    planet.x = (this.app.view.width / 2) - (planet.width / 2);
    planet.y = 55;
    planet.vx = 0;
    planet.vy = 0;
    planet.alpha = 1;
    planet.name = "moon";
    this.menuHolder.addChild(planet);

    // Title
    var titleText = new PIXI.Text("Project\nTycho", new PIXI.TextStyle({
      fontFamily: "emery",
      fontSize: 75,
      fill: '#f2bb05',
      stroke: '#222034',
      strokeThickness: 7,
      align: 'center'
    }));
    titleText.x = (this.app.view.width / 2) - (titleText.width / 2);
    titleText.y = 75;
    this.menuHolder.addChild(titleText);

    // Sub text
    var subText = new PIXI.Text("Only the Moon\ncan save the Earth!", new PIXI.TextStyle({
      fontFamily: "emery",
      fontSize: 25,
      fill: '#d74e09',//red ,//'#f0f0c9'// white,
      align: 'center'
    }));
    subText.x = (this.app.view.width / 2) - (subText.width / 2);
    subText.y = titleText.y + 175;
    this.menuHolder.addChild(subText);

    // Play Button
    const playButton = new ButtonLarge(this.resources, "Play");
    playButton.x = (this.app.view.width / 2) - (playButton.width / 2);
    playButton.y = this.app.view.height - 250;
    this.menuHolder.addChild(playButton);

    playButton.on('pointerdown', function (e) {
      document.body.dispatchEvent(new CustomEvent("event:playgame", {
        bubbles: true,
        detail: {
          scene: that
        }
      }));
    });

    // How to play
    const howButton = new ButtonLarge(this.resources, "How to Play");
    howButton.x = (this.app.view.width / 2) - (playButton.width / 2);
    howButton.y = playButton.y + 95;
    this.menuHolder.addChild(howButton);

    howButton.on('pointerdown', function (e) {
      document.body.dispatchEvent(new CustomEvent("event:howtoplay", {
        bubbles: true,
        detail: {
          scene: that
        }
      }));
    });

    // // Settings Button
    // const creditsButton = new ButtonLarge(this.resources, "Credits");
    // creditsButton.x = (this.app.view.width / 2) - (creditsButton.width / 2);
    // creditsButton.y = howButton.y + 95;
    // this.menuHolder.addChild(creditsButton);
    //
    // creditsButton.on('pointerdown', function (e) {
    //   document.body.dispatchEvent(new CustomEvent("event:showcredits", {
    //     bubbles: true,
    //     detail: {
    //       scene: that
    //     }
    //   }));
    // });



  }

  destroy() {
    this.menuHolder.destroy();
  }
}
