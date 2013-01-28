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
// This file is derived from the LunarView.java file which is part of
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

function GameView(context, attrs) {
  SurfaceView.call(this, context, attrs);
  //Log.i("frozen-bubble", "GameView constructor");

  this.mContext = context;
  var holder = this.getHolder();
  holder.addCallback(this);

  this.thread = new GameThread(this, holder, null, 0);
  this.setFocusable(true);
  this.setFocusableInTouchMode(true);

  // this.thread.setRunning(true);
  // this.thread.start();
}

GameView.prototype = new SurfaceView(null);

GameView.prototype.getThread = function getThread() {
  var thread = this.thread;
  return thread;
};

function GameThread(gameView, surfaceHolder, customLevels, startingLevel) {
  var mContext = gameView.mContext, STATE_PAUSE = GameThread.STATE_PAUSE;
  //Log.i("frozen-bubble", "GameThread()");
  this.mSurfaceHolder = surfaceHolder;
  var res = mContext.getResources();
  this.setState(STATE_PAUSE);

  var options = new BitmapFactory.Options();

  // The Options.inScaled field is only available starting at API 4.
  try {
    var f = options.getClass().getField("inScaled");
    f.set(options, Boolean.FALSE);
  } catch (ignore) { }

  this.mBackgroundOrig = BitmapFactory.decodeResource(res, 
                                                      R.drawable.background, 
                                                      options);
  var mBubblesOrig = this.mBubblesOrig = new Array(8);
  mBubblesOrig[0] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_1, options);
  mBubblesOrig[1] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_2, options);
  mBubblesOrig[2] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_3, options);
  mBubblesOrig[3] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_4, options);
  mBubblesOrig[4] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_5, options);
  mBubblesOrig[5] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_6, options);
  mBubblesOrig[6] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_7, options);
  mBubblesOrig[7] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_8, options);
  var mBubblesBlindOrig = this.mBubblesBlindOrig = new Array(8);
  mBubblesBlindOrig[0] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_colourblind_1, options);
  mBubblesBlindOrig[1] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_colourblind_2, options);
  mBubblesBlindOrig[2] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_colourblind_3, options);
  mBubblesBlindOrig[3] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_colourblind_4, options);
  mBubblesBlindOrig[4] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_colourblind_5, options);
  mBubblesBlindOrig[5] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_colourblind_6, options);
  mBubblesBlindOrig[6] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_colourblind_7, options);
  mBubblesBlindOrig[7] = 
    BitmapFactory.decodeResource(res, R.drawable.bubble_colourblind_8, options);
  var mFrozenBubblesOrig = this.mFrozenBubblesOrig = new Array(8);
  mFrozenBubblesOrig[0] = 
    BitmapFactory.decodeResource(res, R.drawable.frozen_1, options);
  mFrozenBubblesOrig[1] = 
    BitmapFactory.decodeResource(res, R.drawable.frozen_2, options);
  mFrozenBubblesOrig[2] = 
    BitmapFactory.decodeResource(res, R.drawable.frozen_3, options);
  mFrozenBubblesOrig[3] = 
    BitmapFactory.decodeResource(res, R.drawable.frozen_4, options);
  mFrozenBubblesOrig[4] = 
    BitmapFactory.decodeResource(res, R.drawable.frozen_5, options);
  mFrozenBubblesOrig[5] = 
    BitmapFactory.decodeResource(res, R.drawable.frozen_6, options);
  mFrozenBubblesOrig[6] = 
    BitmapFactory.decodeResource(res, R.drawable.frozen_7, options);
  mFrozenBubblesOrig[7] = 
    BitmapFactory.decodeResource(res, R.drawable.frozen_8, options);
  var mTargetedBubblesOrig = this.mTargetedBubblesOrig = new Array(6);
  mTargetedBubblesOrig[0] = 
    BitmapFactory.decodeResource(res, R.drawable.fixed_1, options);
  mTargetedBubblesOrig[1] = 
    BitmapFactory.decodeResource(res, R.drawable.fixed_2, options);
  mTargetedBubblesOrig[2] = 
    BitmapFactory.decodeResource(res, R.drawable.fixed_3, options);
  mTargetedBubblesOrig[3] = 
    BitmapFactory.decodeResource(res, R.drawable.fixed_4, options);
  mTargetedBubblesOrig[4] = 
    BitmapFactory.decodeResource(res, R.drawable.fixed_5, options);
  mTargetedBubblesOrig[5] = 
    BitmapFactory.decodeResource(res, R.drawable.fixed_6, options);
  this.mBubbleBlinkOrig =
    BitmapFactory.decodeResource(res, R.drawable.bubble_blink, options);
  this.mGameWonOrig =
    BitmapFactory.decodeResource(res, R.drawable.win_panel, options);
  this.mGameLostOrig =
    BitmapFactory.decodeResource(res, R.drawable.lose_panel, options);
  this.mHurryOrig = 
    BitmapFactory.decodeResource(res, R.drawable.hurry, options);
  this.mPenguinsOrig = 
    BitmapFactory.decodeResource(res, R.drawable.penguins, options);
  this.mCompressorHeadOrig =
    BitmapFactory.decodeResource(res, R.drawable.compressor, options);
  this.mCompressorOrig =
    BitmapFactory.decodeResource(res, R.drawable.compressor_body, options);
  this.mLifeOrig = 
    BitmapFactory.decodeResource(res, R.drawable.life, options);
  this.mFontImageOrig =
    BitmapFactory.decodeResource(res, R.drawable.bubble_font, options);

  this.mImageList = new Vector();

  var mBackground = this.mBackground = this.NewBmpWrap();
  var mBubbles = this.mBubbles = new Array(8);
  for (var i = 0; i < mBubbles.length; i++) {
    mBubbles[i] = this.NewBmpWrap();
  }
  var mBubblesBlind = this.mBubblesBlind = new Array(8);
  for (var i = 0; i < mBubblesBlind.length; i++) {
    mBubblesBlind[i] = this.NewBmpWrap();
  }
  var mFrozenBubbles = this.mFrozenBubbles = new Array(8);
  for (var i = 0; i < mFrozenBubbles.length; i++) {
    mFrozenBubbles[i] = this.NewBmpWrap();
  }
  var mTargetedBubbles = this.mTargetedBubbles = new Array(6);
  for (var i = 0; i < mTargetedBubbles.length; i++) {
    mTargetedBubbles[i] = this.NewBmpWrap();
  }
  var mBubbleBlink = this.mBubbleBlink = this.NewBmpWrap();
  var mGameWon = this.mGameWon = this.NewBmpWrap();
  var mGameLost = this.mGameLost = this.NewBmpWrap();
  var mHurry = this.mHurry = this.NewBmpWrap();
  var mPenguins = this.mPenguins = this.NewBmpWrap();
  var mCompressorHead = this.mCompressorHead = this.NewBmpWrap();
  var mCompressor = this.mCompressor = this.NewBmpWrap();
  this.mLife = this.NewBmpWrap();
  var mFontImage = this.mFontImage = this.NewBmpWrap();

  this.mFont = new BubbleFont(mFontImage);
  var mLauncher = this.mLauncher = res.getDrawable(R.drawable.launcher);

  //var mSoundManager = this.mSoundManager = new SoundManager(mContext);
  var mSoundManager = this.mSoundManager = null;

  if (null === customLevels) {
    try {
      var is = mContext.getAssets().open("levels.txt");
      var levels = is.read();
      var sp = mContext.getSharedPreferences(FrozenBubble.PREFS_NAME, 
                                             Context.MODE_PRIVATE);
      this.startingLevel = sp.getInt("level", 0);
      this.mLevelManager = new LevelManager(levels, this.startingLevel);
    } catch (e) {
          // Should never happen.
      throw new RuntimeException(e);
    }
  } else {
    // We were launched by the level editor.
    this.mLevelManager = new LevelManager(this.customLevels, 
                                          this.startingLevel);
  }

  this.mFrozenGame = new FrozenGame(mBackground, mBubbles, mBubblesBlind,
                                    mFrozenBubbles, mTargetedBubbles,
                                    mBubbleBlink, mGameWon, mGameLost,
                                    mHurry, mPenguins, mCompressorHead,
                                    mCompressor, mLauncher, 
                                    mSoundManager, this.mLevelManager);
}

