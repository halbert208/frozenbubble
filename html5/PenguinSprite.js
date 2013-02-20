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

function PenguinSprite(sprites, rand) {
  var STATE_VOID = PenguinSprite.STATE_VOID;
  this.count = 0;
  Sprite.call(this, new Rect(361, 436, 361 + 55, 436 + 43));

  this.spritesImage = sprites;
  this.rand = rand;

  this.currentPenguin = 0;

  this.finalState = STATE_VOID;
  this.nextPosition = 0;  

  this.lastTime = 0;
}

PenguinSprite.prototype = new Sprite(null);
PenguinSprite.prototype.constructor = PenguinSprite;

PenguinSprite.STATE_TURN_LEFT = 0;
PenguinSprite.STATE_TURN_RIGHT = 1;
PenguinSprite.STATE_FIRE = 2;
PenguinSprite.STATE_VOID = 3;
PenguinSprite.STATE_GAME_WON = 4;
PenguinSprite.STATE_GAME_LOST = 5;

PenguinSprite.LOST_SEQUENCE =
  [[1,0], [2,8], [3,9], [4,10], [5,11], [6,12], [7,13], [5,14]];
PenguinSprite.WON_SEQUENCE =
  [[1,0], [2,7], [3,6], [4,15], [5,16], [6,17], [7,18], [4,19]];

PenguinSprite.prototype.updateState = function updateState(state) {
  var finalState = this.finalState, STATE_VOID = PenguinSprite.STATE_VOID,
      STATE_GAME_LOST = PenguinSprite.STATE_GAME_LOST,
      LOST_SEQUENCE = PenguinSprite.LOST_SEQUENCE,
      STATE_GAME_WON = PenguinSprite.STATE_GAME_WON,
      WON_SEQUENCE = PenguinSprite.WON_SEQUENCE,
      STATE_TURN_LEFT = PenguinSprite.STATE_TURN_LEFT,
      STATE_TURN_RIGHT = PenguinSprite.STATE_TURN_RIGHT,
      STATE_FIRE = PenguinSprite.STATE_FIRE;
  
  if (GameThread.mLastTime - this.lastTime < GameThread.FRAME_DELAY
      && (state === finalState || state === STATE_VOID)) return;
  this.lastTime = GameThread.mLastTime;

  if (finalState != STATE_VOID) {
    this.count++;

    if (this.count % 6 === 0) {
      if (finalState === STATE_GAME_LOST) {
        this.currentPenguin = LOST_SEQUENCE[this.nextPosition][1];
        this.nextPosition = LOST_SEQUENCE[this.nextPosition][0];
      } else if (finalState == STATE_GAME_WON) {
        this.currentPenguin = WON_SEQUENCE[this.nextPosition][1];
        this.nextPosition = WON_SEQUENCE[this.nextPosition][0];
      }
    }
  } else {
    this.count++;

    switch(state) {
    case STATE_TURN_LEFT :
      this.count = 0;
      this.currentPenguin = 3;
      break;
    case STATE_TURN_RIGHT :
      this.count = 0;
      this.currentPenguin = 2;
      break;
    case STATE_FIRE :
      this.count = 0;
      this.currentPenguin = 1;
      break;
    case STATE_VOID :
      if (this.currentPenguin < 4 || this.currentPenguin > 7) {
        this.currentPenguin = 0;
      }
      break;
    case STATE_GAME_WON :
    case STATE_GAME_LOST :
      this.count = 0;
      this.finalState = state;
      this.currentPenguin = 0;
      return;
    }

    if (this.count > 100) {
        this.currentPenguin = 7;
    } else if (this.count % 15 == 0 && this.count > 25) {
      this.currentPenguin = (this.rand.nextInt() % 3) + 4;
      if (this.currentPenguin < 4) {
          this.currentPenguin = 0;
      }
    }
  }
};

PenguinSprite.prototype.paint = function paint(c, scale, dx, dy) {
  var spritesImage = this.spritesImage, currentPenguin = this.currentPenguin
  var r = this.getSpriteArea();
  Sprite.drawImageClipped(spritesImage,
                          360 - (currentPenguin % 4) * 57,
                          435 - Math.floor(currentPenguin / 4) * 45,
                          r, c, scale, dx, dy);
};
