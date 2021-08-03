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
    console.log(this.cells)
  }

  defineTargetCell(e) {
    const eventCoord = {
      x: e.clientX - this.root.canvasCoor.x,
      y: e.clientY - this.root.canvasCoor.y,
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
    const targetCell = this.defineTargetCell(e)
    const { index } = targetCell
    const delIndexes = this.root.bfs(index)
    if(delIndexes) {
      this.root.isAnimate = true
      this.root.tile.setCurrentDelete(delIndexes)
      for (let i = 0; i < this.size.rows; i++) {
        for (let j = 0; j < this.size.cols; j++) {
          if (this.root.tile.currentDelete
               .includes(i * this.size.cols + j)) {
            this.cells[i * this.size.cols + j].captureImage()
            delete this.root.tile.currentList[i][j]
          }
        }
      }
      setTimeout(() => {
        this.root.setPoints(delIndexes.length)
        this.root.setMoves()
        this.root.tile.currentList = this.root.tile.currentList
        .map((row) => {
          return row.filter(tile => tile)
        })
      }, 300)
    }
  }  
  mix() {
    this.root.tile.mixCurrentList()
    this.root.mixCount -= 1
    //const newTileList = this.root.tile.currentList.slice()
    //const tempCellList = this.cells.slice()
    //newTileList.forEach((row, i) => {
    //  row.forEach((tile, j) => {
    //    tile.xs = this.size.cols * this.cellSize
    //    tile.index = 90
    //    tile.ys = this.cells[i * this.root.field.size.cols + j].getCoord().ys
    //    tempCellList.filter(cell => cell.index !== tile.index)
    //  })
    //})
    //this.root.tile.currentList = newTileList
  }
  chess() {
    this.root.tile.chessCurrentList()
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
