var SIZE = 20;
let WIDTH = 700;
let HEIGHT = 700;
var diameter = WIDTH / SIZE;
var posx = 0;
var posy = 0;
let cells = [];

let end = false;
let begin = false;

let flag = false;

let bf_i, bf_j;
let bf_queue = [];
let bf_end = false;
let bf_cell;

function setup() {
  createCanvas(WIDTH, HEIGHT);

  //create 2D array cells
  for (var i = 0; i < SIZE; i++) {
    cells.push([]);
    for (var j = 0; j<SIZE; j++) {
      posx = (diameter / 2) + diameter * j;
      posy = (diameter / 2) + diameter * i;
      cells[i].push(new Cell(posx, posy, i, j, diameter));
    }
  }
}


function draw() {
  background(255);
  for (let i =0; i < SIZE; i++) {//display the cells
    for (let j =0; j<SIZE; j++) {
      if (cells[i][j].over() && mouseIsPressed && end == true && begin == true && cells[i][j].STATE == cells[i][j].INIT) {
        cells[i][j].STATE = cells[i][j].WALL;
      } else if (cells[i][j].over() && mouseIsPressed && end == false && begin == false && cells[i][j].STATE == cells[i][j].INIT) {
        begin = true;
        cells[i][j].STATE = cells[i][j].BEGIN;
      } else if (cells[i][j].over() && mouseIsPressed && end == false && begin == true && cells[i][j].STATE == cells[i][j].INIT) {
        end = true;
        cells[i][j].STATE = cells[i][j].END;
      }
      cells[i][j].display();
      if (cells[i][j].STATE == cells[i][j].BEGIN) {
        bf_i = cells[i][j].i;
        bf_j = cells[i][j].j;
      }
    }
  }

  if (flag) {
    if (bf_queue.length != 0 && !bf_end) {
      bf_cell = bf_queue.pop();
      bf_end = visit(bf_cell.i, bf_cell.j, bf_queue);
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    flag = true;
    cells[bf_i][bf_j].visited = true;
    bf_queue.unshift(cells[bf_i][bf_j]);
    bf_cell = cells[bf_i][bf_j];
    bf_end = false;
  }
}

function canVisit(i, j, inext, jnext) {
  if (inext >= 0 && inext < SIZE && jnext >= 0 && jnext < SIZE) {//don't cross the borders
    if (!cells[inext][jnext].visited && cells[inext][jnext].STATE != cells[inext][jnext].WALL) {//don't visit a visited cell or a wall
      if ((inext == i+1 || inext == i || inext == i-1) && (jnext == j+1 || jnext == j ||jnext == j-1)) {//don't move more than one step at a time
        if (inext == i+1 && jnext == j-1 && cells[i+1][j].STATE == cells[i+1][j].WALL && cells[i][j-1].STATE == cells[i][j-1].WALL) {//diag between walls
          return false;
        } else if (inext == i+1 && jnext == j+1 && cells[i+1][j].STATE == cells[i+1][j].WALL && cells[i][j+1].STATE == cells[i][j+1].WALL) {
          return false;
        } else if (inext == i-1 && jnext == j-1 && cells[i-1][j].STATE == cells[i-1][j].WALL && cells[i][j-1].STATE == cells[i][j-1].WALL) {
          return false;
        } else if (inext == i-1 && jnext == j+1 && cells[i-1][j].STATE == cells[i-1][j].WALL && cells[i][j+1].STATE == cells[i][j+1].WALL) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function visit(i, j, queue) {
  if (cells[i][j].STATE != cells[i][j].END) {
    if (canVisit(i, j, i, j-1)) {
      queue.unshift(cells[i][j-1]);
      cells[i][j-1].visited = true;
      if(cells[i][j-1].STATE == cells[i][j-1].END){
       return true; 
      }
    }
    if (canVisit(i, j, i+1, j-1)) {
      queue.unshift(cells[i+1][j-1]);
      cells[i+1][j-1].visited = true;
      if(cells[i+1][j-1].STATE == cells[i+1][j-1].END){
       return true; 
      }
    }
    if (canVisit(i, j, i+1, j)) {
      queue.unshift(cells[i+1][j]);
      cells[i+1][j].visited = true;
      if(cells[i+1][j].STATE == cells[i+1][j].END){
         return true; 
      }
    }
    if (canVisit(i, j, i+1, j+1)) {
      queue.unshift(cells[i+1][j+1]);
      cells[i+1][j+1].visited = true;
      if (cells[i+1][j+1].STATE == cells[i+1][j+1].END) {
        return true;
      }
    }
    if (canVisit(i, j, i, j+1)) {
      queue.unshift(cells[i][j+1]);
      cells[i][j+1].visited = true;
      if (cells[i][j+1].STATE == cells[i][j+1].END) {
        return true;
      }
    }
    if (canVisit(i, j, i-1, j+1)) {
      queue.unshift(cells[i-1][j+1]);
      cells[i-1][j+1].visited = true;
      if (cells[i-1][j+1].STATE == cells[i-1][j+1].END) {
        return true;
      }
    }
    if (canVisit(i, j, i-1, j)) {
      queue.unshift(cells[i-1][j]);
      cells[i-1][j].visited = true;
      if (cells[i-1][j].STATE == cells[i-1][j].END) {
        return true;
      }
    }
    if (canVisit(i, j, i-1, j-1)) {
      queue.unshift(cells[i-1][j-1]);
      cells[i-1][j-1].visited = true;
      if (cells[i-1][j-1].STATE == cells[i-1][j-1].END) {
        return true;
      }
    }
    return false;
  } else {
    return true;
  }
}

class Cell {
  constructor(x, y, i, j, diameter) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.j = j;
    this.diameter = diameter;
    this.xoff = random(1000);
    this.yoff = random(1000);
    this.INIT = 0;
    this.BEGIN = 1;
    this.END = 2;
    this.WALL = 3;
    this.STATE = this.INIT;
    this.visited = false;
  }

  over() {
    var disX = this.x - mouseX;
    var disY = this.y - mouseY;
    if (sqrt(sq(disX) + sq(disY)) < this.diameter/2 ) {
      return true;
    } else {
      return false;
    }
  }

  display() {
    this.xoff = this.xoff + 0.005;
    this.yoff = this.yoff + 0.005;
    if (this.over()) {
      noStroke();
      fill(0, 255, 255, 200);
      circle(this.x, this.y, this.diameter+this.diameter*0.1);
    } else if (this.STATE == this.WALL) {
      noStroke();
      fill(102, 51, 0, 100);
      circle(this.x, this.y, this.diameter);
    } else if (this.STATE == this.BEGIN) {
      noStroke();
      fill(0, 255, 0, 100);
      circle(this.x, this.y, this.diameter);
    } else if (this.STATE == this.END) {
      noStroke();
      fill(255, 0, 0, 100);
      circle(this.x, this.y, this.diameter);
    } else if (this.STATE == this.INIT && this.visited == true) {
      noStroke();
      fill(255, 255, 0, 200);
      circle(this.x, this.y, this.diameter);
    } else {
      noStroke();
      fill(0, 255, 255, 100);
      circle(this.x, this.y, this.diameter-this.diameter*0.1);
      circle(this.x, this.y, this.diameter-this.diameter*0.5);
      circle(this.x - (this.diameter/4) + noise(this.xoff) * (this.diameter*0.5), this.y - (this.diameter/4) + noise(this.yoff) * (this.diameter*0.5), this.diameter-this.diameter*0.8);
    }
  }
}
