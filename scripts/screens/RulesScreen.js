// ES6 Class adding a method to the Person prototype
class RulesScreen {
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

    //
    // // Title
    var titleText = new PIXI.Text("How To Play", new PIXI.TextStyle({
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

    // Background Text
    var textn = "1. Hold down mouse to show defence radial\n\n2. Release mouse on chosen defence (Paper, Rock, Scissors)\n\n3. Hold out as long as you can!";
    var text = new PIXI.Text(textn, new PIXI.TextStyle({
      fontFamily: "patlabour",
      fontSize: 34,
      fill: '#f0f0c9',
      stroke: '#000',
      strokeThickness: 1,
      wordWrap: true,
      wordWrapWidth: this.app.view.width - 40
    }));
    text.y = (this.app.view.height / 2) - (text.height / 2);
    text.x = (this.app.view.width / 2) - (text.width / 2);
    this.menuHolder.addChild(text);

    // Play Button
    const exitButton = new ButtonLarge(this.resources, "<- Back");
    exitButton.x = (this.app.view.width / 2) - (exitButton.width / 2);
    exitButton.y = this.app.view.height - 135;
    this.menuHolder.addChild(exitButton);

    exitButton.on('pointerdown', function (e) {
      document.body.dispatchEvent(new CustomEvent("event:showmainmenu", {
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
