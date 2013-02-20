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

function BubbleSprite(area, color, moveX, moveY, realX, realY, fixed, blink,
                      released, checkJump, checkFall, fixedAnim, bubbleFace,
                      bubbleBlindFace, frozenFace, bubbleFixed, bubbleBlink,
                      bubbleManager, soundManager, frozen) {
  if (arguments.length === 20) {
    Sprite.call(this, area);
    this.color = color;
    this.moveX = moveX;
    this.moveY = moveY;
    this.realX = realX;
    this.realY = realY;
    this.isFixed = fixed;
    this.toBlink = blink;
    this.isReleased = released;
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
  } else if (arguments.length === 11) {
    var direction = color, color = moveX, bubbleFace = moveY, 
        bubbleBlindFace = realX, frozenFace = realY, bubbleFixed = fixed,
        bubbleBlink = blink, bubbleManager = released, soundManager = checkJump,
        frozen = checkFall, MAX_BUBBLE_SPEED = BubbleSprite.MAX_BUBBLE_SPEED;
    this.toBlink = false;
    this.isReleased = false;
    this.alreadyCheckJump = false;
    this.alreadyCheckFall = false;

    Sprite.call(this, area);

    this.color = color;
    this.bubbleFace = bubbleFace;
    this.bubbleBlindFace = bubbleBlindFace;
    this.frozenFace = frozenFace;
    this.bubbleFixed = bubbleFixed;
    this.bubbleBlink = bubbleBlink;
    this.bubbleManager = bubbleManager;
    this.soundManager = soundManager;
    this.frozen = frozen;

    this.moveX = MAX_BUBBLE_SPEED * -Math.cos(direction * Math.PI / 40.);
    this.moveY = MAX_BUBBLE_SPEED * -Math.sin(direction * Math.PI / 40.);
    this.realX = area.left;
    this.realY = area.top;

    this.isFixed = false;
    this.fixedAnim = -1;    
  } else {
    if (arguments.length !== 9) throw new TypeError("参数数量错误");
    var bubbleFace = moveX, bubbleBlindFace = moveY, 
        frozenFace = realX, bubbleBlink = realY,
        bubbleManager = fixed, soundManager = blink,
        frozen = released;
    this.toBlink = false;
    this.isReleased = false;
    this.alreadyCheckJump = false;
    this.alreadyCheckFall = false;

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

    this.isFixed = true;
    this.fixedAnim = -1;
    bubbleManager.addBubble(bubbleFace);
  }
}

BubbleSprite.FALL_SPEED = 1;
BubbleSprite.MAX_BUBBLE_SPEED = 8;
BubbleSprite.MINIMUM_DISTANCE = 841;

BubbleSprite.prototype = new Sprite(null);
BubbleSprite.prototype.constructor = BubbleSprite;

BubbleSprite.prototype.currentPosition = function currentPosition() { 
  var realY = this.realY, frozen = this.frozen, realX = this.realX;
  var posY = Math.floor((realY - 28 - frozen.getMoveDown()) / 28);
  var posX = Math.floor((realX - 174) / 32 + 0.5 * (posY % 2));

    if (posX>7) {
      posX = 7;
    }

    if (posX<0) {
      posX = 0;
    }

    if (posY<0) {
      posY = 0;
    }

    return new Point(posX, posY);
  
};

BubbleSprite.prototype.removeFromManager = function removeFromManager() {
  var bubbleManager = this.bubbleManager, bubbleFace = this.bubbleFace;
  bubbleManager.removeBubble(bubbleFace);
};

BubbleSprite.prototype.fixed = function fixed() {
  var fixed = this.isFixed;
  return fixed;
};

BubbleSprite.prototype.checked = function checked() {
  var checkFall = this.alreadyCheckFall;
  return checkFall;
};

BubbleSprite.prototype.released = function released() {
  var released = this.isReleased;
  return released;
};

BubbleSprite.prototype.moveDown = function moveDown() {
  var fixed = this.isFixed;
  if (fixed) {
    this.realY += 28;
  }

  this.absoluteMove(new Point(this.realX, this.realY));
};

