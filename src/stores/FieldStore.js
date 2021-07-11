import { makeAutoObservable, computed } from 'mobx'
import Cell from '../entitys/Cell'
import Tile from '../entitys/Tile'


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
  mixTiles() {
    const colorIds = this.cells
    .slice()
    .sort(() => Math.random() - 0.5)
    .map( item => item.colorId)
    this.clearField()
    colorIds.map( colorId => {
      const {xs, ys} = this.fillRandomEmptyCell(colorId)
      const {tile} = new Tile(this.root, colorId)
      this.root.context.drawImage(tile, xs, ys, this.cellSize, this.cellSize)
    })
  }
  fillRandomEmptyCell(colorId) {//()
    const emptyCells = this.cells.filter( cell => 
      cell.colorId === null //cell.isEmpty
    )
    const indexCell = this.root.randomNum(emptyCells.length)
    emptyCells[indexCell].colorId = colorId
    const { coor } = emptyCells[indexCell]
    return coor
  }
  fillCells() {
    this.cells.map((cell) => {
      const {tile, colorId} = new Tile(this.root)
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
    this.root.isAnimation = true
    const { index } = targetCell
    const deletedTiles = this.root.bfs(index)
    const lengthTiles = deletedTiles.length
    if (lengthTiles >= this.root.minDestroy && targetCell.colorId !== null) {
      deletedTiles.map( index => this.clearTile(index))
      this.root.setPoints(lengthTiles)
      this.root.setAttempts()
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
