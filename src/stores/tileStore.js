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

  createTileList() {
    const rows = this.root.field.size.rows
    const cols = this.root.field.size.cols
    const cellSize = this.root.field.cellSize
    const amountSrcs = this.srcs.length

    const list = [...Array(rows)].map((_, i) => { 
      return [...Array(cols)].map((_, j) => {
        return {
          index: i * cols + j,
          colorId: this.root.randomNum(amountSrcs),
          xs: j * cellSize,
          ys: i * cellSize,
        }
      })
    })
    this.setCurrentList(list)
    return list
  }
 
  checkList(list) {
    const flatTileList = list.flat()
    for (const tile of flatTileList) {
      if(this.root.bfs(tile.index).length >= this.root.minDestroy) {
        return true
      }
    }
    return false
  }
  repairList(list) {
    let counter = 0 
    while(!this.checkList(list) && counter < 5) {
      this.mixCurrentList()
      counter++
    }
    if(counter === 5) {
      alert('Игра не возможна, слишком высокое значение minDestroy')
      this.setCurrentList([])
    }
  }

  initCurrentList() {
    const list = this.createTileList()
    if(!this.checkList(list)) {
      this.repairList(list)
    }
  }

  setCurrentList(list) {
    this.currentList = list
  }

  getMixedColorList() {
    return this.currentList
    .flat()
    .sort(() => Math.random() - 0.5)
    .map(tile => tile.colorId)
  }

  mixCurrentList() {
    const cols = this.root.field.size.cols
    const colorList = this.getMixedColorList()
    this.currentList.map((row, i) => {
      return row.map((tile, j) => {
        tile.colorId = colorList[i * cols + j]
        return tile
      })
    })
  }

  setCurrentDelete(indexesArray) {
    this.currentDelete = indexesArray
  }
}


 