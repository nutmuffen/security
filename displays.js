function phoneDisplay(x, y, width, height){
  this.state = 1;
  this.xpos = x;
  this.ypos = y;
  this.w = width;
  this.h = height;
  this.on = false;
  this.alive = true;
}

function radioDisplay(x, y, width, height){
  this.on = false;
  this.xpos = x;
  this.ypos = y;
  this.w = width;
  this.h = height;
}

function tvDisplay(x,y,width,height){
  this.on = true;
  this.xpos = x;
  this.ypos = y;
  this.w = width;
  this.h = height;
}

function gameOver(){
  background(255,0,0);
  
}