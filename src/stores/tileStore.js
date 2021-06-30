import { makeAutoObservable } from 'mobx'

export default class TailStore {
  constructor(rootStore) {
    this.rootStore = rootStore
    this.tilesList = []
    this.cellSize = 50
    makeAutoObservable(this)
  }
}
