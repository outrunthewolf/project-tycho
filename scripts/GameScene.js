// ES6 Class adding a method to the Person prototype
class GameScene {
  constructor(app, loader, resources) {
    this.stage = app.stage;
    this.app = app;
    this.backgroundHolder = { };
    this.backgroundStoryHolder = { };
    this.loader = loader;
    this.resources = resources;

    this.scoreText = { };


    // Player Stuff - In this case the player is the moon
    this.player = { };
    this.playerHealth = 6;
    this.playerAttack = { };

    // Opponent - In this case evil aliens
    this.alien = { };
    this.alienHealth = 100;
    this.alienAttackSpeed = 3;

    // Scene resources
    // This is a fullscreen page flash of white
    // We use it for things like transitions and explosions
    this.whiteFlash = { };
    // This is a neat white line that flashes
    // When you defend against an attack
    this.defenseFlash = { };

    // UI pieces
    this.pauseButton = { };
    this.healthBarMask = { };
    this.healthBar = { };
    this.healthBarStep = 0; // Mask step

    this.opponent = { };
    this.battleScene = { };
    this.attackArray = [ ];
    this.attackLength = 10;
    this.attacks = [ ];

    this.alienScore = 0;
    this.playerScore = 0;

    // Radial
    this.radialContainer = { };

    // Battle animation objects
    this.opponentAnimation = { };
    this.playerAnimation = { };

    // Story board stuff
    this.storyIntro1 = { };
    this.storyIntro2 = { };
    this.storyIntro3 = { };

    // Variables
    this.paused = false;
    this.ready = false;
    this.gameOver = false;
    this.gameOverDispatched = false;

    this.attacks = [];
  }

  /**
   *
   */
  generateAttackArray() {
    var pool = [
      {
        name: "rock",
        texture: "avatarRock"
      },{
        name: "scissors",
        texture: "avatarScissors"
      },{
        name: "paper",
        texture: "avatarPaper"
      }
    ];

    var arr = [ ];

    for (var i = 0; i < this.attackLength; i++) {
         var randomChar = pool[Math.floor(Math.random() * pool.length)];
         arr.push(randomChar);
    }

    return arr;
  }

  /**
   * All that shit that happens every tick
   */
  play() {
    if (!this.ready) return;
    if (this.gameOver == true) return;
    if (this.paused == true) return;

    // Start firing the attack things down
    if(this.playerHealth > 0 && this.attacks.length > 0) {

      var lastItem = this.attacks[this.attacks.length - 1];
      lastItem.alpha = 1;
      lastItem.y += this.alienAttackSpeed;

      if (lastItem.y > 450) {
        // Here we should evaluate what the human has done
        switch(true) {
          case (lastItem.name == this.radialContainer.getCurrentPlayerAttack()):
            this.draw();
            break;
          case (lastItem.name == 'rock' && this.radialContainer.getCurrentPlayerAttack() == 'scissors'):
            this.lose();
            break;
          case (lastItem.name == 'rock' && this.radialContainer.getCurrentPlayerAttack() == 'paper'):
            this.win();
            break;
          case (lastItem.name == 'paper' && this.radialContainer.getCurrentPlayerAttack() == 'scissors'):
            this.win();
            break;
          case (lastItem.name == 'paper' && this.radialContainer.getCurrentPlayerAttack() == 'rock'):
            this.lose();
            break;
          case (lastItem.name == 'scissors' && this.radialContainer.getCurrentPlayerAttack() == 'rock'):
            this.win();
            break;
          case (lastItem.name == 'scissors' && this.radialContainer.getCurrentPlayerAttack() == 'paper'):
            this.lose();
            break;
          default:
            this.lose();
        }

        this.attacks[this.attacks.length - 1].destroy();
        this.attacks.splice(this.attacks.length - 1, 1);

        this.scoreText.text = this.playerScore;
      }
    }else{
      let that = this;
      this.gameOver = true;
      if(this.gameOverDispatched == false) {

        // De-materialise all elements on screen
        this.healthBar.visible = 0;
        this.healthBarMask.visible = 0;
        this.pauseButton.visible = 0;

        var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
        tl.to(this.whiteFlash, {alpha: 1, duration: 0});
        tl.to(this.whiteFlash, {alpha: 0, duration: 2});

        this.battleScene.destroy();

        gsap.to(this.player, {y: (this.app.view.height / 2) - this.player.height, duration: 5});

        tl.to(this.alien, {y: 1000, duration: 2, onComplete: function() {
          document.body.dispatchEvent(new CustomEvent("event:gameover", {
            detail: {
              scene: that
            },
            bubbles: true
          }));
        }});
      }
    }
  }

