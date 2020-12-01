// ES6 Class adding a method to the Person prototype
class GameScene {
  constructor(app, loader, resources, sound) {
    this.stage = app.stage;
    this.app = app;
    this.backgroundHolder = { };
    this.backgroundStoryHolder = { };
    this.loader = loader;
    this.resources = resources;
    this.sound = sound;

    // Player Stuff - In this case the player is the moon
    this.player = { };
    this.playerHealth = 6;
    this.playerAttack = { };
    this.playerScore = 0;
    this.playerScoreText = { };
    this.playerExplosion = { };

    // Opponent - In this case evil aliens
    this.alien = { };

    // Scene resources
    // This is a fullscreen page flash of white
    // We use it for things like transitions and explosions
    this.whiteFlash = { };
    // This is a neat white line that flashes
    // When you defend against an attack
    this.defenseFlash = { };
    this.battleScene = { }; // Flashing background

    // UI pieces
    this.pauseButton = { };
    this.healthBarMask = { };
    this.healthBar = { };
    this.healthBarStep = 0; // Mask step
    this.radialContainer = { };
    this.radialDefenseY = 10;

    // Story board stuff
    this.storyIntro1 = { };
    this.storyIntro2 = { };
    this.storyIntro3 = { };

    // Variables
    this.paused = false;
    this.ready = false;
    this.gameOver = false;
    this.gameOverDispatched = false;

    //
    this.nextAttackReady = true;
  }

