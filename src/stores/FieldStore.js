import { makeAutoObservable, computed } from 'mobx'
import Cell from '../entitys/Cell'

export default class FieldStore {
  _cells = []
  _cellSize = 60
  _isAnimate = false
  _size = {
    rows: 10,
    cols: 9,
  }
  constructor(rootStore) {
    this.root = rootStore
    makeAutoObservable(this, {
      cellsAmount: computed,
    })
  }
  initCells() {
    for (let row = 0; row < this.size.rows; row++) {
      for (let col = 0; col < this.size.cols; col++) {
        this.cells.push(
          new Cell(this, row, col)
        ) 
      }
    }
  } 
  setAnimate(bool) {
    this._isAnimate = bool
  }
  defineTargetCell(e) {
    const eventCoord = {
      x: e.clientX - this.root.game.canvasCoord.x,
      y: e.clientY - this.root.game.canvasCoord.y,
    }
    return this.cells.find(cell => {
      const { xs, xe, ys, ye } = cell.coord
      return (
        (xs <= eventCoord.x) &&  
        (xe >= eventCoord.x) &&
        (ys <= eventCoord.y) &&  
        (ye >= eventCoord.y)
      )
    })
  }
  click(e) {
    const cols = this.size.cols
    const targetCell = this.defineTargetCell(e)
    const { index } = targetCell
    const delIndexes = this.root.game.searchValidTiles(index)
    const amountDelIndexes = delIndexes.length

    if(amountDelIndexes > 0 && !this.isAnimate) {
      this.setAnimate(true)
      this.root.tile.setCurrentDelete(delIndexes)
      
      this.root.tile.currentList.forEach((row, numRow) => {
        row.forEach((_, numCol) => {
          if (this.root.tile.currentDelete
            .includes(numRow * cols + numCol)) {
            this.cells[numRow * cols + numCol].captureImage()
            delete this.root.tile.currentList[numRow][numCol]
          }
        })
      })

      const newTileList = this.root.tile.currentList
        .map((row) => {
          return row.filter(tile => tile)
        })

      setTimeout(() => {
        this.root.user.setPoints(amountDelIndexes)
        this.root.user.setMovesCount()
        this.root.tile.setCurrentList(newTileList)
      }, 250)
    }
  }  
  get cellsAmount() {
    return this.size.rows * this.size.cols
  }
  get size() {
    return this._size
  }
  get cellSize() {
    return this._cellSize
  }
  get cells() {
    return this._cells
  }
  get isAnimate() {
    return this._isAnimate
  }
}
