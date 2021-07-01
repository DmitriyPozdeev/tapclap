import { makeAutoObservable } from 'mobx'
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
    this.blueBlock = new Image()
    this.greenBlock = new Image()
    this.purpleBlock = new Image()
    this.redBlock = new Image()
    this.yellowBlock = new Image()
    this.tileStore = new TileStore(this)
    this.playFieldStore = new PlayFieldStore(this)
    makeAutoObservable(this)
  }
  initGame(canvas) {
    this.canvas = canvas
  }
  async preloadAssets() {
    this.blueBlock.src = blue
    this.greenBlock.src = green
    this.purpleBlock.src = purple
    this.redBlock.src = red
    this.yellowBlock.src = yellow
    this.yellowBlock.addEventListener("load", () => {
      this.run()
    })
  }
  run() {
    window.requestAnimationFrame(() => {
      this.render()
    })
  } 
  render() {
    this.canvas.drawImage(this.blueBlock, 0 , 0, 100, 100)
    this.canvas.drawImage(this.purpleBlock, 101 , 0, 100, 100)
    this.canvas.drawImage(this.redBlock, 202 , 0, 100, 100)
    this.canvas.drawImage(this.yellowBlock, 303 , 0, 100, 100) 
    this.canvas.drawImage(this.greenBlock, 404 , 0, 100, 100)
    this.canvas.drawImage(this.blueBlock, 505 , 0, 100, 100)
  }
  start(canvas) {
    this.initGame(canvas)
    this.preloadAssets()
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
  initField() {
    this.playFieldStore.field = []
    for (let i = 0; i < this.playFieldStore.fieldSize.rows; i++) {
      for (let j = 0; j < this.playFieldStore.fieldSize.colls; j++) {
        this.playFieldStore.field.push(
          {
            address: {
              row: i,
              coll: j,
            },
            coordinates: {
              x: null, 
              y: null,
            },
            tileId: null,
          }
        ) 
      }
    }
  }
  mixTiles() {

  }
  
}
