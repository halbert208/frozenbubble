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

function BubbleSprite (area, color, moveX, moveY, realX, realY, fixed, blink,
                       released, checkJump, checkFall, fixedAnim, bubbleFace,
                       bubbleBlindFace, frozenFace, bubbleFixed, bubbleBlink,
                       bubbleManager, soundManager, frozen) {
  if (arguments.length === 9) {
    this.blink = false;
    var bubbleFace = moveX, bubbleBlindFace = moveY, 
        frozenFace = realX, bubbleBlink = realY,
        bubbleManager = fixed, soundManager = blink,
        frozen = released;
    Sprite.call(this, area);

    this.color = color;
    this.bubbleFace = bubbleFace;
    this.bubbleBlindFace = bubbleBlindFace;
    this.frozenFace = frozenFace;
    this.bubbleBlink = bubbleBlink;
    this.bubbleManager = bubbleManager;
    this.soundManager = soundManager;
    this.frozen = frozen;

    this.realX = area.left;
    this.realY = area.top;

    this.fixed = true;
    this.fixedAnim = -1;
    bubbleManager.addBubble(bubbleFace);
  } else {
    if (arguments.length !== 20) throw TypeError("参数数量错误");
    Sprite.call(this, area);
    this.color = color;
    this.moveX = moveX;
    this.moveY = moveY;
    this.realX = realX;
    this.realY = realY;
    this.fixed = fixed;
    this.blink = blink;
    this.released = released;
    this.checkJump = checkJump;
    this.checkFall = checkFall;
    this.fixedAnim = fixedAnim;
    this.bubbleFace = bubbleFace;
    this.bubbleBlindFace = bubbleBlindFace;
    this.frozenFace = frozenFace;
    this.bubbleFixed = bubbleFixed;
    this.bubbleBlink = bubbleBlink;
    this.bubbleManager = bubbleManager;
    this.soundManager = soundManager;
    this.frozen = frozen;
  }
}

BubbleSprite.FALL_SPEED = 1;
BubbleSprite.MAX_BUBBLE_SPEED = 8;
BubbleSprite.MINIMUM_DISTANCE = 841;

BubbleSprite.prototype = new Sprite(null);
BubbleSprite.prototype.constructor = BubbleSprite;

BubbleSprite.prototype.paint = function paint(c, scale, dx, dy) {
  var blink = this.blink, bubbleFace = this.bubbleFace,
      frozenFace = this.frozenFace, bubbleBlink = this.bubbleBlink,
      bubbleBlindFace = this.bubbleBlindFace, fixedAnim = this.fixedAnim,
      bubbleFixed = this.bubbleFixed;
  this.checkJump = false;
  this.checkFall = false;

  var p = this.getSpritePosition();

  if (blink && bubbleFace != frozenFace) {
    this.blink = false;
    Sprite.drawImage(bubbleBlink, p.x, p.y, c, scale, dx, dy);
  } else {
    if (FrozenBubble.getMode() == FrozenBubble.GAME_NORMAL ||
        bubbleFace == frozenFace) {
      Sprite.drawImage(bubbleFace, p.x, p.y, c, scale, dx, dy);
    } else {
      Sprite.drawImage(bubbleBlindFace, p.x, p.y, c, scale, dx, dy);
    }
  }

  if (fixedAnim != -1) {
    Sprite.drawImage(bubbleFixed[fixedAnim], p.x, p.y, c, scale, dx, dy);
    this.fixedAnim++;
    if (this.fixedAnim == 6) {
      this.fixedAnim = -1;
    }
  }
};
