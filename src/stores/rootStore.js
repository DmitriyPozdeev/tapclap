import { makeAutoObservable, computed } from 'mobx'
import TileStore from './TileStore'
import FieldStore from './FieldStore'

export default class RootStore {
  constructor() {
    this.canvas = null
    this.context = null
    this.tile = new TileStore(this)
    this.field = new FieldStore(this)
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
  click(e) {
    const event = {
      x: e.clientX - this.canvasCoordinates.x,
      y: e.clientY - this.canvasCoordinates.y,
    }
    const cell = this.field.cells.find(cell => {
      return (
        (cell.coordinates.xs <= event.x) &&  
        (cell.coordinates.xe >= event.x) &&
        (cell.coordinates.ys <= event.y) &&  
        (cell.coordinates.ye >= event.y)
      )
    })
    console.log(cell.colorId, cell.address.row, cell.address.col)
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
