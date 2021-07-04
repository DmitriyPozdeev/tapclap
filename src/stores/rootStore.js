import { makeAutoObservable } from 'mobx'
import TileStore from './TileStore'
import FieldStore from './FieldStore'

export default class RootStore {
  constructor() {
    this.canvas = null
    this.tile = new TileStore(this)
    this.field = new FieldStore(this)
    makeAutoObservable(this) 
  }

  randomNum(max) {
    return Math.floor(Math.random() * max) 
  }
  initGame(canvas) {
    this.canvas = canvas
  }
  click(e) {
    console.log(e)
  }
  
  run() {
    window.requestAnimationFrame(() => {
      this.render()
    })
  } 
  render() {
    for (let i = 0; i < this.field.tilesAmount; i++) {
      const {tile, colorId} = this.tile.list[this.randomNum(5)]
      const {x, y} = this.field.fillRandomEmptyCell(colorId).coordinates
      this.canvas.drawImage(tile, x, y, this.tile.size, this.tile.size)
    }
    const colorIds = this.field.cells.map( item => item.colorId)
    console.log(colorIds)
  }
  start(canvas) {
    this.initGame(canvas)
    this.field.initCells()
    this.tile.preload()
    .then(() => this.run())
  }
}
