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
    const rows = this.root.field.size.rows
    const cols = this.root.field.size.cols
    const cellSize = this.root.field.cellSize
    const amountSrcs = this.srcs.length
    this.currentList = [...Array(rows)].map((_, i) => { 
      return [...Array(cols)].map((_, j) => {
        return {
          index: i * cols + j,
          colorId: this.root.randomNum(amountSrcs),
          xs: j * cellSize,
          ys: i * cellSize,
        }
      })
    })
  }
  setCurrentList(list) {
    this.currentList = list
  }
  mixCurrentList() {
    const cols = this.root.field.size.cols
    const colorList = this.root.tile.currentList
    .flat()
    .map(tile => tile.colorId)
    .sort(() => Math.random() - 0.5)
    
    this.root.tile.currentList = []
    for (let i = 0; i < this.root.field.size.rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) {
        row.push({
          index: i * cols + j,
          colorId: colorList[i * cols + j],
          xs: j * this.root.field.cellSize,
          ys: i * this.root.field.cellSize,
        })
      } 
      this.currentList.push(row)
    }
  }
  chessCurrentList() {
    const cols = this.root.field.size.cols
    

    this.root.tile.currentList = []
    for (let i = 0; i < this.root.field.size.rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) {
        let color
        if(i % 2) {
          if(j % 2) {
            color = 1
          } else color = 2
        } else color = 2
        row.push({
          index: i * cols + j,
          colorId: color ,
          xs: j * this.root.field.cellSize,
          ys: i * this.root.field.cellSize,
        })
      } 
      this.currentList.push(row)
    }
  }
  
  setCurrentDelete(indexesArray) {
    this.currentDelete = indexesArray
  }
}


 