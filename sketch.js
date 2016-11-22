var showDebug = false;
//Serial
var serial;
var inData;


//Time

var theTime;

var hrTime = 23;
var minTime;
var secTime;

var yet = true;

//Millis Counter
var mTime;
var pTime = 0;

//For Typing
var pTimeT = 0;
//Typing Index
var ct = 0;
var rct = 0;
var nuct = 0;
var testMsg = "Welcome to 96.7  Lite FM. This is the radio. Hello, radio listeners! Hello radio listeners! Hello radio listeners!Hello radio listeners!Hello radio listeners!Hello radio listeners!Hello radio listeners!Hello radio listeners!"

//Game Stats
var end = "Game Over";
var isOver = false;
var lives = 3;
var points = 0;
var sus = false;
var nuposition = 0;

//Phone
var phone = new phoneDisplay(950,320,250,380);
var onColor = 240;
var display = "";
var battery = 100.00;
var bTime = 0;

//Radio
var radio = new radioDisplay(205,500,500,150);
var RonColor = "20,255,255";
var rdisplay = "HELLO RADIO LISTENERS!";
var channel = 0;

//Camera
var tv = new tvDisplay(252,100,400,300);
var tvCh = 0;

//Alarm
var alarm = false;
var aTimer = 0;

//Initialize Dialogue
var lines;

//Current Dialogue
var position = 0;
var asking = true;
var choice;

//Sliders
// //Volume
// var vSlider;
var vol;
// //Radio Channel
// var cSlider;
// //TV Channel
// var tvSlider;

var oPress;
var pPress;

function preload(){
  
  //Load Dialogue
  lines = loadJSON("data/lines.json");  
  rlines = loadJSON("data/r_lines.json");
}

function printList(portList){
  for (var i=0;i<portList.length;i++){
    console.log(i+" "+portList[i]);
  }
}

function serverConnected() {
  console.log('connected to server.');
}
 
function portOpen() {
  console.log('the serial port opened.')
}
 
function serialEvent() {
  //wow
  //inData = Number(serial.read());
  
  var inString = serial.readStringUntil('\r\n');
  
  if(inString.length>0){
    var sensors = split(inString, ',');
    if (sensors.length > 1) {                      // if there are two elements
      tvCh = sensors[0];
      vol = sensors[1];
      if(sensors[2]!=channel){
      rdisplay = "-";
      channel = sensors[2];
      
      oPress = sensors[3];
      pPress = sensors[4];
    }
      
    }
  }
}
 
function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  console.log('The serial port closed.');
}

function setup() {
  //Serial
  serial = new p5.SerialPort();
  serial.on('list', printList);
  

  
  var options = {baudrate:9600};
  
  serial.on('connected',serverConnected);
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose); 
  
  serial.list();
  serial.open('COM6',options);
  
  createCanvas(1280,720);

  //Display Initialize
  position = 0;
  display = "";
  rdisplay = "";
  ct = 0;
  rct = 0;
  pTime = 0;
  pTimeT = 0;
  
  // vSlider=createSlider(0,100,50);
  // vSlider.position(20,20);
  // cSlider = createSlider (0,2,0);
  // cSlider.position(20,40);
  // tvSlider = createSlider (0,2,0);
  // tvSlider.position(20,60);
  
  //background image
  bg = loadImage("data/bg.jpg");
  
  //tv images
  ch1 = loadImage("assets/ch1.jpg");
  ch2 = loadImage("assets/ch2.jpg");
  ch3 = loadImage("assets/ch3.jpg");
}

