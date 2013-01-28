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
// This file is derived from the LunarLander.java file which is part of
// the Lunar Lander game included with Android documentation.  The copyright
// notice for the Lunar Lander is reproduced below.
/*
 * Copyright (C) 2007 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function FrozenBubble() {
  
}

FrozenBubble.SOUND_WON = 1;
FrozenBubble.SOUND_LOST = 1;
FrozenBubble.SOUND_LAUNCH = 2;
FrozenBubble.SOUND_DESTROY = 3;
FrozenBubble.SOUND_REBOUND = 4;
FrozenBubble.SOUND_STICK = 5;
FrozenBubble.SOUND_HURRY = 6;
FrozenBubble.SOUND_NEWROOT = 7;
FrozenBubble.SOUND_NOH = 8;
FrozenBubble.NUM_SOUNDS = 9;

FrozenBubble.GAME_NORMAL = 0;
FrozenBubble.GAME_COLORBLIND = 1;

FrozenBubble.MENU_COLORBLIND_MODE_ON = 1;
FrozenBubble.MENU_COLORBLIND_MODE_OFF = 2;
FrozenBubble.MENU_FULLSCREEN_ON = 3;
FrozenBubble.MENU_FULLSCREEN_OFF = 4;
FrozenBubble.MENU_SOUND_ON = 5;
FrozenBubble.MENU_SOUND_OFF = 6;
FrozenBubble.MENU_DONT_RUSH_ME = 7;
FrozenBubble.MENU_RUSH_ME = 8;
FrozenBubble.MENU_NEW_GAME = 9;
FrozenBubble.MENU_ABOUT = 10;
FrozenBubble.MENU_EDITOR = 11;
FrozenBubble.MENU_TOUCHSCREEN_AIM_THEN_SHOOT = 12;
FrozenBubble.MENU_TOUCHSCREEN_POINT_TO_SHOOT = 13;

FrozenBubble.PREFS_NAME = "frozenbubble";

FrozenBubble.gameMode = FrozenBubble.GAME_NORMAL;

FrozenBubble.prototype = new Activity();

FrozenBubble.getMode = function getMode() {
  var gameMode = FrozenBubble.gameMode;
  return gameMode;
};
