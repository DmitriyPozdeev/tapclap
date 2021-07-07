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
  
  calcIndexesNeighbors = (index) => {
    const indexes = []
    const positionInRow = index % this.size.cols
    const neighbors = {
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
    for (let key in neighbors) {
      if (neighbors[key] !== null) {
        indexes.push(neighbors[key])
      }
    }
    return indexes
  }
  initCells() {
    for (let i = 0; i < this.size.rows; i++) {
      for (let j = 0; j < this.size.cols; j++) {
        this.cells.push(
          {
            address: {
              row: i,
              col: j,
            },
            coordinates: {
              xs: j * (this.root.tile.size + 1), 
              ys: i * (this.root.tile.size + 1),
              xe: j * (this.root.tile.size + 1) + this.root.tile.size,
              ye: i * (this.root.tile.size + 1) + this.root.tile.size,
            },
            colorId: null,
            neighbors: [],
            index:  null
          }
        ) 
      }
    }
    this.cells.map( (cell, i) => {
      cell.index = i
      cell.neighbors = this.calcIndexesNeighbors(i)
    })
    console.log(this.cells)
  }
  clearField() {
    this.cells.map(cell => cell.colorId = null)
    this.root.context.clearRect(0, 0, this.root.canvas.width, this.root.canvas.height)
  }
  clearTile(index) { 
    const {xs, ys} = this.cells[index].coordinates
    this.cells[index].colorId = null
    this.root.context.clearRect(xs, ys, this.root.tile.size, this.root.tile.size)
    console.log(this.cells)
  }
  fillRandomEmptyCell(fill) {
    const emptyCells = this.cells.filter( item => 
      item.colorId === null
    )
    const numCell = this.root.randomNum(emptyCells.length)
    emptyCells[numCell].colorId = fill
    return emptyCells[numCell]
  }

  get style() {
    return {
      width: this.size.cols * this.root.tile.size + this.size.cols,
      height: this.size.rows * this.root.tile.size + this.size.rows,
    }
  }
  get cellsAmount() {
    return this.size.rows * this.size.cols
  }
}
