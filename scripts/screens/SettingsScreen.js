// ES6 Class adding a method to the Person prototype
class SettingsScreen {
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
    var titleText = new PIXI.Text("Settings", new PIXI.TextStyle({
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
