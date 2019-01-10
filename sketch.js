let grid = [];
let horizontal = 10;
let vertical = 10;
let gap = 2;

let xGridScale;
let yGridScale;

function preload() {
  font = loadFont("assets/monof56.ttf");
}

function setup() {
  document.title = "Minesweeper 2.0";
  let canvas = createCanvas(700, 700);
  generate(horizontal, vertical);
  print(grid);

  xGridScale = (width - 0.5 * gap) / horizontal;
  yGridScale = (height - 0.5 * gap) / vertical;
}

function draw() {
  background(0);
  if (!checkIfWon()) {
    drawGrid();
  } else {
    print("You won!");
    drawVictory();
    noLoop();
  }
}

class gridElement {
  constructor(_x, _y, _isBomb) {
    this.checked = false;
    this.marked = false;
    this.x = _x;
    this.y = _y;
    this.isBomb = _isBomb;
  }

  check() {
    this.checked = true;
  }
}

function generate(horizontal, vertical) {
  for (let i = 0; i < horizontal; i++) {
    for (let j = 0; j < vertical; j++) {
      print(i, j);
      grid.push(new gridElement(j, i, random(0, 5) <= 1));
    }
  }
}

function drawGrid() {
  for (let index = 0; index < grid.length; index++) {
    let textEnabled = false;
    if (grid[index].marked) {
      fill(0, 0, 255);
    } else if (!grid[index].checked) {
      fill(100);
    } else if (grid[index].isBomb) {
      fill(255, 0, 0);
    } else {
      fill(0);
      textEnabled = true;
    }
    stroke(0);
    strokeWeight(gap);
    rect(grid[index].x * (xGridScale),
      grid[index].y * (yGridScale),
      grid[index].x * (xGridScale) + xGridScale,
      grid[index].y * (yGridScale) + yGridScale);

    if (textEnabled) {
      push();
      textSize(20);
      textAlign(CENTER);
      stroke(255);
      fill(255);
      strokeWeight(1);
      text(getNeighbourBombs(grid[index].x, grid[index].y), grid[index].x * xGridScale + 0.5 * xGridScale, grid[index].y * yGridScale + 0.5 * yGridScale);
      pop();
    }
  }
  noFill();
  stroke(0);
  rect(0, 0, width - gap / 2, height - gap / 2);
}

function mousePressed() {
  if (mouseButton == LEFT) {
    for (let index in grid) {
      if (mouseX >= grid[index].x * xGridScale && mouseY >= grid[index].y * yGridScale && mouseX <= grid[index].x * (xGridScale) + xGridScale && mouseY <= grid[index].y * (yGridScale) + yGridScale) {
        let neighbours = getNeighbours(grid[index].x, grid[index].y);
        let neighbourBombs = getNeighbourBombs(grid[index].x, grid[index].y);
        let currentGrid = grid[index];

        if (!currentGrid.marked) currentGrid.checked = true;

        if (currentGrid.isBomb) {
          print("You lost!");

          for (let i in grid) {
            grid[i].checked = true;
            grid[i].marked = false;
          }
        }

        if (neighbourBombs == 0 && !currentGrid.isBomb) {
          for (let index2 in grid) {
            let neighbourBombs2 = getNeighbourBombs(grid[index2].x, grid[index2].y);
            let currentGrid2 = grid[index2];

            if (neighbourBombs2 == 0 && !currentGrid2.isBomb) {
              let neighbours = getNeighbours(currentGrid2.x, currentGrid2.y);
              for (let index3 in neighbours) {
                neighbours[index3].checked = true;
              }
            }
          }
        }
      }
    }
  } else if (mouseButton == RIGHT) {
    for (let index in grid) {
      if (mouseX >= grid[index].x * xGridScale && mouseY >= grid[index].y * yGridScale && mouseX <= grid[index].x * (xGridScale) + xGridScale && mouseY <= grid[index].y * (yGridScale) + yGridScale) {
        if (!grid[index].checked) grid[index].marked = !grid[index].marked;
        else return;
      }
    }
  }
}

function getNeighbourBombs(x, y) {
  let count = 0;
  for (let i in grid) {
    if (grid[i].x == x - 1 && grid[i].y == y - 1 && grid[i].isBomb) count++;
    if (grid[i].x == x && grid[i].y == y - 1 && grid[i].isBomb) count++;
    if (grid[i].x == x + 1 && grid[i].y == y - 1 && grid[i].isBomb) count++;
    if (grid[i].x == x - 1 && grid[i].y == y && grid[i].isBomb) count++;
    if (grid[i].x == x + 1 && grid[i].y == y && grid[i].isBomb) count++;
    if (grid[i].x == x - 1 && grid[i].y == y + 1 && grid[i].isBomb) count++;
    if (grid[i].x == x && grid[i].y == y + 1 && grid[i].isBomb) count++;
    if (grid[i].x == x + 1 && grid[i].y == y + 1 && grid[i].isBomb) count++;
  }

  return count;
}

function getNeighbours(x, y) {
  let neighbours = [];
  for (let i in grid) {
    if (grid[i].x == x - 1 && grid[i].y == y - 1) neighbours.push(grid[i]);
    if (grid[i].x == x && grid[i].y == y - 1) neighbours.push(grid[i]);
    if (grid[i].x == x + 1 && grid[i].y == y - 1) neighbours.push(grid[i]);
    if (grid[i].x == x - 1 && grid[i].y == y) neighbours.push(grid[i]);
    if (grid[i].x == x + 1 && grid[i].y == y) neighbours.push(grid[i]);
    if (grid[i].x == x - 1 && grid[i].y == y + 1) neighbours.push(grid[i]);
    if (grid[i].x == x && grid[i].y == y + 1) neighbours.push(grid[i]);
    if (grid[i].x == x + 1 && grid[i].y == y + 1) neighbours.push(grid[i]);
  }
  return neighbours;
}

function checkIfWon() {
  let bool = true;
  for (let i in grid) {
    if ((grid[i].marked && !grid[i].isBomb) || (!grid[i].marked && grid[i].isBomb) || (!grid[i].checked && !grid[i].marked)) {
      bool = false;
      break;
    }
  }
  return bool;
}

function drawVictory() {
  for (let index = 0; index < grid.length; index++) {
    let textEnabled = false;
    if (grid[index].isBomb) {
      fill(0, 255, 0);
    } else {
      fill(0);
      textEnabled = true;
    }
    stroke(0);
    strokeWeight(gap);
    rect(grid[index].x * (xGridScale),
      grid[index].y * (yGridScale),
      grid[index].x * (xGridScale) + xGridScale,
      grid[index].y * (yGridScale) + yGridScale);

    if (textEnabled) {
      push();
      textSize(20);
      textAlign(CENTER);
      stroke(255);
      fill(255);
      strokeWeight(1);
      text(getNeighbourBombs(grid[index].x, grid[index].y), grid[index].x * xGridScale + 0.5 * xGridScale, grid[index].y * yGridScale + 0.5 * yGridScale);
      pop();
    }
  }
  noFill();
  stroke(0);
  rect(0, 0, width - gap / 2, height - gap / 2);
}