function draw() {
  
  //Counters
  mTime = int(millis());
  
  
  //Background
  background(bg);
  
  //Set Time Values
  
  //Step Hour
  if (secTime == 0){
    if(yet){
      hrTime++;
      yet = false;      
    }

  }
  if (secTime == 1){
    yet = true;
  }
  
  //Set Midnight
  if(hrTime == 24) {
    hrTime = 0;
  }
  if(hrTime < 10 && hrTime.toString().length < 2){
    hrTime = "0"+hrTime;
  }
  
  if(second() < 10){
    secTime = "0"+second();
  }
  else{
    secTime = second();
  }
  
  theTime = hrTime +":"+ secTime;


  //Display Time
  fill(0,255,0);
  textSize(48);
  text(theTime, 900, 200);
  

  
  //Console Log
  if(showDebug){
    textSize(12);
    text("Asking: "+asking, 50, 100);
    
    //Display Counter
    textSize(14);
    fill(0);
    text(mTime+", "+pTime, 50, 75);
    text("Alarm: "+alarm, 50, 125);
    text("Lives: "+lives+" Points: "+points, 50, 150);
    text("Sus: "+sus, 50, 175);
    text("InData: "+inData, 50, 200);
  }

  
  //Game Over
  if(isOver){
    gameOver();
  }
  

  
  //Display TV
  //console.log(tv);
  //tvCh = inData; //omg
  
  if(!tv.on){
    fill(150);
    rect(tv.xpos, tv.ypos, tv.w, tv.h);
  }
  else if(tv.on){
    fill(255,0,0);
    rect(tv.xpos, tv.ypos, tv.w, tv.h);
    if(tvCh == 0){
      image(ch1,tv.xpos, tv.ypos);
    }
    if(tvCh == 1){
      image(ch2,tv.xpos, tv.ypos);
    }
    if(tvCh == 2){
      image(ch3,tv.xpos, tv.ypos);
    }
    
  }
  
  
  stroke(0);
  //Display Radio
    if(rct < rlines[channel].lines.length){
        if(rct - nuct > 275){
          rdisplay = "-";
          nuct = rct;
        }      
      if(mTime > 2000 && mTime - pTimeT > 100){
        
        rdisplay = rdisplay + rlines[channel].lines[rct];
        pTimeT = mTime;
        //phone battery riding off radio timer
        if(phone.on){
          battery = (battery-0.2).toFixed(1);
          if(battery <= 0.0){
            phone.on = false;
            phone.alive = false;
          }
        }
        rct++;
      }
    }
    
  if(!radio.on){
    fill(100);
    rect(radio.xpos, radio.ypos, radio.w, radio.h);
  }
  else if(radio.on){
    fill(255);
    rect(radio.xpos, radio.ypos, radio.w, radio.h);
    
    //Radio radio
    //var vol = vSlider.value();
    

    
    
    //Display Text in Radio
    fill(25);
    
    textSize(16);
    noStroke();
    fill(rlines[channel].roy+.01*(100-vol)*255, rlines[channel].gee+.01*(100-vol)*255, rlines[channel].biv+.01*(100-vol)*255);
    //Classical Music Channel
    if(channel == 2){
      rdisplay = "*Classical music plays gently. It's quite nice*";
    }
    text(rdisplay, radio.xpos+25, radio.ypos+25, radio.w-50, radio.h-50);
  }
  
  //Display Phone
  
  

  noStroke();
  if(!phone.on){
    if(phone.alive){
      fill(50);
    }
    if(!phone.alive){
      fill(100);
    }
    rect(phone.xpos, phone.ypos, phone.w, phone.h);
    //Setup for Timeout
    //pTime = mTime;
    
    //Notification Light
    if(phone.alive){
      if(asking){
        if(secTime % 2 == 0){
          fill(255, 255, 204);
        }
        else{
          fill(50);
        }
        ellipse(phone.xpos + phone.w-25, phone.ypos + 25, 10);
      }      
    }
    
  }
  else if(phone.on && phone.alive){
    fill(onColor);
    if(asking){
      fill(255, 255, 204);
    }    
    rect(phone.xpos, phone.ypos, phone.w, phone.h);
    
    //Battery Display
    fill(0,255,0);
    rect(phone.xpos, phone.ypos,10 , battery*.01*phone.h);
    
    //Display Text in Phone
    fill(25);
    textSize(16);
    text(display, phone.xpos + 25,phone.ypos + 25,phone.w-30,phone.h-25);
    text(battery, phone.xpos + 25,phone.h+300);
    
    //Alarm Conditional
    if(!alarm){
      display = lines[position].quest;
    }
    //Text Typing
    // if(ct < lines[position].quest.length){  
    //   if(mTime > 2000 && mTime - pTimeT > 10){
    //     asking = false;
    //     display = display + lines[position].quest[ct];
    //     pTimeT = mTime;
    //     ct++;
        

    //   }
    }
    else{
      asking = true;
    }
    
    //Dead Phone
    if(phone.alive==false){
      fill(255);
      text("Phone Dead", phone.xpos + 25,phone.ypos + 25,phone.w-30,phone.h-25);
    }
    
    //Conditions
    if(points > 2){
      console.log("win");
    }
    if(lives<1){
      console.log("lose");
    }
    
    //Alarm
    if(alarm){
      if(sus){
        points++;
        alarm = false;
      }
      if(!sus){
        lives--;
        alarm = false;
        if(lives = 2){
          nuposition = 17;
          display = lines[nuposition];
        }
        if(lives = 1){
          nuposition = 18;
          display = lines[nuposition];
        }
        if(lives = 0){
          nuposition = 19;
          display = lines[nuposition];
          isOver = true;
        }
      }
    }

      
    //Timeout
    if(mTime - pTime > lines[position].nextTime * 1000){

      position = lines[position].def;
      pTime = mTime;
      
      //reset asking
      display = "";
      asking = true;
    }
  }
  
  
  
  //Logging
  


function keyTyped(){
  //Reset Game
  if(key === 'r'){
    setup();
  }
  
  //Over
  if(key === 'g'){
    isOver = true;
  }
  
  //Toggle Phone
  if(key === 'p' || pPress == 1){
    if (!phone.on){
      phone.on = true;
    }
    else {
      phone.on = false;
    }
  }
  
  //Toggle Radio
  if(key === 'o' || oPress == 1){
    if(!radio.on){
      radio.on = true;
    }
    else {
      rdisplay = "-";
      radio.on = false;
    }
  }
  
  //Tune TV
    if(key === 't'){
      if(!tv.on){
        tv.on = true;
      }
      else{
        tv.on=false;
      }
    }
  
  //Alarm
    if(key === 'a'){
      aTimer = mTime;
      alarm = true;
    }
  
  //Show Debug
  if(key === 'd'){
    if(showDebug){
      showDebug=false;
    }
    else{
      showDebug = true;
    }
    
  }
  
  if(asking && phone.on){
    if(key === 'y'){
      choice = "yes";
      if(lines[position].yes != null){
        position = lines[position].yes;
      }
      
      asking = false;
    }
    if(key === 'n'){
      choice = "no";
      if(lines[position].no != null){
        position = lines[position].no;
      }
      
      asking = false;
    }
  }
}