GameThread.FRAME_DELAY = 40;
GameThread.STATE_RUNNING = 1;
GameThread.STATE_PAUSE = 2;
GameThread.STATE_ABOUT = 4;
GameThread.GAMEFIELD_WIDTH = 320;
GameThread.GAMEFIELD_HEIGHT = 480;
GameThread.EXTENDED_GAMEFIELD_WIDTH = 640;
GameThread.TRACKBALL_COEFFICIENT = 5;
GameThread.TOUCH_FIRE_Y_THRESHOLD = 580;
GameThread.ATS_TOUCH_COEFFICIENT = 0.2;
GameThread.ATS_TOUCH_FIRE_Y_THRESHOLD = 350;

GameThread.prototype.scaleFrom = function scaleFrom(image, bmp) {
  var mDisplayScale = this.mDisplayScale;
  if (image.bmp != null && image.bmp != bmp) {
    image.bmp.recycle();
  }

  if (mDisplayScale > 0.99999 && mDisplayScale < 1.00001) {
    image.bmp = bmp;
    return;
  }
  var dstWidth = (bmp.getWidth() * mDisplayScale);
  var dstHeight = (bmp.getHeight() * mDisplayScale);
  image.bmp = Bitmap.createScaledBitmap(bmp, dstWidth, dstHeight, true);
};

