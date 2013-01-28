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
  GameScreen.call(this)
  this.levelCompleted = false;

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
  for (var i = 0; i < 8; i++)
    this.bubblePlay[i] = new Array(12);

  var bubbleManager = this.bubbleManager = new BubbleManager(bubbles);
  var currentLevel = this.currentLevel = levelManager.getCurrentLevel();

  if (currentLevel == null) {
    //Log.i("frozen-bubble", "Level not available.");
    return;
  }

  for (var j = 0; j < 12; j++) {
    for (var i = j % 2; i < 8 ; i++) {
      if (currentLevel[i][j] != -1) {
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

    if (FrozenBubble.getMode() == FrozenBubble.GAME_NORMAL) {
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

FrozenGame.prototype.paint = function paint(c, scale, dx, dy) {
  var compressor = this.compressor, nextBubble = this.nextBubble,
      bubbles = this.bubbles, bubblesBlind = this.bubblesBlind,
      nextColor = this.nextColor;
  compressor.paint(c, scale, dx, dy);
  if (FrozenBubble.getMode() == FrozenBubble.GAME_NORMAL) {
    nextBubble.changeImage(bubbles[nextColor]);
  } else {
    nextBubble.changeImage(bubblesBlind[nextColor]);
  }
  GameScreen.prototype.paint.call(this, c, scale, dx, dy);
}
