let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

//Aliases
let Application = PIXI.Application,
  Container = PIXI.Container,
  loader = new PIXI.Loader(),
  resources = { },
  gameEventArray = [ ];
  pause = false;

// Get the saize of container and set this as the canvas
const container = document.getElementById('container');
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

//Create a Pixi Application
let app = new Application({
  width: containerWidth,
  height: containerHeight,
  antialiasing: true,
  transparent: true,
  resolution: 1
});

// Create the view
container.appendChild(app.view);

// Load all assets
let loadingScreen = new LoadingScreen(app, loader, resources);
loadingScreen.load();

/**
 * LOADING COMPLETE
 *
 * Here's where we start the game
 */
loader.onComplete.once((loaderObject, assetsObject) => {
  loadingScreen.destroy();
  resources = assetsObject;
  loadScenes(); // Load all scenes and events associated with them
  begin(); // Start the tick and fire the main menu event
});

/**
 * Load all the scenes we want
 * And enable the events on those scenes
 */
function loadScenes() {
  let menuScreen = new MainMenuScreen(app, loader, resources);
  let settingsScreen = new SettingsScreen(app, loader, resources);
  let howToPlayScreen = new RulesScreen(app, loader, resources);
  let gameOverScreen = new GameOverScreen(app, loader, resources);
  let pauseScreen = new PauseScreen(app, loader, resources);
  let gameScene = { };

  app.stage.sortableChildren = true;

  // Screen: Menu
  document.body.addEventListener("event:showmainmenu", function (e) {
    menuScreen.render();
    app.stage.sortChildren();

    if (e.detail) e.detail.scene.destroy();

    // Clear any old games in progress
    gameScene = { };
    gameEventArray = [ ];
  });

  // Screen: Settings
  document.body.addEventListener("event:showsettings", function (e) {
    settingsScreen.render();
    app.stage.sortChildren();

    e.detail.scene.destroy();
  });

  // Screen: How to play
  document.body.addEventListener("event:howtoplay", function (e) {
    howToPlayScreen.render();
    app.stage.sortChildren();

    e.detail.scene.destroy();
  });

  // Event: Game Over
  document.body.addEventListener("event:gameover", function (e) {
    gameOverScreen.render(e.detail.scene.playerScore);
    app.stage.sortChildren();
    e.detail.scene.destroy();
    gameScene.destroy();

    // Clear any old games in progress
    gameScene = { };
    gameEventArray = [ ];
  });

  // Event: Play Game
  document.body.addEventListener("event:playgame", function (e) {
    gameScene = new GameScene(app, loader, resources);
    gameEventArray.push(gameScene);
    gameScene.render();
    app.stage.sortChildren();

    e.detail.scene.destroy();
  });

  // Screen: Settings
  document.body.addEventListener("event:togglepausegame", function (e) {
    if(pause == true) {
      e.detail.scene.destroy();
      gameScene.togglePause();
      pause = false;
    }else{
      pauseScreen.render(gameScene.playerScore);
      gameScene.togglePause();
      pause = true;
    }
  });
}

// Lets-a-go!
function begin() {
  document.body.dispatchEvent(new CustomEvent("event:showmainmenu", {
    bubbles: true
  }));

  state = play;
  app.ticker.add(delta => gameLoop(delta));
}

// Game Loop
function gameLoop(delta) {
  state(delta);
}

// Make sure anything in the gameEventArray is being run on tick
function play(delta) {
  if (pause !== true) {
    for (i = 0; i < gameEventArray.length; i++) {
      gameEventArray[i].play();
    }
  }
}
