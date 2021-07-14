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
  //getCol(arr, num) {
  //  return arr.slice().filter((cell) => {
  //    return cell.index % this.size.cols === num 
  //  })
  //}
  //initFieldCols() {
  //  for (let i = 0; i < this.size.cols; i++) {
  //    this.cols.push(this.getCol(this.cells, i))
  //  }
  //}
  //initTileCols() {
  //  for (let i = 0; i < this.size.cols; i++) {
  //    this.root.tile.cols.push(this.getCol(this.root.tile.currentList, i))
  //  }
  //}
  //addTile(index) {
  //  const {cell} = this.getIndexData(index)
  //  const {xs, ys} = cell
  //  this.root.tile.currentList[index] = {
  //    x: xs,
  //    y: ys,
  //    colorId: 1,
  //    index,
  //  }
  //} 
  mixTiles() {
    //this.clearField()
    console.log(this.cells[6].tile.index)
    const arrTiles = this.cols.map(cell => cell.tile)
    console.log(arrTiles)
    const newColArr = this.root.tile.cols.map((col, iCol) => {
      return col.filter((row) => {
        const {tile} = this.getIndexData(row.index)
        return  tile !== undefined
      })
      //col.forEach((row, iTile) => {
      //  const {tile} = this.getIndexData(row.index)
//
      //  console.log(iCol, iTile, tile)//this.root.tile.currentList[row.index])
      //})
    })
    console.log(newColArr)
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
    cell.tile.colorId = this.root.randomNum(
      this.root.tile.imgList.length
    )
    return cell
  }
  fillCells() {
    const newCellList = this.cells.map((cell) => {
      return this.createTile(cell)
    })
    const tileList = newCellList.map(cell => cell.tile)
    this.root.tile.setCurrentList(tileList)
  }
  
  clearField() {
    this.root.tile.currentList = []
  }
  clearCell(index) { 
    delete this.root.tile.currentList[index]
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
  getIndexData(index) {
    return {
      tile: this.root.tile.currentList[index],
      cell: this.cells[index],

    }
  }
  click(e) {
    const targetCell = this.defineTargetCell(e)
    const { index } = targetCell
    const clearedCells = this.root.bfs(index)//const clearedCells = this.root.bfs(cell)//
    const {tile} = this.getIndexData(index)
    const amountClearedCells = clearedCells.length
    if (amountClearedCells >= this.root.minDestroy) {//if(amountClearedCells > this.root.minDestroy && targetCell.colorId !== null) {}

      clearedCells.forEach( (index) => {
        this.clearCell(index)
      })
    
    //this.root.setPoints(amountClearedCells)
    //this.root.setAttempts()
    //  deletedTiles.sort((a, b) => b-a).map(index => {
    //    const positionInRow = index % this.size.cols
    //    console.log(this.cells[this.cells[index].getNeighbors().top]?.isEmpty())
  //
    // })
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