BubbleSprite.prototype.move = function move() {
  var moveX = this.moveX, soundManager = this.soundManager,
      moveY = this.moveY, frozen = this.frozen,
      bubbleManager = this.bubbleManager, bubbleFace = this.bubbleFace;
  var realX = this.realX += moveX * GameThread.mTick / GameThread.FRAME_DELAY;

  if (realX >= 414) {
    this.moveX = -moveX;
    realX = this.realX += (414 - realX);
    soundManager.playSound(FrozenBubble.SOUND_REBOUND);
  } else if (realX <= 190) {
    this.moveX = -moveX;
    realX = this.realX += (190 - realX);
    soundManager.playSound(FrozenBubble.SOUND_REBOUND);
  }

  var realY = this.realY += moveY * GameThread.mTick / GameThread.FRAME_DELAY;

  var currentPosition = this.currentPosition();
  var neighbors = this.getNeighbors(currentPosition);

  if (this.checkCollision(neighbors) || realY < 44 + frozen.getMoveDown()) {
    realX = this.realX = 
      190 + currentPosition.x * 32 - (currentPosition.y % 2) * 16;
    realY = this.realY = 
      44 + currentPosition.y * 28 + frozen.getMoveDown();
    
    this.isFixed = true;

    var checkJump = new Vector();
    this.checkJump(checkJump, neighbors);

    var grid = frozen.getGrid();

    if (checkJump.size() >= 3) {
      this.isReleased = true;

      for (var i = 0; i < checkJump.size(); i++) {
        var current = checkJump.elementAt(i);
        var currentPoint = current.currentPosition();

        frozen.addJumpingBubble(current);
        if (i > 0) {
          current.removeFromManager();
        }
        grid[currentPoint.x][currentPoint.y] = null;
      }

      for (var i = 0; i < 8; i++) {
        if (grid[i][0] !== null) {
          grid[i][0].checkFall();
        }
      }

      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 12; j++) {
          if (grid[i][j] !== null) {
            if (!grid[i][j].checked()) {
              frozen.addFallingBubble(grid[i][j]);
              grid[i][j].removeFromManager();
              grid[i][j] = null;
            }
          }
        }
      }

      soundManager.playSound(FrozenBubble.SOUND_DESTROY);
    } else {
      bubbleManager.addBubble(bubbleFace);
      grid[currentPosition.x][currentPosition.y] = this;
      this.moveX = 0;
      this.moveY = 0;
      this.fixedAnim = 0;
      this.lastFixedAnim = GameThread.mLastTime;
      soundManager.playSound(FrozenBubble.SOUND_STICK);
    }
  }

  this.absoluteMove(new Point(realX, realY));
};

BubbleSprite.prototype.getNeighbors = function getNeighbors(p) {
  var frozen = this.frozen;
  var grid = frozen.getGrid();

  var list = new Vector();

  if ((p.y % 2) === 0) {
    if (p.x > 0) {
      list.addElement(grid[p.x - 1][p.y]);
    }

    if (p.x < 7) {
      list.addElement(grid[p.x + 1][p.y]);

      if (p.y > 0) {
        list.addElement(grid[p.x][p.y - 1]);
        list.addElement(grid[p.x+1][p.y - 1]);
      }

      if (p.y < 12) {
        list.addElement(grid[p.x][p.y + 1]);
        list.addElement(grid[p.x + 1][p.y + 1]);
      }
    } else {
      if (p.y > 0) {
        list.addElement(grid[p.x][p.y - 1]);
      }

      if (p.y < 12) {
        list.addElement(grid[p.x][p.y + 1]);
      }
    }
  } else {
    if (p.x < 7) {
      list.addElement(grid[p.x + 1][p.y]);
    }

    if (p.x > 0) {
      list.addElement(grid[p.x - 1][p.y]);

      if (p.y > 0) {
        list.addElement(grid[p.x][p.y - 1]);
        list.addElement(grid[p.x - 1][p.y - 1]);
      }

      if (p.y < 12) {
        list.addElement(grid[p.x][p.y + 1]);
        list.addElement(grid[p.x - 1][p.y + 1]);
      }
    } else {
      if (p.y > 0) {
        list.addElement(grid[p.x][p.y - 1]);
      }

      if (p.y < 12) {
        list.addElement(grid[p.x][p.y + 1]);
      }
    }
  }

  return list;
};

BubbleSprite.prototype.checkJump = function checkJump(jump, 
                                                      compare_or_neighbors) {
  if (compare_or_neighbors instanceof BmpWrap) {
    var checkJump = this.alreadyCheckJump;
    if (checkJump)
      return;
    
    this.alreadyCheckJump = true;

    if (this.bubbleFace === compare_or_neighbors)
      this.checkJump(jump, this.getNeighbors(this.currentPosition()));
  } else {
    if (!(compare_or_neighbors instanceof Vector)) 
      throw new TypeError("参数形态错误。compare_or_neighbors: " +
                          compare_or_neighbors);
    
    jump.addElement(this);

    for (var i = 0; i < compare_or_neighbors.size(); i++) {
      var current = compare_or_neighbors.elementAt(i);

      if (current !== null)
        current.checkJump(jump, this.bubbleFace);
    }    
  }
};

