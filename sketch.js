let numLayers = 50;
let fishes = []; 
let fsize = 50.0; // Fish的大小
let speed = 0.03; // Fish的速度

let video;
let poseNet; // 监测摄像头捕获的视频中的人的姿势（不仅仅只包含鼻子）
let poses = [];
let x2, y2; // 之后进行鼻子的坐标设置

function setup() {
  createCanvas(1200, 600);

  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);

  //这串代码是：我已经准备好，摄像机已经开始捕捉我的头了
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();

  //画面最开始很多鱼的代码。
  for (let i = numLayers - 1; i >= 0; i--) {
    let fishX = random(width); 
    let fishY = random(height); 
    let fishSize = fsize * (1 - i / numLayers);
    fishes[i] = new Fish(fishX, fishY, fishSize);
  }
}
function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  background(200, 230, 250);
  strokeWeight(0);

  //这是用鼻子来控制鱼的代码
  if (poses.length > 0) {
    let pose = poses[0].pose; //监测到我的脸
    let nose = pose.nose; //监测到我的鼻子
    x2 = width - nose.x;
    y2 = nose.y;

    for (let i = numLayers - 1; i >= 0; i--) {
      let fish = fishes[i];
      fish.update(x2, y2); // 鱼跟随我的鼻子
      fish.display();  //画了个鱼
    }
  }
}

class Fish {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.bodyColor = color(150, 200, 255);
    this.eyeColor = color(255);
  }
  //让fish来实时跟踪我的鼻子的代码
  update(newX, newY) {
    this.x = lerp(this.x, newX, speed); //鱼的x坐标会根据鼻子的位置逐渐移动到新的位置
    this.y = lerp(this.y, newY, speed); //y同上
  }

  display() {
    // 鱼的身体
    fill(255, 100, 33); 
    stroke(255, 100, 33); 
    ellipse(this.x, this.y, 100, 70); 
  
    // 鱼的尾巴（三角形）
    fill(255, 100, 33);
    noStroke();
    triangle(this.x + 40, this.y, this.x + 85, this.y - 30, this.x + 85, this.y + 30);
  
    // 鱼的眼睛
    fill(255); 
    stroke(0); 
    ellipse(this.x - 30, this.y - 10, 10, 10);
  }
}



