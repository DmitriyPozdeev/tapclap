import { makeAutoObservable, computed } from 'mobx'
import Cell from '../entitys/Cell'

export default class FieldStore {
  cells = []
  cols = []
  cellSize = 60
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
  updateCells(tileList) {
    this.cells.map((cell, i) => {
      cell.tile = tileList[i]
      tileList[i].index = cell.index
      return cell
    })
    console.log(tileList )
  }
  //getCol(arr, num) {
  //  return arr.slice().filter((cell) => {
  //    return cell.index % this.size.cols === num 
  //  })
  //}
  initFieldCols() {
    for (let i = 0; i < this.size.cols; i++) {
      this.cols.push(
        this.cells.filter(cell => {
          return cell.address.col === i
        })
      )
    }
    console.log(this.cols)
  }
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
    const newColTileArr = this.root.tile.cols.map((col) => {
      return col.filter((row) => {
        const {tile} = this.getIndexData(row.index)
        return  tile !== undefined
      })
    })
    newColTileArr.forEach((col, colNum) => {
      const diff = this.size.cols - col.length
      for(let i = 0; i <= diff; i++) {
        const tile = {
          colorId: this.root.randomNum(
            this.root.tile.imgList.length
          ),
          index: colNum + (i * this.size.cols),
          x: colNum * this.cellSize,
          y: -(i + 1) * this.cellSize, 
        }
        console.log(colNum, i, this.size.cols)
        col.unshift(tile)
      }
    })
    const newList = []
    for (let i = 0; i < this.size.rows; i++) {
      newColTileArr.forEach((col => {
        newList.push(col[i])
      }))
    }
    console.log(newList)
    this.root.tile.currentList = newList
    this.updateCells(newList)
    this.cells.forEach(cell => {
      cell.alignTile()
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
  createTile(cell) {
    cell.tile.colorId = this.root.randomNum(
      this.root.tile.imgList.length
    )
    return cell
  }
  fillCells() {
    this.cells.forEach((cell) => {
      this.createTile(cell)
    })
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
    console.log(targetCell)
    const { index } = targetCell
    const clearedCells = this.root.bfs(index)
    const amountClearedCells = clearedCells.length
    if (amountClearedCells >= this.root.minDestroy) {
      clearedCells.forEach( (index) => {
        this.clearCell(index)
      })
    this.root.setPoints(amountClearedCells)
    this.root.setAttempts()
    }
    //const nw = this.root.tile.cols.map(col => {
    //  const diff = this.size.cols - col.length
    //  
    //})
    console.log(this.root.tile.cols)
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