BubbleSprite.prototype.checkFall = function checkFall() {
  var checkFall = this.alreadyCheckFall;
  if (checkFall)
    return;
  
  this.alreadyCheckFall = true;

  var v = this.getNeighbors(this.currentPosition());

  for (var i = 0; i < v.size(); i++) {
    var current = v.elementAt(i);

    if (current !== null)
      current.checkFall();
  
  }
};

BubbleSprite.prototype.checkCollision = function checkCollision(neighbors_or_sprite) {
  if (neighbors_or_sprite instanceof Vector) {
    for (var i = 0; i < neighbors_or_sprite.size(); i++) {
      var current = neighbors_or_sprite.elementAt(i);

      if (current !== null)
        if (this.checkCollision(current)) 
          return true;
    }

    return false;
  } else {
    if (!(neighbors_or_sprite instanceof BubbleSprite))
      throw new TypeError("参数形态错误。neighbors_or_sprite: " +
                          neighbors_or_sprite);
    var MINIMUM_DISTANCE = BubbleSprite.MINIMUM_DISTANCE;
    var value = (neighbors_or_sprite.getSpriteArea().left - this.realX) *
                (neighbors_or_sprite.getSpriteArea().left - this.realX) +
                (neighbors_or_sprite.getSpriteArea().top - this.realY) *
                (neighbors_or_sprite.getSpriteArea().top - this.realY);

    return (value < MINIMUM_DISTANCE);    
  }
};

BubbleSprite.prototype.jump = function jump() {
  var fixed = this.isFixed, frozen = this.frozen,
      FALL_SPEED = BubbleSprite.FALL_SPEED;
  if (fixed) {
    this.moveX = -6 + frozen.getRandom().nextDouble() * 12;
    this.moveY = -5 - frozen.getRandom().nextDouble() * 10 ;
    
    this.isFixed = false;
  }

  this.moveY += FALL_SPEED * GameThread.mTick / GameThread.FRAME_DELAY;
  this.realY += this.moveY * GameThread.mTick / GameThread.FRAME_DELAY;
  this.realX += this.moveX * GameThread.mTick / GameThread.FRAME_DELAY;

  this.absoluteMove(new Point(this.realX, this.realY));

  if (this.realY >= 680)
    frozen.deleteJumpingBubble(this);
};

BubbleSprite.prototype.fall = function fall() {
  var fixed = this.isFixed, frozen = this.frozen,
      FALL_SPEED = BubbleSprite.FALL_SPEED, moveY = this.moveY;
  if (fixed)
    this.moveY = frozen.getRandom().nextDouble() * 5;

  this.isFixed = false;

  this.moveY += FALL_SPEED * GameThread.mTick / GameThread.FRAME_DELAY;
  this.realY += this.moveY * GameThread.mTick / GameThread.FRAME_DELAY;

  this.absoluteMove(new Point(this.realX, this.realY));

  if (this.realY >= 680)
    frozen.deleteFallingBubble(this);
};

BubbleSprite.prototype.blink = function blink() {
  this.toBlink = true;
};

BubbleSprite.prototype.frozenify = function frozenify() {
  var frozenFace = this.frozenFace;
  this.changeSpriteArea(new Rect(this.getSpritePosition().x - 1, 
                                 this.getSpritePosition().y - 1,
                                 34, 42));
  this.bubbleFace = frozenFace;
};

BubbleSprite.prototype.paint = function paint(c, scale, dx, dy) {
  var blink = this.toBlink, bubbleFace = this.bubbleFace,
      frozenFace = this.frozenFace, bubbleBlink = this.bubbleBlink,
      bubbleBlindFace = this.bubbleBlindFace, fixedAnim = this.fixedAnim,
      bubbleFixed = this.bubbleFixed;
  this.alreadyCheckJump = false;
  this.alreadyCheckFall = false;

  var p = this.getSpritePosition();

  if (blink && bubbleFace != frozenFace) {
    this.toBlink = false;
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
    
    if (GameThread.mLastTime - this.lastFixedAnim > GameThread.FRAME_DELAY) {
      this.lastFixedAnim = GameThread.mLastTime;
      this.fixedAnim++;
    }
    if (this.fixedAnim == 6) {
      this.fixedAnim = -1;
    }
  }
};
