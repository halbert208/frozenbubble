/*
    Copyright 1995-2010, Kirit Saelensminde.
    http://www.kirit.com/Missile%20intercept

    This file is part of Missile intercept.

    Missile intercept is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Missile intercept is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Missile intercept.  If not, see <http://www.gnu.org/licenses/>.
*/

// android.app.Activity
function Activity() {
}

Activity.prototype.getResources = function getResources() {
  return RESOURCES;
};

Activity.prototype.setContentView = function setContentView(view) {
};

Activity.prototype.onCreate = function onCreate(savedInstanceState) {
};

Activity.prototype.requestWindowFeature = function requestWindowFeature(f) {
};

Activity.prototype.getWindow = function getWindow() {
  return {setFlags: function(flag1, flag2){}};
};

Activity.prototype.getAssets = function getAssets() {
  return ASSETS;
};

// @@ 实现本地存储
Activity.prototype.getSharedPreferences = function getSharedPreferences(name, 
                                                                        mode) {
  return new SharedPreferences();
};

// android.content.Context
var Context = {};

Context.MODE_PRIVATE = 0;

// android.content.res.AssetManager
function AssetManager() {
}

AssetManager.prototype.open = function open(fileName) {
  return new InputStream("assets/" + fileName);
};

var ASSETS = new AssetManager();

// android.content.res.Resources
function Resources() {
}

Resources.prototype.getDrawable = function getDrawable(url) {
  return new BitmapDrawable(url);
};

var RESOURCES = new Resources();

// android.content.SharedPreferences
function SharedPreferences() {
}

// @@ 实现本地存储
SharedPreferences.prototype.getInt = function getInt(key, defValue) {
  return defValue
};

// android.graphics.Bitmap === HTMLImageElement
var Bitmap = HTMLImageElement;
Bitmap.prototype.recycle = function recycle() {
};

Bitmap.prototype.getWidth = function getWidth() {
  return this.width;
};

Bitmap.prototype.getHeight = function getHeight() {
  return this.height;
};

Bitmap.createScaledBitmap = function createScaledBitmap(src, dstWidth,
                                                        dstHeight, filter){
  var img = new Image;
  img.src = src.src;
  img.width = dstWidth;
  img.height = dstHeight;
  document.body.appendChild(img);
  return img;
}

// android.graphics.BitmapFactory 
var BitmapFactory = {};

BitmapFactory.decodeResource = function decodeResource(res, id, opts) {
  var img = document.querySelector("[src='" + id + "']");
  if (!img) console.error("没找到 " + id);
  return img;
};

BitmapFactory.Options = function Options() {
};

// android.graphics.Canvas
function Canvas() {
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext('2d');
}

Canvas.CLIP_SAVE_FLAG = 2;

Canvas.prototype.drawLine = function drawLine(startX, startY, stopX, stopY, paint) {
  var ctx = this.ctx;
  ctx.globalAlpha = paint.alpha;
  this.setColor(paint);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(stopX, stopY);
  ctx.stroke();
};

