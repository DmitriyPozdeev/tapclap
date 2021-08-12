import { makeAutoObservable } from 'mobx'
import blue from '../assets/main/blocks/blue.png'
import green from '../assets/main/blocks/green.png'
import purple from '../assets/main/blocks/purple.png'
import red from '../assets/main/blocks/red.png'
import yellow from '../assets/main/blocks/yellow.png'

export default class TailStore {
  _srcs = [red, green, blue, purple, yellow]
  _imgList = []
  _currentList = []
  _currentDelete = []

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

    const list = [...Array(rows)].map((_, rowNum) => { 
      return [...Array(cols)].map((_, colNum) => {
        return {
          index: rowNum * cols + colNum,
          colorId: this.root.randomNum(amountSrcs),
          xs: colNum * cellSize,
          ys: rowNum * cellSize,
        }
      })
    })
    this.setCurrentList(list)
  }
 
  checkList() {
    const flatTileList = this.currentList.flat()
    for (const tile of flatTileList) {
      if(this.root.game.searchValidTiles(tile.index).length >= 
      this.root.game.minDestroy) {
        return true
      }
    }
    return false
  }

  listCorrector(status) {
    if(!this.checkList()) {
      this.mixUntilValid(status)
    }
  }
  mixUntilValid(status) {
    let counter = 0 
    while(!this.checkList(this.currentList)) {
      this.mixCurrentList()
      counter++
      if(counter === 5) {
        this.root.user.setStatus(status)
        this.setCurrentList([])
        break
      }
    }
  }
  initCurrentList() {
    this.createTileList()
    this.listCorrector('error')
  }
  setCurrentList(list) {
    this._currentList = list
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

  get currentList() {
    return this._currentList
  }
  get srcs() {
    return this._srcs
  }
  get imgList() {
    return this._imgList
  }
}
