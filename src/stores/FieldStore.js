import { makeAutoObservable, computed } from 'mobx'

export default class FieldStore {
  constructor(rootStore) {
    this.root = rootStore
    this.cells = []
    this.size = {
      rows: 5,
      cols: 4,
    }
    makeAutoObservable(this, {
      style: computed,
      cellsAmount: computed,
    })
  }
  
  getCellCoor(index) {
    return this.cells[index].coor
  }
  getNeighbors = (index) => {
    const positionInRow = index % this.size.cols
    return {
      top: index >= this.size.cols ? 
        index - this.size.cols : 
        null,
      bottom: index + this.size.cols < this.cellsAmount ? 
        index + this.size.cols : 
        null,
      left: positionInRow !== 0 ? 
        index - 1 : 
        null,
      right: positionInRow !== (this.size.cols - 1) ? 
        index + 1 : 
        null, 
    }
  }
  getNeighborsIndexes = (index) => {
    const indexes = []
    const neighbors = this.getNeighbors(index)
    for (let key in neighbors) {
      if (neighbors[key] !== null) {
        indexes.push(neighbors[key])
      }
    }
    return indexes
  }
  createCell(row, col) {
    return {
      address: {
        row,
        col,
      },
      coor: {
        xs: col * (this.root.tile.size), 
        ys: row * (this.root.tile.size),
        xe: col * (this.root.tile.size) + this.root.tile.size,
        ye: row * (this.root.tile.size) + this.root.tile.size,
      },
      colorId: null,
      index: this.size.cols * row + col,
      neighbors: this.getNeighborsIndexes(this.size.cols * row + col),
     
      increment: function() {
        this.index+=1
      }
    }
  }
  initCells() {
    for (let i = 0; i < this.size.rows; i++) {
      for (let j = 0; j < this.size.cols; j++) {
        this.cells.push(
          this.createCell(i, j)
        ) 
      }
    }
    console.log(this.cells)
  }
  fillCells() {
    for (let i = 0; i < this.cellsAmount; i++) {
      const {tile, colorId} = this.root.tile.list[this.root.randomNum(5)]
      const {xs, ys} = this.fillRandomEmptyCell(colorId)
      this.root.context.drawImage(tile, xs, ys, this.root.tile.size, this.root.tile.size)
    }
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
      xs, ys, this.root.tile.size, this.root.tile.size
    )
  }
  fillRandomEmptyCell(colorId) {
    const emptyCells = this.cells.filter( item => 
      item.colorId === null
    )
    const numCell = this.root.randomNum(emptyCells.length)
    emptyCells[numCell].colorId = colorId
    const { coor } = emptyCells[numCell]
    return coor
  }

  get style() {
    return {
      width: this.size.cols * this.root.tile.size,
      height: this.size.rows * this.root.tile.size,
    }
  }
  get cellsAmount() {
    return this.size.rows * this.size.cols
  }
}
