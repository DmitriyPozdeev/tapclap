import { makeAutoObservable } from 'mobx'
import blue from '../assets/main/blocks/blue.png'
import green from '../assets/main/blocks/green.png'
import purple from '../assets/main/blocks/purple.png'
import red from '../assets/main/blocks/red.png'
import yellow from '../assets/main/blocks/yellow.png'

export default class TailStore {
  srcs = [red, green, blue, purple, yellow]
  imgList = []
  currentList = []
  currentDelete = []

  constructor(rootStore) {
    this.root = rootStore
    makeAutoObservable(this)
  }
  initTile(src) {
    return new Promise((resolve, reject) => {
      let tile = new Image()
      tile.src = src
      tile.onload = () => resolve(tile);
      tile.onerror = () => reject(tile.src)
    })
  }
  async preloadImgList() {
    const promises = this.srcs.reduce((acc, src) => {
      return [...acc, this.initTile(src)]
    }, [])
    await Promise.all(promises).then((tiles) => {
      for ( let tile of tiles) {
        this.imgList.push(tile)
      }
    })
  } 
  initCurrentList() {
    for (let i = 0; i < this.root.field.size.rows; i++) {
      const row = []
      for (let j = 0; j < this.root.field.size.cols; j++) {
        row.push({
          index: i * this.root.field.size.cols + j,
          colorId: this.root.randomNum(this.srcs.length),
          xs: j * this.root.field.cellSize,
          ys: i * this.root.field.cellSize,
        })
      } 
      this.currentList.push(row)
    }
  }
  depthMapCurrentList(callback) {
    
  }
  setCurrentDelete(indexesArray) {
    this.currentDelete = indexesArray
  }
}


 