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
          }
        ) 
      }
    }
  }
  clearField() {
    this.cells.map(cell => cell.colorId = null)
    this.root.context.clearRect(0, 0, this.root.canvas.width, this.root.canvas.height)
  }
  clearTile(x, y) { 
    this.root.context.clearRect(x, y, this.root.tile.size, this.root.tile.size)
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
