/*
 *                 [[ Frozen-Bubble ]]
 *
 * Copyright (c) 2000-2003 Guillaume Cottenceau.
 * Java sourcecode - Copyright (c) 2003 Glenn Sanson.
 *
 * This code is distributed under the GNU General Public License
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2, as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 *
 * Artwork:
 *    Alexis Younes <73lab at free.fr>
 *      (everything but the bubbles)
 *    Amaury Amblard-Ladurantie <amaury at linuxfr.org>
 *      (the bubbles)
 *
 * Soundtrack:
 *    Matthias Le Bidan <matthias.le_bidan at caramail.com>
 *      (the three musics and all the sound effects)
 *
 * Design & Programming:
 *    Guillaume Cottenceau <guillaume.cottenceau at free.fr>
 *      (design and manage the project, whole Perl sourcecode)
 *
 * Java version:
 *    Glenn Sanson <glenn.sanson at free.fr>
 *      (whole Java sourcecode, including JIGA classes
 *             http://glenn.sanson.free.fr/jiga/)
 *
 * Android port:
 *    Pawel Aleksander Fedorynski <pfedor@fuw.edu.pl>
 *    Copyright (c) Google Inc.
 *
 *          [[ http://glenn.sanson.free.fr/fb/ ]]
 *          [[ http://www.frozen-bubble.org/   ]]
 */

function FrozenGame(background_arg, bubbles_arg, bubblesBlind_arg, 
                    frozenBubbles_arg, targetedBubbles_arg, bubbleBlink_arg,
                    gameWon_arg, gameLost_arg, hurry_arg, penguins_arg,
                    compressorHead_arg, compressor_arg, launcher_arg,
                    soundManager_arg, levelManager_arg) {
  this.modeKeyPressed = this.soundKeyPressed = false;
  this.levelCompleted = false;
  this.movingBubble = null;
  this.fixedBubbles = 0;
  this.moveDown = 0;
  this.blinkDelay = 0;
  this.lastBlinkDelay = GameThread.mLastTime;
  this.readyToFire = false;
  this.endOfGame = false;
  this.callFrozenify = false;
  this.frozenifyX = this.frozenifY = 0;

  GameScreen.call(this)

  var random = this.random = new Random(System.currentTimeMillis());
  var launcher = this.launcher = launcher_arg;
  this.penguins = penguins_arg;
  this.background = background_arg;
  var bubbles = this.bubbles = bubbles_arg;
  var bubblesBlind = this.bubblesBlind = bubblesBlind_arg;
  var frozenBubbles = this.frozenBubbles = frozenBubbles_arg;
  this.targetedBubbles = targetedBubbles_arg;
  var bubbleBlink = this.bubbleBlink = bubbleBlink_arg;
  this.gameWon = gameWon_arg;
  this.gameLost = gameLost_arg;
  var soundManager = this.soundManager = soundManager_arg;
  var levelManager = this.levelManager = levelManager_arg;

  var launchBubblePosition = this.launchBubblePosition = 20;

  var penguin = this.penguin = new PenguinSprite(penguins_arg, random);
  this.addSprite(penguin);
  this.compressor = new Compressor(compressorHead_arg, compressor_arg);

  this.hurrySprite = new ImageSprite(new Rect(203, 265, 203 + 240, 265 + 90),
                                     hurry_arg);

  this.jumping = new Vector();
  this.falling = new Vector();

  var bubblePlay = this.bubblePlay = new Array(8);
  for (var i = 0; i < 8; i++) {
    bubblePlay[i] = [];
    for (var j = 0; j < 13; j++)
      bubblePlay[i].push(null);
  }

  var bubbleManager = this.bubbleManager = new BubbleManager(bubbles);
  var currentLevel = this.currentLevel = levelManager.getCurrentLevel();

  if (currentLevel === null) {
    //Log.i("frozen-bubble", "Level not available.");
    return;
  }

  for (var j = 0; j < 12; j++) {
    for (var i = j % 2; i < 8 ; i++) {
      if (currentLevel[i][j] !== -1) {
        var newOne = new BubbleSprite(new Rect(190 + i * 32 - (j % 2) * 16,
                                               44 + j * 28, 32, 32),
                                      currentLevel[i][j],
                                      bubbles[currentLevel[i][j]], 
                                      bubblesBlind[currentLevel[i][j]],
                                      frozenBubbles[currentLevel[i][j]], 
                                      bubbleBlink, bubbleManager,
                                      soundManager, this);
          bubblePlay[i][j] = newOne;
          this.addSprite(newOne);
        }
      }
    }

    var currentColor = this.currentColor = 
      bubbleManager.nextBubbleIndex(random);
    var nextColor = this.nextColor = 
      bubbleManager.nextBubbleIndex(random);

    if (FrozenBubble.getMode() === FrozenBubble.GAME_NORMAL) {
      var nextBubble = this.nextBubble = 
        new ImageSprite(new Rect(302, 440, 302 + 32, 440 + 32),
                        bubbles[nextColor]);
    } else {
      var nextBubble = this.nextBubble =
        new ImageSprite(new Rect(302, 440, 302 + 32, 440 + 32),
                        bubblesBlind[nextColor]);
    }
    this.addSprite(nextBubble);

    var launchBubble = this.launchBubble = 
      new LaunchBubbleSprite(currentColor, launchBubblePosition,
                             launcher, bubbles, bubblesBlind);

    this.spriteToBack(launchBubble);

    this.nbBubbles = 0;
}

