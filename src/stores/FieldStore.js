import { makeAutoObservable, computed } from 'mobx'


class Cell {
  constructor(store, row, col) {
    this.store = store
    this.address = {
      row,
      col,
    }
    this.coor = {
      xs: col * (this.store.cellSize), 
      ys: row * (this.store.cellSize),
      xe: col * (this.store.cellSize) + this.store.cellSize,
      ye: row * (this.store.cellSize) + this.store.cellSize,
    }
    this.colorId = null
    this.tile = null
    this.index = this.store.size.cols * row + col
    this.neighbors = this.getNeighborsIndexes()
  }
  isEmpty() {
    return this.tile === null ? true : false
  }
  getCoord() {
    return this.coor
  }
  setTile(tile) {
    this.tile = tile
  }
  getTile() {
    return this.tile
  }
  deleteTile() {
    this.tile = null
  }
  getNeighbors() {
    const positionInRow = this.index % this.store.size.cols
    return {
      top: this.index >= this.store.size.cols ? 
        this.index - this.store.size.cols : 
        null,
      bottom: this.index + this.store.size.cols < this.store.cellsAmount ? 
        this.index + this.store.size.cols : 
        null,
      left: positionInRow !== 0 ? 
        this.index - 1 : 
        null,
      right: positionInRow !== (this.store.size.cols - 1) ? 
        this.index + 1 : 
        null, 
    }
  }
  getNeighborsIndexes() {
    const indexes = []
    const neighbors = this.getNeighbors(this.index)
    for (let key in neighbors) {
      if (neighbors[key] !== null) {
        indexes.push(neighbors[key])
      }
    }
    return indexes
  }
  showData() {
    console.log(this.colorId)
  }
}
class Tile {
  constructor(store, indexCell) {
    this.store = store
  }
  getCoord() {
    return this.store.cells[this.indexCell].coor
  }
}
export default class FieldStore {
  cells = []
  cellSize = 70
  size = {
    rows: 5,
    cols: 4,
  }
  constructor(rootStore) {
    this.root = rootStore
    makeAutoObservable(this, {
      style: computed,
      cellsAmount: computed,
    })
  }
  
  getCellCoor(index) {
    return this.cells[index].coor
  }
  initCells() {
    for (let i = 0; i < this.size.rows; i++) {
      for (let j = 0; j < this.size.cols; j++) {
        this.cells.push(
          new Cell(this, i, j)
        ) 
      }
    }
    console.log(this.cells)
  }
  fillRandomEmptyCell(colorId) {//()
    const emptyCells = this.cells.filter( cell => 
      cell.colorId === null //cell.isEmpty
    )
    const indexCell = this.root.randomNum(emptyCells.length)
    emptyCells[indexCell].colorId = colorId//emptyCells[numCell].tile = new Tile()
    emptyCells[indexCell].tile = emptyCells[indexCell].tile = new Tile(this, indexCell)
    const { coor } = emptyCells[indexCell]
    return coor
  }
  fillCells() {
    this.cells.map((cell) => {
      const {tile, colorId} = this.root.tile.list[this.root.randomNum(5)]
      const {xs, ys} = this.fillRandomEmptyCell(colorId)
      this.root.context.drawImage(tile, xs, ys, this.cellSize, this.cellSize)
    })
  }
  clearField() {
    this.cells.map(cell => cell.colorId = null)
    this.root.context.clearRect(
      0, 0, this.root.canvas.width, this.root.canvas.height
    )
  }
  clearTile(index) { 
    const {xs, ys} =  this.getCellCoor(index)
    this.cells[index].colorId = null
    this.root.context.clearRect(
      xs, ys, this.cellSize, this.cellSize
    )
  }
  

  get style() {
    return {
      width: this.size.cols * this.cellSize,
      height: this.size.rows * this.cellSize,
    }
  }
  get cellsAmount() {
    return this.size.rows * this.size.cols
  }
}


//createCell(row, col) {
  //  return {
  //    address: {
  //      row,
  //      col,
  //    },
  //    coor: {
  //      xs: col * (this.root.tile.size), 
  //      ys: row * (this.root.tile.size),
  //      xe: col * (this.root.tile.size) + this.root.tile.size,
  //      ye: row * (this.root.tile.size) + this.root.tile.size,
  //    },
  //    colorId: null,
  //    index: this.size.cols * row + col,
  //    neighbors: this.getNeighborsIndexes(this.size.cols * row + col),
  //   
  //    increment: function() {
  //      this.index+=1
  //    }
  //  }
  //}