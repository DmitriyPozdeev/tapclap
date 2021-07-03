import { makeAutoObservable } from 'mobx'
import blue from '../assets/main/blocks/blue.png'
import green from '../assets/main/blocks/green.png'
import purple from '../assets/main/blocks/purple.png'
import red from '../assets/main/blocks/red.png'
import yellow from '../assets/main/blocks/yellow.png'

export default class TailStore {
  constructor(rootStore) {
    this.root = rootStore
    this.size = 70
    this.srcs = [red, green, blue, purple, yellow]
    makeAutoObservable(this)
  }
  create(src) {
    return new Promise((resolve, reject) => {
      let tile = new Image()
      tile.src = src
      tile.onload = () => resolve(tile);
      tile.onerror = () => reject(src)
    })
  }
}
