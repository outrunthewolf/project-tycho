
// ES6 Class adding a method to the Person prototype
class IntroRules {
  constructor(app, loader, resources) {
    this.app = app;
    this.resources = resources;
    this.loader = loader;

    var displayContainer = new PIXI.Container();

    var background = new PIXI.Sprite(this.resources.backgroundPrimary.texture);
    background.height = this.app.view.height;
    background.width = this.app.view.width;
    background.x = 0;
    background.y = 0;
    displayContainer.addChild(background);

    var rules = new PIXI.Sprite(this.resources.backgroundRules.texture);
    rules.width = 300;
    rules.height = 300;
    rules.x = (this.app.view.width / 2) - (rules.width / 2);
    rules.y = this.app.view.height - 310;
    displayContainer.addChild(rules);

    // Background Text
    var text = "The moon is our last line of defense against the Alien scourge.\n\nDefeat them in the ancient game of Rock, Paper, Scissors...";
    var text = new PIXI.Text(text, new PIXI.TextStyle({
      fontFamily: "patlabour",
      fontSize: 34,
      fill: '#f0f0c9',
      stroke: '#000',
      strokeThickness: 1,
      wordWrap: true,
      wordWrapWidth: this.app.view.width - 40
    }));
    text.y = 40;
    text.x = (this.app.view.width / 2) - (text.width / 2);
    displayContainer.addChild(text);

    return displayContainer;
  }
}
