let fish;
let fsize = 50.0; // Fish的大小
let speed = 0.03; // Fish的速度

let video;
let poseNet; // 监测摄像头捕获的视频中的人的姿势（不仅仅只包含鼻子）
let poses = [];
let x2, y2; // 之后进行鼻子的坐标设置

let foods = [];
let bubbles = [];
let bubbleTimer = 5000; 

function setup() {
    createCanvas(windowWidth, windowHeight);

    video = createCapture(VIDEO);
    video.size(width, height);
    poseNet = ml5.poseNet(video, modelReady);

    //这串代码是：我已经准备好，摄像机已经开始捕捉我的头了
    poseNet.on('pose', function(results) {
        poses = results;
    });
    video.hide();

    //创建一条鱼
    fish = new Fish(random(width), random(height), fsize);

    for (let i = 0; i < 10; i++) {
        // 食物随机出现的位置在距离上下左右边都有一定距离的地方
        let foodX = random(width * 0.1, width * 0.9);
        let foodY = random(height * 0.1, height * 0.9);
        let foodType = int(random(0, 8));
        let foodSize = random(40, 50); // 随机生成食物的大小
        foods.push(new Food(foodX, foodY, foodType, foodSize));
    }

    // 设置泡泡定时器
    setInterval(createBubbleGroup, bubbleTimer);
}

function modelReady() {
    select('#status').html('Model Loaded');
}

function draw() {
    createCanvas(windowWidth, windowHeight);
    strokeWeight(0);

    //这是用鼻子来控制鱼的代码
    if (poses.length > 0) {
        let pose = poses[0].pose; //监测到我的脸
        let nose = pose.nose; //监测到我的鼻子
        x2 = width - nose.x;
        y2 = nose.y;

        fish.update(x2, y2); // 鱼跟随我的鼻子
        fish.display(); //画了个鱼
    }

    // 更新和显示食物
    for (let i = foods.length - 1; i >= 0; i--) {
        let food = foods[i];
        food.display();

        // 检查食物是否被吃掉
        if (dist(food.x, food.y, fish.x - 30, fish.y - 10) < 20) {
            foods.splice(i, 1); // 从数组中移除食物
        }
    }

    // 更新和显示泡泡
    for (let i = bubbles.length - 1; i >= 0; i--) {
        let bubbleGroup = bubbles[i];
        bubbleGroup.update();
        bubbleGroup.display();
        if (bubbleGroup.alpha <= 0) {
            bubbles.splice(i, 1); // 从数组中移除泡泡组
        }
    }
}

function createBubbleGroup() {
    let bubbleX = fish.x - 60; // 泡泡组的初始 x 坐标（鱼的最左端）
    let bubbleY = fish.y; // 泡泡组的初始 y 坐标（鱼的位置）
    let bubbleGroup = new BubbleGroup(bubbleX, bubbleY);
    bubbles.push(bubbleGroup);
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

class Food {
    constructor(x, y, type, size) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = size;
    }

    display() {
        noStroke();
        textSize(this.size);
        switch (this.type) {
            case 0:
                fill(255, 0, 0);
                text("🧀", this.x, this.y);
                break;
            case 1:
                fill(0, 255, 0);
                text("🍏", this.x, this.y);
                break;
            case 2:
                fill(255, 255, 0);
                text("🍡", this.x, this.y);
                break;
            case 3:
                fill(255, 165, 0);
                text("🎂", this.x, this.y);
                break;
            case 4:
                fill(255);
                text("🍦", this.x, this.y);
                break;
            case 5:
                fill(255, 215, 0);
                text("🍧", this.x, this.y);
                break;
            case 6:
                fill(255, 205, 0);
                text("🍙", this.x, this.y);
                break;
            case 7:
                fill(255, 200, 0);
                text("🧃", this.x, this.y);
                break;

        }
    }
}

class Bubble {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.alpha = 255;
    }

    update() {
        this.alpha -= 3; // 降低透明度以实现消失效果
        this.y -= 1; // 向上移动
    }

    display() {
        noStroke();
        fill(150, 200, 255, this.alpha); // 设置泡泡颜色和透明度
        ellipse(this.x, this.y, this.size, this.size);
    }
}

class BubbleGroup {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.bubbles = [];

      // 创建两个大小不同的泡泡，并设置垂直偏移
      let bubble1 = new Bubble(this.x, this.y - 10, 20);
      let bubble2 = new Bubble(this.x, this.y + 10, 15);

      this.bubbles.push(bubble1);
      this.bubbles.push(bubble2);
  }

  update() {
      for (let bubble of this.bubbles) {
          bubble.update();
      }
  }

  display() {
      for (let bubble of this.bubbles) {
          bubble.display();
      }
  }
}