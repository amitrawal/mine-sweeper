var Board = function(r, c, totalMines) {
  this.rows = r;
  this.cols = c;
  this.cells = [];
  this.totalMines = totalMines;
  reset();
};

Board.STATUS_ENDED    = 1;
Board.STATUS_STARTED  = 0;

Board.prototype.reset = function() {
  var gridSize = this.rows * this.cols, i;
  for(i = 0; i < gridSize; i++) {
    this.cells.puth(new Cell());
  }  
  this.placeMines();
}

Board.prototype.turnOnCell = function(index) {
  var cell = this.cells[index];

  if(cell.status == Cell.STATUS_ON)    
    return;
  
  cell.turnOn();  
    
  if(cell.type == Cell.TYPE_MINE) {
    this.status = Board.STATUS_ENDED;
    return;
  }
  
  if(cell.type == Cell.TYPE_EMPTY) {
    this.turnOnAdjacentCells(index);
  }    
}

Board.prototype.turnOnAdjacentCells = function(index) {
  var cellIndexes = this.getAdjacentCellIndexes(index),
      i = 0,
      cell = null;

  for(i = 0; i < cellIndexes.length; i++) {
    cell = this.cells[i];

    if(cell.status == Cell.STATUS_ON) {
      continue;
    }

    if(cell.type == Cell.TYPE_EMPTY) {
      cell.turnOn();
      this.turnOnAdjacentCells(i);      
    } else if(cell.type == Cell.TYPE_MARKED) {
      cell.turnOn();
    }
  }
}

Board.prototype.placeMines = function() {  
    // Creates an array with each element initialized to its index value.
    var gridIndexes = Array.apply(null, {length: cells.length}).map(Number.call, Number),
        minePositions = sample(gridIndexes, this.totalMines),
        i = 0;
    
    for(i = 0; i < minePositions.length; i++) {
      cells[i].type = Cell.TYPE_MINE;
      this.markAdjacentCells(i);
    }    
}

Board.prototype.markAdjacentCells = function(index) {
  var adjacentCellIndexes = this.getAdjacentCellIndexes(index),
      i = 0;

  for(i = 0; i < adjacentCellIndexes.length; i++) {
    if(this.canMarkCell(i)) {
      this.cells[i].mark();
    }    
  }
}

Board.prototype.getAdjacentCellIndexes = function(index) {
    var tmp = this.getRowCol(index),
        row = tmp.row,
        col = tmp.col;

    cellIndexes = [];
    cellIndexes.push(this.getRelativeIndex(row, col, 'above'));
    cellIndexes.push(this.getRelativeIndex(row, col, 'bottom'));    
    cellIndexes.push(this.getRelativeIndex(row, col, 'left'));    
    cellIndexes.push(this.getRelativeIndex(row, col, 'right'));
    cellIndexes.push(this.getRelativeIndex(row, col, 'above_left'));
    cellIndexes.push(this.getRelativeIndex(row, col, 'above_right'));
    cellIndexes.push(this.getRelativeIndex(row, col, 'bottom_left'));
    cellIndexes.push(this.getRelativeIndex(row, col, 'bottom_right'));
    return cellIndexes;
}

Board.prototype.getRowCol = function(fromIndex) {
  var r = fromIndex /this.cols,
      c = fromIndex % this.cols;

  return {
    row: r + 1, 
    col: c + 1
  };
}

Board.prototype.getCell = function(r, c) {  
    return (r -1) * this.cols + (c -1);
}

Board.prototype.getRelativeIndex = function(row, col, direction) {
  var relativeIndex = -1;
  switch(direction) {
    case 'above':
      relativeIndex = row - 1 > 0 ? this.getCell(row - 1, col) : -1;
      break;
    case 'bottom':
      relativeIndex = row + 1 <= this.rows ? this.getCell(row + 1, col) : -1;
      break;
    case 'left':
      relativeIndex = col - 1 > 0 ? this.getCell(row, col - 1)  : -1;
      break;
    case 'right':
      relativeIndex = col + 1 <= this.cols ? this.getCell(row, col + 1)  : -1;
      break;
    case 'above_left':
      relativeIndex = (row - 1 > 0 && col - 1 > 0) ? this.getCell(row - 1, col - 1)  : -1;
      break;
    case 'above_right':
      relativeIndex = (row - 1 > 0 && col + 1 <= this.cols) ? this.getCell(row - 1, col + 1)  : -1;
      break;
    case 'bottom_left':
      relativeIndex = (row + 1 <= this.rows && col - 1 > 0) ? this.getCell(row + 1, col - 1)  : -1;
      break;
    case 'bottom_right':
      relativeIndex = (row + 1 <= this.rows && col +1 <= this.cols) ? this.getCell(row + 1, col + 1)   : -1
      break;
  }

  return relativeIndex;
}

Board.prototype.canMarkCell = function(index) {
    return !isOutOfBounds(index) && this.cells[index].type != Cell.TYPE_MINE;
}

Board.prototype.isOutOfBounds = function(index) {
  return index < 0 || index >= this.cells.length;
}


// Cell class
var Cell = function() {
  this.type = type;
  this.tag = 0;
  this.status = Cell.STATUS_OFF
}

Cell.STATUS_OFF   = 0;
Cell.STATUS_ON    = 1;
Cell.TYPE_EMPTY   = 0;
Cell.TYPE_MINE    = 1;
Cell.TYPE_MARKED  = 2;

Cell.prototype.mark = function() {
  this.type = Cell.TYPE_MARKED;
  this.tag = this.tag + 1;
}

Cell.prototype.turnOn = function() {
  this.status = Cell.STATUS_ON
}

Cell.prototype.display = function() {
  return ' ' if this.status == Cell.STATUS_OFF;
  switch(this.type) {
    case Cell.TYPE_MINE:
      return '* ';
      break;
    case Cell.TYPE_MARKED
      return this.tag.toString();
      break;
    default:
      return "0";
  }
}


function sample(array, size) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }

    return array.slice(0, size);
}