GameThread.prototype.resizeBitmaps = function resizeBitmaps() {
  var mBackground = this.mBackground, mBackgroundOrig = this.mBackgroundOrig,
      mBubbles = this.mBubbles, mBubblesOrig = this.mBubblesOrig,
      mBubblesBlind = this.mBubblesBlind, 
      mBubblesBlindOrig = this.mBubblesBlindOrig,
      mFrozenBubbles = this.mFrozenBubbles, 
      mFrozenBubblesOrig = this.mFrozenBubblesOrig,
      mTargetedBubbles = this.mTargetedBubbles,
      mTargetedBubblesOrig = this.mTargetedBubblesOrig,
      mBubbleBlink = this.mBubbleBlink, 
      mBubbleBlinkOrig = this.mBubbleBlinkOrig,
      mGameWon = this.mGameWon, mGameWonOrig = this.mGameWonOrig,
      mGameLost = this.mGameLost, mGameLostOrig = this.mGameLostOrig,
      mHurry = this.mHurry, mHurryOrig = this.mHurryOrig,
      mPenguins = this.mPenguins, mPenguinsOrig = this.mPenguinsOrig,
      mCompressorHead = this.mCompressorHead, 
      mCompressorHeadOrig = this.mCompressorHeadOrig,
      mCompressor = this.mCompressor, mCompressorOrig = this.mCompressorOrig,
      mLife = this.mLife, mLifeOrig = this.mLifeOrig,
      mFontImage = this.mFontImage, mFontImageOrig = this.mFontImageOrig;
  //Log.i("frozen-bubble", "resizeBitmaps()");
  this.scaleFrom(mBackground, mBackgroundOrig);
  for (var i = 0; i < mBubblesOrig.length; i++) {
    this.scaleFrom(mBubbles[i], mBubblesOrig[i]);
  }
  for (var i = 0; i < mBubblesBlind.length; i++) {
    this.scaleFrom(mBubblesBlind[i], mBubblesBlindOrig[i]);
  }
  for (var i = 0; i < mFrozenBubbles.length; i++) {
    this.scaleFrom(mFrozenBubbles[i], mFrozenBubblesOrig[i]);
  }
  for (var i = 0; i < mTargetedBubbles.length; i++) {
    this.scaleFrom(mTargetedBubbles[i], mTargetedBubblesOrig[i]);
  }
  this.scaleFrom(mBubbleBlink, mBubbleBlinkOrig);
  this.scaleFrom(mGameWon, mGameWonOrig);
  this.scaleFrom(mGameLost, mGameLostOrig);
  this.scaleFrom(mHurry, mHurryOrig);
  this.scaleFrom(mPenguins, mPenguinsOrig);
  this.scaleFrom(mCompressorHead, mCompressorHeadOrig);
  this.scaleFrom(mCompressor, mCompressorOrig);
  this.scaleFrom(mLife, mLifeOrig);
  this.scaleFrom(mFontImage, mFontImageOrig);
  //Log.i("frozen-bubble", "resizeBitmaps done.");
  this.mImagesReady = true;
};

GameThread.prototype.pause = function pause() {
  var mMode = this.mMode, STATE_RUNNING = GameThread.STATE_RUNNING,
      STATE_PAUSE = this.STATE_PAUSE;
  if (mMode == STATE_RUNNING) {
    this.setState(STATE_PAUSE);
  }
};