  /**
   * Render the menu
   */
  render() {

    // Setup the scene
    let that = this;
    this.backgroundHolder = new PIXI.Container();
    this.backgroundHolder.sortableChildren = true;
    this.stage.addChild(this.backgroundHolder);

    // Load all the stuff we need
    this.attackArray = this.generateAttackArray();

    // Load in the animate background
    const textures = [];
    var arraySize = Object.keys(this.resources.backgroundBattleAnimated.spritesheet.data.frames).length;

    for (var i = 0; i < arraySize; i++) {
      const framekey = `background-battle-animated ${i}.aseprite`;
      const texture = PIXI.Texture.from(framekey);
      const time = this.resources.backgroundBattleAnimated.spritesheet.data.frames[framekey].duration;
      textures.push({ texture, time });
    }

    // Also draw the background in at the same time so we fade to it
    this.battleScene = new PIXI.AnimatedSprite(textures);
    this.battleScene.y = 0;
    this.battleScene.x = 0;
    this.battleScene.height = this.app.view.height;
    this.battleScene.width = this.app.view.width;
    this.battleScene.vx = 0;
    this.battleScene.vy = 0;
    this.battleScene.alpha = 0;
    this.backgroundHolder.addChild(this.battleScene);

    // Load in the alien
    const alienTextures = [];
    var arraySize = Object.keys(this.resources.alienAnimated.spritesheet.data.frames).length;

    for (var i = 0; i < arraySize; i++) {
      const framekey = `alien-animated ${i}.aseprite`;
      const texture = PIXI.Texture.from(framekey);
      const time = this.resources.alienAnimated.spritesheet.data.frames[framekey].duration;
      alienTextures.push({ texture, time });
    }
    this.alien = new PIXI.AnimatedSprite(alienTextures);
    this.alien.height = 100;
    this.alien.width = 100;
    this.alien.x = (this.app.view.width / 2) - (this.alien.width / 2);
    this.alien.y = -300;
    this.alien.alpha = 0;
    this.alien.vx = 0;
    this.alien.vy = 0;


    // Load the aliens attack
    for (i = 0; i < this.attackArray.length; i++) {
      this.attacks[i] = new PIXI.Sprite(this.resources[this.attackArray[i].texture].texture);
      this.attacks[i].width = 40;
      this.attacks[i].height = 40;
      this.attacks[i].x = (this.app.view.width / 2) - (this.attacks[i].width / 2);
      this.attacks[i].y = 55;
      this.attacks[i].alpha = 0;
      this.attacks[i].name = this.attackArray[i].name;
      this.backgroundHolder.addChild(this.attacks[i]);
    }
    this.backgroundHolder.addChild(this.alien);

    // Load in the player
    const playerTextures = [];
    var arraySize = Object.keys(this.resources.moonAnimated.spritesheet.data.frames).length;

    for (var i = 0; i < arraySize; i++) {
      const framekey = `background-moon-animated ${i}.aseprite`;
      const texture = PIXI.Texture.from(framekey);
      const time = this.resources.moonAnimated.spritesheet.data.frames[framekey].duration;
      playerTextures.push({ texture, time });
    }
    this.player = new PIXI.AnimatedSprite(playerTextures);
    this.player.height = 175;
    this.player.width = 175;
    this.player.x = (this.app.view.width / 2) - (this.player.width / 2);
    this.player.y = this.app.view.height + 200;
    this.player.alpha = 0;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.name = "player";
    this.backgroundHolder.addChild(this.player);

    // Load in the player
    // this.player = new PIXI.Sprite(this.resources.avatarRock.texture);
    // this.player.y = 900;
    // this.player.x = -100;
    // this.player.height = 75;
    // this.player.width = 75;
    // this.player.vx = 0;
    // this.player.vy = 0;
    // this.player.tint = '0xFF9600';
    // this.player.alpha = 0;
    // this.backgroundHolder.addChild(this.player);

    // White flash
    this.whiteFlash = new PIXI.Graphics();
    this.whiteFlash.lineStyle(4, 0xFF3300, 1);
    this.whiteFlash.beginFill(0xF0F0C9);
    this.whiteFlash.drawRect(0, 0, this.app.view.width, this.app.view.height);
    this.whiteFlash.endFill();
    this.whiteFlash.x = 0;
    this.whiteFlash.y = 0;
    this.whiteFlash.alpha = 0;
    this.backgroundHolder.addChild(this.whiteFlash);

    // Defense flash
    this.defenseFlash = new PIXI.Graphics();
    this.defenseFlash.lineStyle(4, 0xFFFFFF, 1);
    this.defenseFlash.beginFill(0xFFFFFF);
    this.defenseFlash.drawRect(0, 0, this.app.view.width, 2);
    this.defenseFlash.endFill();
    this.defenseFlash.x = 0;
    this.defenseFlash.y = 450;
    this.defenseFlash.alpha = 0;
    this.defenseFlash.name = "defenseFlash";
    this.backgroundHolder.addChild(this.defenseFlash);

    // pause button
    this.pauseButton = new ButtonSmallPause(this.resources, "");
    this.pauseButton.x = this.app.view.width - this.pauseButton.width - 20;
    this.pauseButton.y = 20;
    this.backgroundHolder.addChild(this.pauseButton);

    this.pauseButton.on('pointerdown', function(event) {
      document.body.dispatchEvent(new CustomEvent("event:togglepausegame", {
        bubbles: true
      }));
    });

    // Score
    this.scoreText = new PIXI.Text("0", new PIXI.TextStyle({
      fontFamily: "arial",
      fontSize: 50,
      fill: '#FFFFFF'
    }));
    this.scoreText.x = 0;
    this.scoreText.y = 0;
    this.backgroundHolder.addChild(this.scoreText);

    // player Health
    this.healthBar = new PIXI.Sprite(this.resources.healthBar.texture);
    this.healthBar.height = 25;
    this.healthBar.width = 150;
    this.healthBar.x = (this.app.view.width / 2) - (this.healthBar.width / 2);
    this.healthBar.y = 730;
    this.healthBar.vx = 0;
    this.healthBar.vy = 0;
    this.healthBar.alpha = 0;
    this.backgroundHolder.addChild(this.healthBar);

    // player cover
    this.healthBarMask = new PIXI.Graphics();
    this.healthBarMask.lineStyle(0, 0xFF9600, 1);
    this.healthBarMask.beginFill(0x000000);
    this.healthBarMask.drawRect(0, 0, 1, 20);
    this.healthBarMask.endFill();
    this.healthBarMask.name = "cover";
    this.healthBarMask.x = this.healthBar.x;
    this.healthBarMask.y = 732;
    this.healthBarMask.zIndex = 999;
    this.healthBar.alpha = 0;
    this.backgroundHolder.addChild(this.healthBarMask);

    // Intro storyboard
    this.backgroundStoryHolder = new PIXI.Container();

    this.introStory1 = new PIXI.Sprite(this.resources.backgroundStoryIntro1.texture);
    this.introStory1.height = this.app.view.height;
    this.introStory1.width = this.app.view.width;
    this.introStory1.x = 0;
    this.introStory1.y = 0;
    this.introStory1.vx = 0;
    this.introStory1.vy = 0;
    this.introStory1.alpha = 1;
    this.backgroundStoryHolder.addChild(this.introStory1);

    this.introStory2 = new PIXI.Sprite(this.resources.backgroundStoryIntro2.texture);
    this.introStory2.height = this.app.view.height;
    this.introStory2.width = this.app.view.width;
    this.introStory2.x = 0;
    this.introStory2.y = 0;
    this.introStory2.vx = 0;
    this.introStory2.vy = 0;
    this.introStory2.alpha = 0;
    this.backgroundStoryHolder.addChild(this.introStory2);

    this.introStory3 = new PIXI.Sprite(this.resources.backgroundStoryIntro3.texture);
    this.introStory3.height = this.app.view.height;
    this.introStory3.width = this.app.view.width;
    this.introStory3.x = 0;
    this.introStory3.y = 0;
    this.introStory3.vx = 0;
    this.introStory3.vy = 0;
    this.introStory3.alpha = 0;
    this.backgroundStoryHolder.addChild(this.introStory3);

    this.skipButton = new ButtonSmallSkip(this.resources);
    this.skipButton.x = this.app.view.width - 20 - this.skipButton.width;
    this.skipButton.y = this.app.view.height - 20 - this.skipButton.height;
    this.backgroundStoryHolder.addChild(this.skipButton);

    this.backgroundHolder.addChild(this.backgroundStoryHolder);
    //

    // All loaded, lets animate everything in.
    this.radialContainer = new Radial(this.resources);
    this.backgroundHolder.addChild(this.radialContainer.getRenderable());

    // Do other stuff
    this.loadAnimationObjects();
    this.animate();

    // Fire event when we're ready to start everything
    document.body.addEventListener("playerAttackDropped", function (e) {
      gsap.to(that.battleScene, that.shakeLeftRightAnimation(that.battleScene.y));
    });

    // Fire event when we're ready to start everything
    document.body.addEventListener("readyToPlay", function (e) {
      that.ready = true;
      that.play();
    });
  }

