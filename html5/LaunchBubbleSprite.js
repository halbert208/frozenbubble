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

function LaunchBubbleSprite(initialColor, initialDirection, launcher,
                            bubbles, colorblindBubbles) {
  Sprite.call(this, new Rect(276, 362, 276 + 86, 362 + 76));

  this.currentColor = initialColor;
  this.currentDirection = initialDirection;
  this.launcher = launcher;
  this.bubbles = bubbles;
  this.colorblindBubbles = colorblindBubbles;
}

LaunchBubbleSprite.prototype = new Sprite(null);
LaunchBubbleSprite.prototype.constructor = LaunchBubbleSprite;

LaunchBubbleSprite.prototype.changeColor = function changeColor(newColor) {
  this.currentColor = newColor;
};

LaunchBubbleSprite.prototype.changeDirection = function changeDirection(newDirection) {
  this.currentDirection = newDirection;
};

LaunchBubbleSprite.prototype.paint = function paint(c, scale, dx, dy) {
  var bubbles = this.bubbles, currentColor = this.currentColor,
     colorblindBubbles = this.colorblindBubbles,
     currentDirection = this.currentDirection, launcher = this.launcher;
  if (FrozenBubble.getMode() == FrozenBubble.GAME_NORMAL) {
    Sprite.drawImage(bubbles[currentColor], 302, 390, 
                     c, scale, dx, dy);
  } else {
    Sprite.drawImage(colorblindBubbles[currentColor], 302, 390, 
                     c, scale, dx, dy);
  }

  // Draw the scaled and rotated launcher.
  c.save();
  var xCenter = 318;
  var yCenter = 406;
  // c.rotate((0.025 * 180 * (currentDirection - 20)),
  //         (xCenter * scale + dx), (yCenter * scale + dy));
  launcher.setBounds(((xCenter - 50) * scale + dx),
                     ((yCenter - 50) * scale + dy),
                     ((xCenter + 50) * scale + dx),
                     ((yCenter + 50) * scale + dy));
  launcher.draw(c);
  c.restore();
};