FrozenGame.prototype = new GameScreen(null);
FrozenGame.prototype.constructor = FrozenGame;

FrozenGame.HORIZONTAL_MOVE = 0;
FrozenGame.FIRE = 1;

FrozenGame.KEY_UP = 38;
FrozenGame.KEY_LEFT = 37;
FrozenGame.KEY_RIGHT = 39;
FrozenGame.KEY_SHIFT = 16;

FrozenGame.PARAMETER_PLAYER = "player";
FrozenGame. PARAMETER_OFFLINE = "offline";

// Change mode (normal/colorblind)
FrozenGame.KEY_M = 77;
// Toggle sound on/off
FrozenGame.KEY_S = 83;

FrozenGame.prototype.initFrozenify = function initFrozenify() {
  var frozenBubbles = this.frozenBubbles, currentColor = this.currentColor,
      nextColor = this.nextColor, freezeLaunchBubble = this.freezeLaunchBubble,
      freezeNextBubble = this.freezeNextBubble;
  var freezeLaunchBubble = new ImageSprite(new Rect(301, 389, 34, 42),
                                           frozenBubbles[currentColor]);
  var freezeNextBubble = new ImageSprite(new Rect(301, 439, 34, 42), 
                                         frozenBubbles[nextColor]);

  this.addSprite(freezeLaunchBubble);
  this.addSprite(freezeNextBubble);

  this.frozenifyX = 7;
  this.frozenifyY = 12;

  this.callFrozenify = true;

  this.lastFrozenify = GameThread.mLastTime;
};

FrozenGame.prototype.frozenify = function frozenify() {
  var gameLost = this.gameLost, soundManager = this.soundManager,
      bubblePlay = this.bubblePlay, launchBubble = this.launchBubble;

  if (GameThread.mLastTime - this.lastFrozenify < GameThread.FRAME_DELAY) return;
  this.lastFrozenify = GameThread.mLastTime;
  
  this.frozenifyX--;
  if (this.frozenifyX < 0) {
    this.frozenifyX = 7;
    this.frozenifyY--;

    if (this.frozenifyY < 0) {
      this.callFrozenify = false;
      this.addSprite(new ImageSprite(new Rect(152, 190, 337, 116), gameLost));
      soundManager.playSound(FrozenBubble.SOUND_NOH);

        return;
      }
    }

  while (bubblePlay[this.frozenifyX][this.frozenifyY] === null && 
         this.frozenifyY >=0) {
    this.frozenifyX--;
    if (this.frozenifyX < 0) {
      this.frozenifyX = 7;
      this.frozenifyY--;

      if (this.frozenifyY < 0) {
        this.callFrozenify = false;
        this.addSprite(new ImageSprite(new Rect(152, 190, 337, 116),
                                       gameLost));
        soundManager.playSound(FrozenBubble.SOUND_NOH);

        return;
      }
    }
  }

  this.spriteToBack(bubblePlay[this.frozenifyX][this.frozenifyY]);
  bubblePlay[this.frozenifyX][this.frozenifyY].frozenify();

  this.spriteToBack(launchBubble);
};

