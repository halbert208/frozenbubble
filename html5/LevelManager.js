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

function LevelManager(levels, startingLevel) {
  var allLevels = new String(levels);

  this.currentLevel = startingLevel;
  var levelList = this.levelList = new Vector();

  var nextLevel = allLevels.indexOf("\n\n");
  if (nextLevel === -1 && allLevels.trim().length !== 0) {
    nextLevel = allLevels.length;
  }

  while (nextLevel !== -1) {
    var currentLevel = allLevels.substring(0, nextLevel).trim();

    levelList.addElement(this.getLevel(currentLevel));

    allLevels = allLevels.substring(nextLevel).trim();

    if (allLevels.length === 0) {
      nextLevel = -1;
    } else {
      nextLevel = allLevels.indexOf("\n\n");

      if (nextLevel === -1) {
        nextLevel = allLevels.length;
      }
    }
  }

  if (currentLevel >= levelList.size()) {
    this.currentLevel = 0;
  }
}

LevelManager.prototype.getLevel = function getLevel(data) {
  var temp = new Array(8);
  for (var i = 0; i < 8; i++)
    temp[i] = new Array(12);

  for (var j = 0; j < 12; j++)
    for (var i=0; i < 8; i++)
      temp[i][j] = -1;

  var tempX = 0;
  var tempY = 0;

  for (var i = 0; i < data.length; i++) {
    if (data.charCodeAt(i) >= 48 && data.charCodeAt(i) <= 55) {
      temp[tempX][tempY] = (data.charCodeAt(i) - 48);
      tempX++;
    }
    else if (data.charCodeAt(i) == 45) {
      temp[tempX][tempY] = -1;
      tempX++;
    }

    if (tempX == 8) {
      tempY++;

      if (tempY == 12) 
          return temp;
      

      tempX = tempY % 2;
    }
  }

  return temp;  
};

LevelManager.prototype.getCurrentLevel = function getCurrentLevel() {
  var currentLevel = this.currentLevel, levelList = this.levelList;
  if (currentLevel < levelList.size()) 
    return levelList.elementAt(currentLevel);

  return null;
}

LevelManager.prototype.goToNextLevel = function goToNextLevel() {
  this.currentLevel++;
  if (this.currentLevel >= this.levelList.size())
    this.currentLevel = 0;
};

LevelManager.prototype.goToFirstLevel = function goToFirstLevel() {
  this.currentLevel = 0;
};

LevelManager.prototype.getLevelIndex = function getLevelIndex() {
  var currentLevel = this.currentLevel;
  return currentLevel;
}
