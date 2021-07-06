import { makeAutoObservable, computed } from 'mobx'
import TileStore from './TileStore'
import FieldStore from './FieldStore'

export default class RootStore {
  constructor() {
    this.canvas = null
    this.context = null
    this.tile = new TileStore(this)
    this.field = new FieldStore(this)
    this.minDestroy = 2
    makeAutoObservable(this, {
      canvasCoordinates: computed,
    }) 
  }

  randomNum(max) {
    return Math.floor(Math.random() * max) 
  }
  mixTiles() {
    const colorIds = this.field.cells
    .slice()
    .sort(() => Math.random() - 0.5)
    .map( item => item.colorId)
    this.field.clearField()
    colorIds.map( colorId => {
      const {xs, ys} = this.field.fillRandomEmptyCell(colorId).coordinates
      const {tile} = this.tile.list[colorId]
      this.context.drawImage(tile, xs, ys, this.tile.size, this.tile.size)
    })
  }
  initGame({canvas, context}) {
    this.canvas = canvas
    this.context = context
  }
  filterColor(id) {
    return this.field.cells.slice().filter(cell => {
      return cell.colorId === id
    })
  } 
  findNeighbors(currentCell) {
   const group = this.filterColor(currentCell.colorId)

    const neighbors = group.filter(cell => {
      return (
        (cell.address.row === currentCell.address.row + 1 &&
        cell.address.col === currentCell.address.col) ||
        (cell.address.row === currentCell.address.row - 1 &&
        cell.address.col === currentCell.address.col) ||
        (cell.address.col === currentCell.address.col + 1 &&  
        cell.address.row === currentCell.address.row) || 
        (cell.address.col === currentCell.address.col - 1 &&
        cell.address.row === currentCell.address.row)
      )
    })
    return neighbors
  }
  find(currentCell) {
    const group = this.filterColor(currentCell.colorId)
    const index = this.field.cells.indexOf(currentCell)
    const length = this.field.cells.length
    console.log(index%4, index/4)
  }
  click(e) {
    const event = {
      x: e.clientX - this.canvasCoordinates.x,
      y: e.clientY - this.canvasCoordinates.y,
    }
    const clickedCell = this.field.cells.find(cell => {
      return (
        (cell.coordinates.xs <= event.x) &&  
        (cell.coordinates.xe >= event.x) &&
        (cell.coordinates.ys <= event.y) &&  
        (cell.coordinates.ye >= event.y)
      )
    })
    this.find(clickedCell)
  }  
  run() {
    window.requestAnimationFrame(() => {
      this.render()
    })
  } 
  render() {
    for (let i = 0; i < this.field.cellsAmount; i++) {
      const {tile, colorId} = this.tile.list[this.randomNum(5)]
      const {xs, ys} = this.field.fillRandomEmptyCell(colorId).coordinates
      this.context.drawImage(tile, xs, ys, this.tile.size, this.tile.size)
    }
    console.log(this.field.cells)
  }
  start({canvas, context}) {
    this.initGame({canvas, context})
    this.field.initCells()
    this.tile.preload()
    .then(() => this.run())
    
  }
  get canvasCoordinates () {
    return this.canvas.getBoundingClientRect()
  }
}