  /**
   * All that shit that happens every tick
   */
  play() {
    if (!this.ready) return;
    if (this.paused == true) return;
    if (this.nextAttackReady == false) return;

    // Start firing the attack things down
    if(this.playerHealth > 0 && this.gameOver == false) {

      // render current alien attack at X position;
      this.alien.renderCurrentAttack();

      // If the player has dropped a defense and the alien attack hits it
      if ((this.alien.attack.y >= (this.player.y - this.radialDefenseY - 40))
            && this.radialContainer.currentPlayerAttack != "") {
        this.evaluateWinLoseDraw();

        if (this.alien.nextLevelOrAttack() == true) {
          this.playerScoreText.text = "Level: " + (this.alien.current_level+1);
          this.alien.destroyCurrentAttack();
        }else{
          this.gameOver = true;
        }
      }

      // If there is no attack
      if (this.alien.attack.y >= this.player.y) {
        this.lose();

        if (this.alien.nextLevelOrAttack() == true) {
          this.playerScoreText.text = "Level: " + (this.alien.current_level+1);
          this.alien.destroyCurrentAttack();
          this.sound.playSound("soundAlienDropAttack");
        }else{
          this.gameOver = true;
        }
      }

    }else{
      let that = this;
      this.gameOver = true;
      if(this.gameOverDispatched == false) {

        // De-materialise all elements on screen
        this.healthBar.visible = 0;
        this.healthBarMask.visible = 0;
        this.pauseButton.visible = 0;
        this.gameOverDispatched = true;
        this.backgroundHolder.removeChild(this.radialContainer);
        this.radialContainer.destroy();
        this.alien.destroyCurrentAttack();

        var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
        tl.to(this.whiteFlash, {alpha: 1, duration: 0});
        tl.to(this.whiteFlash, {alpha: 0, duration: 2});

        this.battleScene.destroy();

        tl.to(this.player, {y: (this.app.view.height / 2) - this.player.height, duration: 5});
        tl.to(this.alien.getRenderable(), {y: 1000, duration: 2, onComplete: function() {
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

  evaluateWinLoseDraw() {
    switch(true) {
      case (this.alien.attack.name == this.radialContainer.getCurrentPlayerAttack()):
        this.draw();
        break;
      case (this.alien.attack.name == 'rock' && this.radialContainer.getCurrentPlayerAttack() == 'scissors'):
        this.lose();
        break;
      case (this.alien.attack.name == 'rock' && this.radialContainer.getCurrentPlayerAttack() == 'paper'):
        this.win();
        break;
      case (this.alien.attack.name == 'paper' && this.radialContainer.getCurrentPlayerAttack() == 'scissors'):
        this.win();
        break;
      case (this.alien.attack.name == 'paper' && this.radialContainer.getCurrentPlayerAttack() == 'rock'):
        this.lose();
        break;
      case (this.alien.attack.name == 'scissors' && this.radialContainer.getCurrentPlayerAttack() == 'rock'):
        this.win();
        break;
      case (this.alien.attack.name == 'scissors' && this.radialContainer.getCurrentPlayerAttack() == 'paper'):
        this.lose();
        break;
      default:
        this.lose();
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

    // Load in the animate background
    const textures = [];
    var arraySize = Object.keys(this.resources.backgroundBattleAnimated.spritesheet.data.frames).length;

    for (var i = 0; i < arraySize; i++) {
      const framekey = `background-battle-animated ${i}.aseprite`;
      const texture = PIXI.Texture.from(framekey);
      const time = this.resources.backgroundBattleAnimated.spritesheet.data.frames[framekey].duration;
      textures.push({ texture, time });
    }
    this.battleScene = new PIXI.AnimatedSprite(textures);
    this.battleScene.y = 0;
    this.battleScene.x = 0;
    this.battleScene.height = this.app.view.height;
    this.battleScene.width = this.app.view.width;
    this.battleScene.vx = 0;
    this.battleScene.vy = 0;
    this.battleScene.alpha = 0;
    this.backgroundHolder.addChild(this.battleScene);

    this.alien = new Alien(this.app, this.loader, this.resources);
    this.alien.getRenderable().x = (this.app.view.width / 2) - (this.alien.getRenderable().width / 2);
    this.alien.getRenderable().y = -300;
    this.backgroundHolder.addChild(this.alien.getRenderable());

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

    // Load in the player explosion
    const playerExplosionTextures = [];
    var arraySize = Object.keys(this.resources.explosionVerticalAnimated.spritesheet.data.frames).length;

    for (var i = 0; i < arraySize; i++) {
      const framekey = `background-explosion-vertical-animated ${i}.aseprite`;
      const texture = PIXI.Texture.from(framekey);
      const time = this.resources.explosionVerticalAnimated.spritesheet.data.frames[framekey].duration;
      playerExplosionTextures.push({ texture, time });
    }
    this.playerExplosion = new PIXI.AnimatedSprite(playerExplosionTextures);
    this.playerExplosion.y = 0;
    this.playerExplosion.x = 0;
    this.playerExplosion.height = 150;
    this.playerExplosion.width = 150;
    this.playerExplosion.vx = 0;
    this.playerExplosion.vy = 0;
    this.playerExplosion.alpha = 0;
    this.playerExplosion.loop = false;
    this.playerExplosion.animationSpeed = 5;
    this.backgroundHolder.addChild(this.playerExplosion);

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
    this.defenseFlash.drawRect(0, 0, 2, this.app.view.height);
    this.defenseFlash.endFill();
    this.defenseFlash.x = (this.app.view.width / 2) - (this.defenseFlash.width / 2);
    this.defenseFlash.y = 0;
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
    this.playerScoreText = new PIXI.Text("Level: 1", new PIXI.TextStyle({
      fontFamily: "arial",
      fontSize: 50,
      fill: '#FFFFFF'
    }));
    this.playerScoreText.x = 0;
    this.playerScoreText.y = 0;
    this.backgroundHolder.addChild(this.playerScoreText);

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

    this.introStory1 = new IntroRules(this.app, this.loader, this.resources);
    this.introStory1.y = 0;
    this.introStory1.vx = 0;
    this.introStory1.vy = 0;
    this.introStory1.alpha = 1;
    this.introStory1.x = (this.app.view.width / 2) - (this.introStory1.width / 2);
    this.backgroundStoryHolder.addChild(this.introStory1);

    this.skipButton = new ButtonSmallSkip(this.resources);
    this.skipButton.x = this.app.view.width - 20 - this.skipButton.width;
    this.skipButton.y = this.app.view.height - (20 + this.skipButton.height);
    this.backgroundStoryHolder.addChild(this.skipButton);
    this.backgroundHolder.addChild(this.backgroundStoryHolder);

    // All loaded, lets animate everything in.
    this.radialContainer = new Radial(this.resources);
    this.radialContainer.getRenderable().visible = false;
    this.backgroundHolder.addChild(this.radialContainer.getRenderable());

    // Do other stuff
    this.animate();

    // Fire event when we're ready to start everything
    document.body.addEventListener("playerAttackDropped", function (e) {
      gsap.to(that.radialContainer.getCurrentPlayerAttackObject(), that.shakeUpDownAnimation(that.radialContainer.getCurrentPlayerAttackObject().y));
      that.sound.playSound('soundHumanDropDefense');
    });

    // Listen for next level
    document.body.addEventListener("event:nextlevel", function (e) {
      var shake = that.shakeUpDownAnimation(that.playerScoreText.y);
      shake.onComplete = function() {
        that.sound.playSound('soundNextLevel');
      };
      gsap.to(that.playerScoreText, shake);
    });

    // Fire event when we're ready to start everything
    document.body.addEventListener("readyToPlay", function (e) {
      that.ready = true;
      that.radialContainer.setRadialDefenseY(that.player.y - that.radialDefenseY);
      that.radialContainer.ready = true;
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
    // tl.to(this.introStory2, {alpha:1, duration: 1}, "=+3").addLabel("intro2");
    // tl.to(this.introStory3, {alpha: 1, duration: 1}, "=+4").addLabel("intro3");

    tl.to(this.backgroundStoryHolder, {alpha: 0, duration: 4}, "=+4").addLabel("startGame");
    tl.to(this.backgroundStoryHolder, {visible: false, duration: 0});
    tl.to(this.skipButton, {visible: false, duration: 0, onComplete: function() {
      that.backgroundStoryHolder.destroy();
    }});
    // Wait for button press

    tl.fromTo(this.player, {y: this.app.view.height + 700, alpha: 1}, {y: this.app.view.height - 200, alpha: 1, duration: 2});
    tl.to(this.healthBar, {y: this.app.view.height - 230 + this.player.height, alpha: 1});
    tl.to(this.healthBarMask, {y: this.app.view.height - 228 + this.player.height, alpha: 1});
    tl.fromTo(this.alien.getRenderable(), {y: 0, alpha: 0}, {y: 50, alpha: 1});

    tl.to(this.whiteFlash, {alpha: 1, duration: 0});
    tl.to(this.battleScene, {alpha: 1, duration: 0});

    tl.to(this.whiteFlash, {alpha: 0, duration: 1, onComplete: function() {

      that.step = that.healthBar.width / that.playerHealth;
      that.battleScene.play();
      that.alien.getRenderable().getChildByName("alien").play();

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

    this.sound.playSound('soundDraw');
  }

  /**
   *
   */
  win() {
    var that = this;
    this.nextAttackReady = false;

    document.body.dispatchEvent(new CustomEvent("win", {
      bubbles: true
    }));

    // Flash the barrier and shake the enemy
    var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
    tl.to(this.defenseFlash, { alpha: 1, duration: 0.1 });
    tl.to(this.defenseFlash, { alpha: 0, duration: 0.2 });

    var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
    tl.to(this.alien.getRenderable(), { tint: 0xFF9600, duration: 0.2 });
    tl.to(this.alien.getRenderable(), { tint: 0xFFFFFF, duration: 0.2 });
    var shake = this.shakeUpDownAnimation(this.alien.getRenderable().y);
    shake.onComplete = function() {
      that.sound.playSound("soundAlienDropAttack");
      that.nextAttackReady = true;
    };
    gsap.to(this.alien.getRenderable(), shake);

    ++this.playerScore;

    this.sound.playSound('soundWin');
    //this.sound.playSound('soundHumanAttack');
  }

  /**
   *
   */
  lose() {
    var that = this;
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
    gsap.to(this.playerExplosion, {alpha: 1, duration: 0, x: (this.app.view.width / 2) - (this.playerExplosion.width / 2), y: this.player.y - 15, onComplete: function() {
      that.playerExplosion.gotoAndPlay(0);
    }});
    tl.to(this.player, { tint: 0xFF9600, duration: 0.2 });
    tl.to(this.player, { tint: 0xFFFFFF, duration: 0.2 });
    gsap.to(this.player, this.shakeUpDownAnimation(this.player.y));

    this.sound.playSound('soundLose');
    //this.sound.playSound('soundAlienAttack');
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
    }else{
      this.paused = true;
      this.battleScene.stop();
    }
  }

  /**
   *
   */
  destroy() {
    this.backgroundHolder.destroy();
  }
}