  /**
   *
   */
  animate() {

    var originalPos = this.battleScene.y;
    var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
    var that = this;

    this.skipButton.on('pointerdown', function(event) {
      tl.seek("startGame");
    });

    // Load a black screen
    tl.to(this.introStory1, {alpha:1, duration: 1}).addLabel("intro1");
    tl.to(this.introStory2, {alpha:1, duration: 1}, "=+3").addLabel("intro2");
    tl.to(this.introStory3, {alpha: 1, duration: 1}, "=+4").addLabel("intro3");

    tl.to(this.backgroundStoryHolder, {alpha: 0, duration: 2}, "=+4").addLabel("startGame");
    tl.to(this.backgroundStoryHolder, {visible: false, duration: 0});
    tl.to(this.skipButton, {visible: false, duration: 0, onComplete: function() {
      that.backgroundStoryHolder.destroy();
    }});
    // Wait for button press

    tl.fromTo(this.player, {y: this.app.view.height + 700, alpha: 1}, {y: this.app.view.height - 200, alpha: 1, duration: 2 });
    tl.to(this.healthBar, {y: this.app.view.height - 230 + this.player.height, alpha: 1});
    tl.to(this.healthBarMask, {y: this.app.view.height - 228 + this.player.height, alpha: 1});
    tl.fromTo(this.alien, {y: 0, alpha: 0}, {y: 50, alpha: 1});

    tl.to(this.whiteFlash, {alpha: 1, duration: 0});
    tl.to(this.battleScene, {alpha: 1, duration: 0});

    // Do some work
    this.step = this.healthBar.width / this.playerHealth;
    this.battleScene.play();
    this.alien.play();

    tl.to(this.whiteFlash, {alpha: 0, duration: 2, onComplete: function() {
      document.body.dispatchEvent(new CustomEvent("readyToPlay", {
        bubbles: true
      }));
    }});
  }