GameThread.prototype.NewBmpWrap = function NewBmpWrap() {
  var mImageList = this.mImageList;
  var new_img_id = mImageList.size();
  var new_img = new BmpWrap(new_img_id);
  mImageList.addElement(new_img);
  return new_img;
};

GameThread.prototype.setState = function setState(mode) {
  this.mMode = mode;
}

GameThread.prototype.setSurfaceSize = function setSurfaceSize(width, height) {
  var GAMEFIELD_WIDTH = GameThread.GAMEFIELD_WIDTH,
      GAMEFIELD_HEIGHT= GameThread.GAMEFIELD_HEIGHT,
      EXTENDED_GAMEFIELD_WIDTH = GameThread.EXTENDED_GAMEFIELD_WIDTH;
  this.mCanvasWidth = width;
  this.mCanvasHeight = height;
  if (width / height >= GAMEFIELD_WIDTH / GAMEFIELD_HEIGHT) {
    this.mDisplayScale = 1.0 * height / GAMEFIELD_HEIGHT;
    this.mDisplayDX =
      ((width - this.mDisplayScale * EXTENDED_GAMEFIELD_WIDTH) / 2);
    this.mDisplayDY = 0;
  } else {
    this.mDisplayScale = 1.0 * width / GAMEFIELD_WIDTH;
    this.mDisplayDX = (-this.mDisplayScale *
                       (EXTENDED_GAMEFIELD_WIDTH - GAMEFIELD_WIDTH) / 2);
    this.mDisplayDY = ((height - mDisplayScale * GAMEFIELD_HEIGHT) / 2);
  }
  this.resizeBitmaps();
};

GameThread.prototype.drawBackground = function drawBackground(c) {
  var mBackground = this.mBackground, mDisplayScale = this.mDisplayScale,
      mDisplayDX = this.mDisplayDX, mDisplayDY = this.mDisplayDY;
  Sprite.drawImage(mBackground, 0, 0, c, mDisplayScale,
                   mDisplayDX, mDisplayDY);
};

GameThread.prototype.drawLevelNumber = function drawLevelNumber(canvas) {
  var mDisplayScale = this.mDisplayScale, mDisplayDX = this.mDisplayDX,
      mDisplayDY = this.mDisplayDY, mFont = this.mFont;
  var y = 433;
  var x;
  // var level = mLevelManager.getLevelIndex() + 1;
  var level = 69;
  if (level < 10) {
    x = 185;
    mFont.paintChar(Character.forDigit(level, 10), x, y, canvas,
                    mDisplayScale, mDisplayDX, mDisplayDY);
  } else if (level < 100) {
    x = 178;
    x += mFont.paintChar(Character.forDigit(Math.floor(level / 10), 10), 
                         x, y, canvas, mDisplayScale, mDisplayDX, mDisplayDY);
    mFont.paintChar(Character.forDigit(level % 10, 10), x, y, canvas,
                    mDisplayScale, mDisplayDX, mDisplayDY);
  } else {
    x = 173;
    x += mFont.paintChar(Character.forDigit(Math.floor(level / 100), 10), 
                         x, y, canvas, mDisplayScale, mDisplayDX, mDisplayDY);
    level -= 100 * Math.floor(level / 100);
    x += mFont.paintChar(Character.forDigit(Math.floor(level / 10), 10), 
                         x, y, canvas, mDisplayScale, mDisplayDX, mDisplayDY);
    mFont.paintChar(Character.forDigit(level % 10, 10), x, y, canvas,
                    mDisplayScale, mDisplayDX, mDisplayDY);
  }
};

GameThread.prototype.doDraw = function doDraw(canvas) {
  var mImagesReady = this.mImagesReady, mDisplayScale = this.mDisplayScale,
      mDisplayDX = this.mDisplayDX, mDisplayDY = this.mDisplayDY;
  //Log.i("frozen-bubble", "doDraw()");
  if (!mImagesReady) {
    //Log.i("frozen-bubble", "!mImagesReady, returning");
    return;
  }
  if (mDisplayDX > 0 || mDisplayDY > 0) {
    //Log.i("frozen-bubble", "Drawing black background.");
    canvas.drawRGB(0, 0, 0);
  }
  this.drawBackground(canvas);
  this.drawLevelNumber(canvas);
  this.mFrozenGame.paint(canvas, mDisplayScale, mDisplayDX, mDisplayDY);
};