Canvas.prototype.drawARGB = function drawARGB(a, r, g, b) {
  var ctx = this.ctx;
  ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas.prototype.drawCircle = function drawCircle(cx, cy, radius, paint) {
  var ctx = this.ctx;
  ctx.globalAlpha = paint.alpha;
  this.setColor(paint);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
  ctx.fill();
};

Canvas.prototype.drawRGB = function drawRGB(r, g, b) {
  var ctx = this.ctx;
  ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

// helper
Canvas.prototype.setColor = function setColor(paint) {
  var color = paint.color;
  var css = "rgba(" + (color >>> 16 & 0xff) + "," +
                      (color >>> 8  & 0xff) + "," +
                      (color & 0xff) + "," +
                      (color >>> 24) / 255 + ")";
  this.ctx.strokeStyle = css;
  this.ctx.fillStyle = css;
}

Canvas.prototype.drawBitmap = function drawBitMap(bitmap, src_or_left, 
                                                  dst_or_top, paint) {
  var ctx = this.ctx;
  if (paint)
    ctx.globalAlpha = paint.alpha;
  if (dst instanceof Object) {
    var src = src_or_left, dst = dst_or_top;
    if (src)
      ctx.drawImage(bitmap, src.left, src.top, 
                            src.right - src.left, src.bottom - src.top,
                            dst.left, dst.top, 
                            dst.right - dst.left, dst.bottom - dst.top);
    else
      ctx.drawImage(bitmap, dst.left, dst.top, 
                            dst.right - dst.left, dst.bottom - dst.top);
  } else {
    var left = src_or_left, top = dst_or_top;
    ctx.drawImage(bitmap, left, top, bitmap.width, bitmap.height);
  }
};

Canvas.prototype.save = function save(saveFlags) {
  this.ctx.save();
};

Canvas.prototype.restore = function restore() {
  this.ctx.restore();
};

Canvas.prototype.clipRect = function clipRect(left, top, right, bottom, op) {
  var ctx = this.ctx;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(right, top);
  ctx.lineTo(right, bottom);
  ctx.lineTo(left, bottom);
  ctx.closePath();
  ctx.clip();
};

var CANVAS = new Canvas();

// android.graphics.Color

// https://github.com/indyarmy/color2color/blob/master/color2color.js#L367
var Color = { HSVToColor: function HSVToColor(bits) {
    var rgb = {},
    hsv = {
    h : bits[0] % 360 / 360,
    s : bits[1],
    v : bits[2]
    },
    i = Math.floor(hsv.h * 6),
    f = hsv.h * 6 - i,
    p = hsv.v * (1 - hsv.s),
    q = hsv.v * (1 - f * hsv.s),
    t = hsv.v * (1 - ( 1 - f ) * hsv.s);
    switch(i % 6) {
    case 0:
      rgb.r = hsv.v;
      rgb.g = t;
      rgb.b = p;
      break;
    case 1:
      rgb.r = q;
      rgb.g = hsv.v;
      rgb.b = p;
      break;
    case 2:
      rgb.r = p;
      rgb.g = hsv.v;
      rgb.b = t;
      break;
    case 3:
      rgb.r = p;
      rgb.g = q;
      rgb.b = hsv.v;
      break;
    case 4:
      rgb.r = t;
      rgb.g = p;
      rgb.b = hsv.v;
      break;
    case 5:
      rgb.r = hsv.v;
      rgb.g = p;
      rgb.b = q;
      break;
    }
    rgb.r = parseInt(rgb.r * 256, 10);
    rgb.g = parseInt(rgb.g * 256, 10);
    rgb.b = parseInt(rgb.b * 256, 10);
    return (0xff << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b;
  }
};

// android.graphics.Paint
function Paint(flag) {
  this.flag = flag;
  this.alpha = 1;
}

Paint.ANTI_ALIAS_FLAG = 0;

Paint.prototype.setColor = function setColor(color) {
  this.color = color;
};

Paint.prototype.setAlpha = function setAlpha(alpha) {
  this.alpha = alpha / 255;
};

// android.graphics.Point
function Point(x, y) {
  this.x = x;
  this.y = y;
}

// android.graphics.Rect
function Rect(left_or_r, top, right, bottom) {
  if (arguments.length === 4) {
    var left = left_or_r;
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  } else if (arguments.length === 1) {
    var r = left_or_r;
    this.left = r.left;
    this.top = r.top;
    this.right = r.right;
    this.bottom = r.bottom;    
  } else { 
    if (arguments.length !== 0) throw TypeError("参数数量错误");
  }
}

Rect.prototype.offsetTo = function offsetTo(newLeft, newTop) {
  this.right = newLeft - this.left + this.right;
  this.bottom = newTop - this.top + this.bottom;
  this.left = newLeft;
  this.top = newTop;
};

Rect.prototype.offset = function offset(dx, dy) {
  this.right += dx
  this.bottom += dy;
  this.left += dx;
  this.top += dy;
};


// android.graphics.Region
var Region = {Op: {REPLACE: 2}};

// android.graphics.drawable.BitmapDrawable
function BitmapDrawable(url) {
  this.img = document.querySelector("[src='" + url + "']");
}

BitmapDrawable.prototype.getMinimumWidth = function getMinimumWidth() {
  return this.img.width;
};

BitmapDrawable.prototype.getMinimumHeight = function getMinimumHeight() {
  return this.img.height;
};

BitmapDrawable.prototype.getIntrinsicHeight = function getIntrinsicHeight() {
  return this.img.height;
};

BitmapDrawable.prototype.setBounds = function setBounds(bounds_or_left,
                                                        top, right, bottom) {
  if (arguments.length === 1)
    this.bounds = bounds_or_left;
  else {
    if (arguments.length !== 4) throw TypeError("参数数量错误");
    this.bounds = new Rect(bounds_or_left, top, right, bottom);
  }
};

BitmapDrawable.prototype.draw = function draw(c) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  ctx.globalAlpha = 1;
  ctx.drawImage(this.img, this.bounds.left, this.bounds.top,
                this.bounds.right - this.bounds.left,
                this.bounds.bottom - this.bounds.top)
};

BitmapDrawable.prototype.getBitmap = function getBitmap() {
  return this.img;
};

// android.media.AudioManager
var AudioManager = {};
AudioManager.STREAM_MUSIC = 3;

// android.media.SoundPool
function SoundPool(maxStreams, streamType, srcQuality) {
}

SoundPool.prototype.load = function load(context, resId, priority) {
  return resId;
}

SoundPool.prototype.stop = function stop(streamID) {
  var audio = document.querySelector("[src='" + streamID + "']");
  audio.pause();
  audio.currentTime = 0;
}

SoundPool.prototype.play = function play(soundID, leftVolume, rightVolume, priority, loop, rate) {
  var audio = document.querySelector("[src='" + soundID + "']");
  if (loop)
    audio.loop = true;
  audio.play();
  return soundID;
}


// android.view.KeyEvent
var KeyEvent = {};
KeyEvent.KEYCODE_DPAD_UP = 19;
KeyEvent.KEYCODE_MENU = 82;

// android.view.MotionEvent
function MotionEvent(action, X, Y) {
  this.action = action;
  this.X = X;
  this.Y = Y;
}

MotionEvent.prototype.getAction = function getAction() {
  return this.action;
};

MotionEvent.prototype.getX = function getX() {
  return this.X;
};

MotionEvent.prototype.getY = function getX() {
  return this.Y;
};

MotionEvent.ACTION_DOWN = 0;

document.addEventListener('click', function(event) {
    main.view.onTouchEvent(new MotionEvent
                           (MotionEvent.ACTION_DOWN, 
                            event.clientX, 
                            event.clientY));
  }, false);

// android.view.SurfaceView
function SurfaceView(context, attrs, defStyle) {
}

SurfaceView.prototype = new View(null);

SurfaceView.prototype.getHolder = function getHolder() {
  return {addCallback: function(cb) {}};
};

// android.view.View
function View(context) {
}

View.prototype.setFocusable = function setFocusable(bool) {
};

View.prototype.setFocusableInTouchMode = function setFocusableInTouchMode(bool) {
};

View.prototype.onKeyUp = function onKeyUp(keyCode, event) {
};

View.prototype.onKeyDown = function onKeyDown(keyCode, event) {
};

View.prototype.getWidth = function getWidth() {
  var canvas = document.getElementById("canvas");
  return canvas.width;
}

View.prototype.getHeight = function getHeight() {
  var canvas = document.getElementById("canvas");
  return canvas.height;
}

View.prototype.requestFocus = function requestFocus() {
};

View.prototype.invalidate = function invalidate() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  this.onDraw(CANVAS);
}

// android.view.Window
var Window = {};

// android.view.WindowManager
var WindowManager = {LayoutParams: {}};

// java.io.InputStream
function InputStream(url) {
  var script = document.querySelector("[src='" + url + "']");
  if (!script) console.error("没找到 " + url);
  this.script = script;  
}

InputStream.prototype.read = function read() {
  return this.script.textContent;
};

// java.lang.Character
var Character = {};
Character.forDigit = function forDigit(digit, radix) {
  return digit.toString(radix);
};

// java.lang.RuntimeException
function RuntimeException() {
}

// java.lang.System
var System = {};

System.currentTimeMillis = function currentTimeMillis() {
  return Date.now();
}

// java.util.HashMap;
Object.prototype.put = function put(hash, obj) {
  this[hash] = obj;
};

Object.prototype.get = function get(hash) {
  return this[hash];
}

Object.prototype.containsKey = function containsKey(key) {
  return key in this;
}

// java.util.LinkedList
Array.prototype.add = Array.prototype.push;

// java.util.Random
function Random() {
}

Random.prototype.nextInt = function nextInt(n_or_) {
  if (arguments === 1)
    return Math.floor(Math.random() * n);
  else
    return Math.floor(Math.random() * 65536);
};

// java.util.Vector
function Vector() {
  this.array = [];
}

Vector.prototype.addElement = function addElement(object) {
  this.array.push(object);
};

Vector.prototype.size = function size() {
  return this.array.length;
};

Vector.prototype.elementAt = function elementAt(location) {
  return this.array[location];
};

Vector.prototype.removeElement = function removeElement(object) {
  var index = this.array.indexOf(object);
  if (index !== -1)
    this.array.splice(index, 1);
};

Vector.prototype. insertElementAt = function  insertElementAt(object, 
                                                              location) {
  this.array.splice(location, 0, object);
};
