let fish;
let fsize = 50.0; 
let speed = 0.03; 

let video;
let poseNet; //Monitor the posture of the person in the video captured by the camera (not just the nose)
let poses = [];
let x2, y2; // Set the coordinates of the nose

let foods = [];
let bubbles = [];
let bubbleTimer = 5000;
let particles = []; // Store particle effects

function setup() {
    createCanvas(windowWidth, windowHeight);

    video = createCapture(VIDEO);
    video.size(width, height);
    poseNet = ml5.poseNet(video, modelReady);

    poseNet.on('pose', function(results) {
        poses = results;
    });
    video.hide();

    fish = new Fish(random(width), random(height), fsize);

    for (let i = 0; i < 10; i++) {
        let foodX = random(width * 0.1, width * 0.9);
        let foodY = random(height * 0.1, height * 0.9);
        let foodType = int(random(0, 8));
        let foodSize = random(40, 50);
        foods.push(new Food(foodX, foodY, foodType, foodSize));
    }

    setInterval(createBubbleGroup, bubbleTimer);
}

function modelReady() {
    select('#status').html('Model Loaded');
}

function draw() {
    clear();

    // text prompt
    textSize(20);
    fill(100);
    text("Swing your head to control the movement of fish to eat food and tap the screen to drop food.", 20, 40);

    drawSeabed();

    if (poses.length > 0) {
        let pose = poses[0].pose;
        let nose = pose.nose;
        x2 = width - nose.x;
        y2 = nose.y;

        fish.update(x2, y2);
        fish.display();
    }

    for (let i = foods.length - 1; i >= 0; i--) {
        let food = foods[i];
        food.display();

        if (dist(food.x, food.y, fish.x - 30, fish.y - 10) < 20) {
            foods.splice(i, 1);
            fish.updateColor(color(255, 100, 33));

            for (let j = 0; j < 30; j++) {
                let particle = new Particle(food.x, food.y);
                particles.push(particle);
            }
        }
    }

    for (let i = bubbles.length - 1; i >= 0; i--) {
        let bubbleGroup = bubbles[i];
        bubbleGroup.update();
        bubbleGroup.display();
        if (bubbleGroup.alpha <= 0) {
            bubbles.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}

function mouseClicked() {
    foods.push(new Food(mouseX, mouseY, int(random(0, 8)), random(40, 50)));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function drawSeabed() {
    let seabedY = height - 100;
    fill(104, 238, 154, 99);
    noStroke();
    beginShape();
    vertex(0, seabedY);
    for (let i = 0; i <= width; i += 20) {
        let y = noise(i * 0.05, frameCount * 0.02) * 20;
        vertex(i, seabedY + y);
    }
    vertex(width, seabedY);
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
}

function createBubbleGroup() {
    let bubbleX, bubbleY;
    let direction = fish.getDirection();

    if (direction === -1) {
        bubbleX = fish.x + 60;
    } else {
        bubbleX = fish.x - 60;
    }

    bubbleY = fish.y;
    let bubbleGroup = new BubbleGroup(bubbleX, bubbleY);
    bubbles.push(bubbleGroup);
}

class Fish {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.bodyColor = color(255, 105, 0);
        this.eyeColor = color(255);
    }

    update(newX, newY) {
        this.x = lerp(this.x, newX, speed);
        this.y = lerp(this.y, newY, speed);
    }

    updateColor(newColor) {
        this.bodyColor = lerpColor(this.bodyColor, newColor, 0.1);
    }

    display() {
        let direction = this.getDirection();
    
        if (direction === -1) {
            fill(this.bodyColor);
            stroke(this.bodyColor);
            rect(this.x - 50, this.y - 35, 100, 70, 20); 
    
            fill(this.bodyColor);
            noStroke();
            triangle(this.x - 40, this.y, this.x - 85, this.y - 30, this.x - 85, this.y + 30);
    
            fill(this.eyeColor);
            noStroke();
            ellipse(this.x + 30, this.y - 10, 13, 13);
            
        } else {
            fill(this.bodyColor);
            stroke(this.bodyColor);
            rect(this.x - 50, this.y - 35, 100, 70, 20); // 绘制圆角矩形
    
            fill(this.bodyColor);
            noStroke();
            triangle(this.x + 40, this.y, this.x + 85, this.y - 30, this.x + 85, this.y + 30);
    
            fill(this.eyeColor);
            noStroke();
            ellipse(this.x - 30, this.y - 10, 13, 13);
            
          }
    }
    
    

    getDirection() {
        return this.x > width / 2 ? -1 : 1;
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
        this.alpha -= 4;
        this.y -= 1;
    }

    display() {
        noStroke();
        fill(150, 200, 255, this.alpha);
        ellipse(this.x, this.y, this.size, this.size);
    }
}

class BubbleGroup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.bubbles = [];

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

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(5, 15);
        this.alpha = 255;
        this.color = color(255, 255, 0);
        this.vx = random(-1, 1);
        this.vy = random(-5, -1);
        this.gravity = 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 5;
    }

    display() {
        noStroke();
        fill(this.color, this.alpha);
        ellipse(this.x, this.y, this.size);
    }
}
