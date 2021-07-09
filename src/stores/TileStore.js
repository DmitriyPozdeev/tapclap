import { makeAutoObservable } from 'mobx'
import blue from '../assets/main/blocks/blue.png'
import green from '../assets/main/blocks/green.png'
import purple from '../assets/main/blocks/purple.png'
import red from '../assets/main/blocks/red.png'
import yellow from '../assets/main/blocks/yellow.png'

export default class TailStore {
  srcs = [red, green, blue, purple, yellow]
  list = []
  constructor(rootStore) {
    this.root = rootStore
    makeAutoObservable(this)
  }

  initTile(src, colorId) {
    return new Promise((resolve, reject) => {
      let tile = new Image()
      tile.src = src
      tile.onload = () => resolve({tile, colorId});
      tile.onerror = () => reject(tile.src)
    })
  }
  async preloadAvailableList() {
    const promises = this.srcs.reduce((acc, src, colorId) => {
      return [...acc, this.initTile(src, colorId)]
    }, [])
    await Promise.all(promises).then((tiles) => {
      for ( let {tile, colorId} of tiles) {
        this.list.push({tile, colorId})
      }
    })
  } 
}