import { makeAutoObservable, computed } from 'mobx'
import TileStore from './TileStore'
import PlayFieldStore from './PlayFieldStore'
import Tile from './Tile'
import blue from '../assets/main/blocks/blue.png'
import green from '../assets/main/blocks/green.png'
import purple from '../assets/main/blocks/purple.png'
import red from '../assets/main/blocks/red.png'
import yellow from '../assets/main/blocks/yellow.png'

export default class RootStore {
  constructor() {
    this.canvas = null
    this.blockSize = 70
    this.rows = 10
    this.colls = 8
    this.tileStore = new TileStore(this)
    this.playFieldStore = new PlayFieldStore(this)
    makeAutoObservable(this, {
      fieldSize: computed
    }) 
  }

  initGame(canvas) {
    this.canvas = canvas
  }
  randomNum(max) {
    return Math.floor(Math.random() * max)
  }
  randomSrc() {
    const colors =[red, green, blue, purple, yellow]
    return colors[this.randomNum(5)]
  }
  createBlock(src) {
    return new Promise((resolve, reject) => {
      let block = new Image()
      block.src = src
      block.onload = () => resolve(block);
      block.onerror = () => reject(src)
    })
  }
  run() {
    window.requestAnimationFrame(() => {
      this.render()
    })
  } 
  render(srcArray) {
    const arr = [red, green, purple, red, green, yellow, red, green, purple, red, green, yellow, red, green, purple, red, green, yellow]
    const itr = arr.map((src) => this.createBlock(this.randomSrc())) // itr - массив промисов
    Promise.all(itr).then((blocks) => { //blocks массив значений от всех промисов, которые были ему переданы
      for ( let block of blocks) {
        const {x, y} = this.getRandomEmptyCell().coordinates
        this.canvas.drawImage(block, x , y, this.blockSize, this.blockSize)
      }
    })
  }
  start(canvas) {
    this.initGame(canvas)
    this.initField()
    this.run()
  }
  delete(id) {
     this.tileStore.tilesList.filter((item) => {
       return item.id !== id
     })
  }
  initTilesList() {
    const amountTiles = this.playFieldStore.fieldSize.rows * 
      this.playFieldStore.fieldSize.colls
    this.tileStore.tilesList = []
    for (let i = 0; i < amountTiles; i++) {
      this.tileStore.tilesList.push(
        new Tile(i)
      )
    }
  }
  getRandomEmptyCell() {
    const emptyCells = this.playFieldStore.field.filter( item => 
      item.address.isEmpty 
    )
    const numCell = this.randomNum(emptyCells.length)
    emptyCells[numCell].address.isEmpty = false
    return emptyCells[numCell]
  }

  initField() {
    this.playFieldStore.field = []
    let x = 0
    let y = 0
    for (let i = 0; i < this.playFieldStore.fieldSize.rows; i++) {
      for (let j = 0; j < this.playFieldStore.fieldSize.colls; j++) {
        this.playFieldStore.field.push(
          {
            address: {
              row: i,
              coll: j,
              isEmpty: true
            },
            coordinates: {
              x: i * this.blockSize + 1, 
              y: j * this.blockSize + 1,
            },
            tileId: null,
          }
        ) 
      }
    }
  }
  mixTiles() {

  }
  get fieldSize() {
    return {
      width: this.colls * this.blockSize + this.colls,
      height: this.rows * this.blockSize + this.rows,
    }
  }
}
