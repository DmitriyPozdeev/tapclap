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
      tilesAmount: computed,
    })
  }
  initCells() {
    for (let i = 0; i < this.size.rows; i++) {
      for (let j = 0; j < this.size.cols; j++) {
        this.cells.push(
          {
            address: {
              row: i,
              coll: j,
            },
            coordinates: {
              x: j * (this.root.tile.size + 1), 
              y: i * (this.root.tile.size + 1),
            },
            colorId: null,
          }
        ) 
      }
    }
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
  get tilesAmount() {
    return this.size.rows * this.size.cols
  }
}
