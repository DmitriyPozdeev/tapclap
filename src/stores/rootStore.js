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

  initGame(canvas) {
    this.canvas = canvas
  }
  randomNum(max) {
    return Math.floor(Math.random() * max) 
  }
  randomSrc() {
    return this.tile.srcs[this.randomNum(5)]
  }
  
  run() {
    window.requestAnimationFrame(() => {
      this.render()
    })
  } 
  render(srcArray) {
    const arr = [
      'red', 'green', 'purple', 'red', 'green', 
      'yellow', 'red', 'green', 'purple', 'red', 
      'red', 'green', 'purple', 'red', 'green', 
      'yellow', 'red', 'green', 'purple', 'red', 
      
    ]
    const itr = arr.map((src) => this.tile.create(this.randomSrc())) // itr - массив промисов
    Promise.all(itr).then((blocks) => { //blocks массив значений от всех промисов, которые были ему переданы
      for ( let block of blocks) {
        const {x, y} = this.getRandomEmptyCell().coordinates
        this.canvas.drawImage(block, x , y, this.tile.size, this.tile.size)
      }
    })
  }
   
  getRandomEmptyCell() {
    const emptyCells = this.field.cells.filter( item => 
      item.isEmpty 
    )
    const numCell = this.randomNum(emptyCells.length)
    emptyCells[numCell].isEmpty = false
    return emptyCells[numCell]
  }
  start(canvas) {
    this.initGame(canvas)
    this.field.initCells()
    this.run()
  }
  delete(id) {
     this.tileStore.tilesList.filter((item) => {
       return item.id !== id
     })
  }

  mixTiles() {

  }
  
}