FrozenGame.prototype.getGrid = function getGrid() {
  var bubblePlay = this.bubblePlay;
  return bubblePlay;
}; 

FrozenGame.prototype.addFallingBubble = function addFallingBubble(sprite) {
  var falling = this.falling;
  this.spriteToFront(sprite);
  falling.addElement(sprite);
}; 

FrozenGame.prototype.deleteFallingBubble = function deleteFallingBubble(sprite) {
  var falling = this.falling;
  this.removeSprite(sprite);
  falling.removeElement(sprite);
}; 

FrozenGame.prototype.addJumpingBubble = function addJumpingBubble(sprite) {
  var jumping = this.jumping;
  this.spriteToFront(sprite);
  jumping.addElement(sprite);
}; 

FrozenGame.prototype.deleteJumpingBubble = function deleteJumpingBubble(sprite) {
  var jumping = this.jumping;
  this.removeSprite(sprite);
  jumping.removeElement(sprite);
};

FrozenGame.prototype.getRandom = function getRandom() {
  var random = this.random;
  return random;
};

FrozenGame.prototype.getMoveDown = function getMoveDown() {
  var moveDown = this.moveDown;
  return moveDown;
};

// 看起来像是死代码
FrozenGame.prototype.nextColor = function nextColor() {
  var nextColor = random.nextInt() % 8;

  if (nextColor < 0)
    return -nextColor;

  return nextColor;
};

FrozenGame.prototype.sendBubblesDown = function sendBubblesDown() {
  var soundManager = this.soundManager, bubblePlay = this.bubblePlay,
      penguin = this.penguin, compressor = this.compressor;
  soundManager.playSound(FrozenBubble.SOUND_NEWROOT);

  for (var i = 0;i < 8; i++) {
    for (var j = 0; j < 12; j++) {
      if (bubblePlay[i][j] !== null) {
        bubblePlay[i][j].moveDown();

        if (bubblePlay[i][j].getSpritePosition().y >= 380) {
          penguin.updateState(PenguinSprite.STATE_GAME_LOST);
          this.endOfGame = true;
          this.initFrozenify();

          soundManager.playSound(FrozenBubble.SOUND_LOST);
        }
      }
    }
  }

  this.moveDown += 28.;
  compressor.moveDown();
};

FrozenGame.prototype.blinkLine = function blinkLine(number) {
  var bubblePlay = this.bubblePlay;
  var move = number % 2;
  var column = (number + 1) >> 1;

  for (var i = move; i < 13 ; i++)
    if (bubblePlay[column][i] !== null)
      bubblePlay[column][i].blink();
};

