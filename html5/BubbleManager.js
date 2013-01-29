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

function BubbleManager(bubbles) {
  this.bubbles = bubbles;
  this.bubbleCount = new Array(bubbles.length);
  this.bubblesLeft = 0;
}

BubbleManager.prototype.addBubble = function addBubble(bubble) {
  var countBubbles = this.bubbleCount;
  countBubbles[this.findBubble(bubble)]++;
  this.bubblesLeft++;  
};

BubbleManager.prototype.removeBubble = function removeBubble(bubble) {
  var countBubbles = this.bubbleCount;
  countBubbles[this.findBubble(bubble)]--;
  this.bubblesLeft--;  
};

BubbleManager.prototype.countBubbles = function countBubbles() {
  var bubbleLeft = this.bubbleLeft;
  return bubbleLeft;
};

BubbleManager.prototype.nextBubbleIndex = function nextBubbleIndex(rand) {
  var bubbles = this.bubbles, countBubbles = this.bubbleCount;
  var select = rand.nextInt() % bubbles.length;

  if (select < 0)
    select = -select;

  var count = -1;
  var position = -1;

  while (count !== select) {
    position++;

    if (position === bubbles.length)
      position = 0;

    if (countBubbles[position] != 0)
      count++;
  }

  return position;  
};

BubbleManager.prototype.nextBubble = function nextBubble(rand) {
  var bubbles = this.bubbles;
  return bubbles[this.nextBubbleIndex(rand)];
};

BubbleManager.prototype.findBubble = function nextBubble(bubble) {
  var bubbles = this.bubbles;
  for (var i = 0; i < bubbles.length; i++)
      if (bubbles[i] == bubble)
        return i;

  return -1;
};