  /**
   *
   */
  draw() {
    document.body.dispatchEvent(new CustomEvent("draw", {
      bubbles: true
    }));

    console.log("DRAW");
  }

  /**
   *
   */
  win() {
    document.body.dispatchEvent(new CustomEvent("win", {
      bubbles: true
    }));

    // Flash the barrier and shake the enemy
    var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
    tl.to(this.defenseFlash, { alpha: 1, duration: 0.1 });
    tl.to(this.defenseFlash, { alpha: 0, duration: 0.2 });

    var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
    tl.to(this.alien, { tint: 0xFF9600, duration: 0.2 });
    tl.to(this.alien, { tint: 0xFFFFFF, duration: 0.2 });
    gsap.to(this.alien, this.shakeUpDownAnimation(this.alien.y));

    ++this.playerScore;
  }

  /**
   *
   */
  lose() {
    document.body.dispatchEvent(new CustomEvent("lose", {
      bubbles: true
    }));

    ++this.alienScore;
    --this.playerHealth;

    var frame = this.player.currentFrame + 1;
    this.player.gotoAndStop(frame);

    // change cover
    this.healthBarMask.width += this.step;
    this.healthBarMask.x = (this.app.view.width / 2) - (this.healthBar.width / 2) + this.healthBar.width - (this.healthBarMask.width) - 4;

    // Flash the player
    var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
    tl.to(this.player, { tint: 0xFF9600, duration: 0.2 });
    tl.to(this.player, { tint: 0xFFFFFF, duration: 0.2 });
    gsap.to(this.player, this.shakeUpDownAnimation(this.player.y));
  }

  /**
   *
   */
  loadAnimationObjects() {
    this.opponentAnimation = {x: (this.app.view.width / 2) - (this.opponent.width / 2) + 15, y: (this.app.view.height / 2) - (this.opponent.height / 2) - 30, duration: 0.5, ease: "power4.in"};
    this.playerAnimation = {x: (this.app.view.width / 2) - (this.player.width / 2) - 15, y: (this.app.view.height / 2) - (this.player.height / 2) + 30, duration: 0.5, ease: "power4.in"};
  }

  /**
   *
   */
  shakeUpDownAnimation(y) {
    return { keyframes: [{
          y: y + 25,
          duration: 0.2
        },
        {
            y: y + 15,
            duration: 0.2
          },
        {
          y: y,
          duration: 0.2
        }
      ],
      ease: "elastic"
    };
  }

  /**
   *
   */
  shakeLeftRightAnimation(x) {
    return { keyframes: [{
          x: x + 25,
          duration: 0.2
        },
        {
            x: x + 15,
            duration: 0.2
          },
        {
          x: x,
          duration: 0.2
        }
      ],
      ease: "elastic"
    };
  }

  /**
   * Pause any things happening
   */
  togglePause() {
    if(this.paused == true) {
      this.paused = false;
      this.battleScene.play();
      this.alien.play();
    }else{
      this.paused = true;
      this.battleScene.stop();
      this.alien.stop();
    }
  }

  /**
   * Replay the animations
   */
  replay() {
    this.destroy();
  }

  /**
   *
   */
  destroy() {
    this.backgroundHolder.destroy();
  }
}
