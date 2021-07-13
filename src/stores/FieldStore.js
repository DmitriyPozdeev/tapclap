import { makeAutoObservable, computed } from 'mobx'
import Cell from '../entitys/Cell'
import Tile from '../entitys/Tile'


export default class FieldStore {
  cells = []
  cols = []
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
  getCol(num) {
    return this.cells.slice().filter((cell) => {
      return cell.index % this.size.cols === num 
    })
  }
  initCols() {
    for (let i = 0; i < this.size.cols; i++) {
      this.cols.push(this.getCol(i))
    }
  }
  mixTiles() {
    
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
  createTile(cell) {
    const {xs, ys} = cell.getCoord()
    return {
      x: xs,
      y: ys,
      index: cell.index,
      colorId: this.root.randomNum(
        this.root.tile.imgList.length
      ),
    }
  }
  fillCells() {
    this.cells.forEach((cell) => {
      this.root.tile.tiles.push(
        this.createTile(cell)
      )
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
    return this.cells.flat().find(cell => {
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
    this.root.isAnimation = true
    const targetCell = this.defineTargetCell(e)
    console.log(targetCell)
    console.log(this.cells.flat().sort((a, b) => a.index - b.index))
    const { index } = targetCell
    //this.root.tile.tiles.splice(index, 1, {
    //  x: targetCell.getCoord().xs,
    //  y: -50,
    //  colorId: this.root.randomNum(
    //    this.root.tile.imgList.length
    //  )
    //})
    const tileInCell = this.root.tile.tiles[index]
    const deletedTiles = this.root.bfs(index)//const clearedCells = this.root.bfs(cell)
    console.log(deletedTiles)
    //const lengthTiles = deletedTiles.length // const amountClearedCells = clearedCells.length
    //if (lengthTiles >= this.root.minDestroy && targetCell.colorId !== null) {//if(amountClearedCells > this.root.minDestroy && targetCell.colorId !== null) {}
    //  deletedTiles.map( index => this.clearTile(index)) //clearedCells.map( cell => cell.clearTile())
    //  this.ofsetRow()
    //  this.root.setPoints(lengthTiles)
    //  this.root.setAttempts()
    //  deletedTiles.sort((a, b) => b-a).map(index => {
    //    const positionInRow = index % this.size.cols
    //    console.log(this.cells[this.cells[index].getNeighbors().top]?.isEmpty())
  //
    //  })
    //}
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