FrozenGame.prototype.play = function play(key_left, key_right, key_fire,
                                          trackball_dx, touch_fire,
                                          touch_x, touch_y,
                                          ats_touch_fire, ats_touch_dx) {
  var HORIZONTAL_MOVE = FrozenGame.HORIZONTAL_MOVE, FIRE = FrozenGame.FIRE,
      KEY_LEFT = FrozenGame.KEY_LEFT, KEY_RIGHT = FrozenGame.KEY_RIGHT,
      KEY_UP = FrozenGame.KEY_UP,
      endOfGame = this.endOfGame, levelCompleted = this.levelCompleted,
      levelManager = this.levelManager,
      penguin = this.penguin, frozenify = this.callFrozenify,
      movingBubble = this.movingBubble, currentColor = this.currentColor,
      random = this.random;
      bubbles = this.bubbles, bubblesBlind = this.bubblesBlind,
      frozenBubbles = this.frozenBubbles, 
      targetedBubbles = this.targetedBubbles,
      bubbleBlink = this.bubbleBlink, bubbleManager = this.bubbleManager,
      soundManager = this.soundManager, nextColor = this.nextColor,
      nextBubble = this.nextBubble, launchBubble = this.launchBubble,
      hurrySprite = this.hurrySprite, gameWon = this.gameWon,
      falling = this.falling, jumping = this.jumping;
  var ats = FrozenBubble.getAimThenShoot();
  if ((ats && ats_touch_fire) || (!ats && touch_fire)) {
    key_fire = true;
  }
  
  var move = new Array(2);

  if (key_left && !key_right) {
    move[HORIZONTAL_MOVE] = KEY_LEFT;
  } else if (key_right && !key_left) {
    move[HORIZONTAL_MOVE] = KEY_RIGHT;
  } else {
    move[HORIZONTAL_MOVE] = 0;
  }
  if (key_fire) {
    move[FIRE] = KEY_UP;
  } else {
    move[FIRE] = 0;
  }
  if (!ats && touch_fire && movingBubble === null) {
    var xx = touch_x - 318;
    var yy = 406 - touch_y;
    this.launchBubblePosition = (Math.PI - Math.atan2(yy, xx)) * 40.0 / Math.PI;
    if (this.launchBubblePosition < 1) {
      this.launchBubblePosition = 1;
    }
    if (this.launchBubblePosition > 39) {
      this.launchBubblePosition = 39;
    }
  }

  if (move[FIRE] === 0 || (!ats && touch_fire)) {
    var readyToFire = this.readyToFire = true;
  }

  if (FrozenBubble.getDontRushMe()) {
    this.hurryTime = 1;
  }

  if (endOfGame) {
    if (move[FIRE] === KEY_UP && readyToFire) {
      if (levelCompleted)
        levelManager.goToNextLevel();
      return true;
    } else {
      penguin.updateState(PenguinSprite.STATE_VOID);

      if (frozenify)
        this.frozenify();
       
    }
  } else {
    if (move[FIRE] === KEY_UP || this.hurryTime > 480) {
      if (movingBubble === null && readyToFire) {
        this.nbBubbles++;

        movingBubble = this.movingBubble = 
        new BubbleSprite(new Rect(302, 390, 32, 32),
                         this.launchBubblePosition,
                         currentColor,
                         bubbles[currentColor],
                         bubblesBlind[currentColor],
                         frozenBubbles[currentColor],
                         targetedBubbles, bubbleBlink,
                         bubbleManager, soundManager, this);
        this.addSprite(movingBubble);

        currentColor = this.currentColor = nextColor;
        nextColor = this.nextColor = bubbleManager.nextBubbleIndex(random);

        if (FrozenBubble.getMode() === FrozenBubble.GAME_NORMAL) {
          nextBubble.changeImage(bubbles[nextColor]);
        } else {
          nextBubble.changeImage(bubblesBlind[nextColor]);
        }
        launchBubble.changeColor(currentColor);
        penguin.updateState(PenguinSprite.STATE_FIRE);

        soundManager.playSound(FrozenBubble.SOUND_LAUNCH);

        this.readyToFire = false;
        this.hurryTime = 0;
        this.lastHurryTime = GameThread.mLastTime;
        this.removeSprite(hurrySprite);
      } else {
        penguin.updateState(PenguinSprite.STATE_VOID);
      }
    } else {
      var dx = 0;
      if (move[HORIZONTAL_MOVE] === KEY_LEFT) {
        dx -= 1;
      }
      if (move[HORIZONTAL_MOVE] === KEY_RIGHT) {
        dx += 1;
      }
      dx += trackball_dx;
      if (ats) {
        dx += ats_touch_dx;
      }
      this.launchBubblePosition += dx;
      if (this.launchBubblePosition < 1) {
          this.launchBubblePosition = 1;
      }
      if (this.launchBubblePosition > 39) {
        this.launchBubblePosition = 39;
      }
      launchBubble.changeDirection(this.launchBubblePosition);
      if (dx < 0) {
        penguin.updateState(PenguinSprite.STATE_TURN_LEFT);
      } else if (dx > 0) {
        penguin.updateState(PenguinSprite.STATE_TURN_RIGHT);
      } else {
        penguin.updateState(PenguinSprite.STATE_VOID);
      }
    }
  }

  if (movingBubble !== null) {
    movingBubble.move();
    if (movingBubble.fixed()) {
      if (movingBubble.getSpritePosition().y >= 380 &&
          !movingBubble.released()) {
        penguin.updateState(PenguinSprite.STATE_GAME_LOST);
        this.endOfGame = true;
        this.initFrozenify();

        soundManager.playSound(FrozenBubble.SOUND_LOST);
      } else if (bubbleManager.countBubbles() === 0) {
        penguin.updateState(PenguinSprite.STATE_GAME_WON);
        this.addSprite(new ImageSprite(new Rect(152, 190, 337, 116),
                                       gameWon));
        // TODO
        //highscoreManager.endLevel(nbBubbles);
        this.levelCompleted = true;
        this.endOfGame = true;

        soundManager.playSound(FrozenBubble.SOUND_WON);
      } else {
        this.fixedBubbles++;
        this.blinkDelay = 0;
        this.lastBlinkDelay = GameThread.mLastTime;

        if (this.fixedBubbles === 8) {
            this.fixedBubbles = 0;
            this.sendBubblesDown();
        }
      }
      var movingBubble = this.movingBubble = null;
    }

    if (movingBubble !== null) {
      movingBubble.move();
      if (movingBubble.fixed()) {
        if (movingBubble.getSpritePosition().y >= 380 &&
            !movingBubble.released()) {
          penguin.updateState(PenguinSprite.STATE_GAME_LOST);
          this.endOfGame = true;
          this.initFrozenify();

          soundManager.playSound(FrozenBubble.SOUND_LOST);
        } else if (bubbleManager.countBubbles() === 0) {
          penguin.updateState(PenguinSprite.STATE_GAME_WON);
          this.addSprite(new ImageSprite(new Rect(152, 190,
                                                  152 + 337, 190 + 116),
                                         gameWon));
          // TODO
          //highscoreManager.endLevel(nbBubbles);
          this.endOfGame = true;
          this.levelCompleted = true;
          soundManager.playSound(FrozenBubble.SOUND_WON);
        } else {
          this.fixedBubbles++;
          this.blinkDelay = 0;

          if (this.fixedBubbles === 8) {
              this.fixedBubbles = 0;
              this.sendBubblesDown();
          }
        }
        movingBubble = this.movingBubble = null;
      }
    }
  }

  if (movingBubble === null && !endOfGame && 
      GameThread.mLastTime - this.lastHurryTime > GameThread.FRAME_DELAY) {
    this.lastHurryTime = GameThread.mLastTime;
    this.hurryTime++;
    // If hurryTime == 2 (1 + 1) we could be in the "Don't rush me"
    // mode.  Remove the sprite just in case the user switched
    // to this mode when the "Hurry" sprite was shown, to make it
    // disappear.
    if (this.hurryTime === 2) {
      this.removeSprite(hurrySprite);
    }
    if (this.hurryTime >= 240) {
      if (this.hurryTime % 40 === 10) {
        this.addSprite(hurrySprite);
        soundManager.playSound(FrozenBubble.SOUND_HURRY);
      } else if (this.hurryTime % 40 === 35) {
        this.removeSprite(hurrySprite);
      }
    }
  }

  if (this.fixedBubbles === 6) {
    if (this.blinkDelay < 15) {
      this.blinkLine(this.blinkDelay);
    }

    if (GameThread.mLastTime - this.lastBlinkDelay > GameThread.FRAME_DELAY) {
      this.lastBlinkDelay = GameThread.mLastTime;
      this.blinkDelay++;
    }
    if (this.blinkDelay === 40) {
      this.blinkDelay = 0;
    }
  } else if (this.fixedBubbles === 7) {

    if (this.blinkDelay < 15) {
      this.blinkLine(this.blinkDelay);
    }

    if (GameThread.mLastTime - this.lastBlinkDelay > GameThread.FRAME_DELAY) {
      this.lastBlinkDelay = GameThread.mLastTime;
      this.blinkDelay++;
    }
    if (this.blinkDelay === 25) {
      this.blinkDelay = 0;
    }
  }

  for (var i = 0; i < falling.size(); i++) {
    (falling.elementAt(i)).fall();
  }

  for (var i = 0; i < jumping.size(); i++) {
    (jumping.elementAt(i)).jump();
  }

  return false;
}

FrozenGame.prototype.paint = function paint(c, scale, dx, dy) {
  var compressor = this.compressor, nextBubble = this.nextBubble,
      bubbles = this.bubbles, bubblesBlind = this.bubblesBlind,
      nextColor = this.nextColor;
  compressor.paint(c, scale, dx, dy);
  if (FrozenBubble.getMode() === FrozenBubble.GAME_NORMAL) {
    nextBubble.changeImage(bubbles[nextColor]);
  } else {
    nextBubble.changeImage(bubblesBlind[nextColor]);
  }
  GameScreen.prototype.paint.call(this, c, scale, dx, dy);
}
