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
  cols = []
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
    const promises = this.srcs.reduce((acc, src, colorId) => {
      return [...acc, this.initTile(src)]
    }, [])
    await Promise.all(promises).then((tiles) => {
      for ( let tile of tiles) {
        this.imgList.push(tile)
      }
    })
  } 
  setCurrentList() {
    this.currentList = this.root.field.cells.map(cell => cell.tile)
  }
  setColsList(list) {
    this.cols = list
  }
  initTileCols() {
    const list = []
    this.root.field.cols.forEach(col => {
      list.push(col.map(cell => {
        return cell.tile
      }))
    })
    this.setColsList(list) 
    console.log(this.cols)
  }
}
