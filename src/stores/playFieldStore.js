import { makeAutoObservable } from 'mobx'

export default class PlayFieldStore {
  constructor(rootStore) {
    this.rootStore = rootStore
    this.field = []
    this.fieldSize = {
      rows: 5,
      colls: 4,
      width: 250,
      height: 200,
    }
    makeAutoObservable(this)
  }
}
