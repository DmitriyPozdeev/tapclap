import { makeAutoObservable, computed } from 'mobx'
import Cell from '../entitys/Cell'

export default class FieldStore {
  cells = []
  cols = []
  cellSize = 60
  size = {
    rows: 10,
    cols: 9,
  }
  isAnimate = false
  constructor(rootStore) {
    this.root = rootStore
    makeAutoObservable(this, {
      style: computed,
      cellsAmount: computed,
    })
  }
  initCells() {
    for (let i = 0; i < this.size.rows; i++) {
      for (let j = 0; j < this.size.cols; j++) {
        this.cells.push(
          new Cell(this, i, j)
        ) 
      }
    }
  }

  defineTargetCell(e) {
    const eventCoord = {
      x: e.clientX - this.root.canvasCoord.x,
      y: e.clientY - this.root.canvasCoord.y,
    }
    return this.cells.find(cell => {
      const { xs, xe, ys, ye } = cell.getCoord()
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
    const rows = this.size.rows
    const targetCell = this.defineTargetCell(e)
    const { index } = targetCell
    const delIndexes = this.root.searcValidTile(index)
    const amountDelIndexes = delIndexes.length

    if(amountDelIndexes > 0 && !this.isAnimate) {
      this.isAnimate = true
      this.root.tile.setCurrentDelete(delIndexes)
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (this.root.tile.currentDelete
               .includes(i * cols + j)) {
            this.cells[i * cols + j].captureImage()
            delete this.root.tile.currentList[i][j]
          }
        }
      }

      const newTileList = this.root.tile.currentList
        .map((row) => {
          return row.filter(tile => tile)
        })

      setTimeout(() => {
        this.root.setPoints(amountDelIndexes)
        this.root.setProgress()
        this.root.setMoves()
        this.root.tile.setCurrentList(newTileList)
      }, 250)
    }
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
