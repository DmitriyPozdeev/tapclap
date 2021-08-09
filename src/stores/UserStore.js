import { makeAutoObservable } from 'mobx'

export default class UserStore {
  _status = 'start'
  _points = 0
  _movesCount = 0
  _mixCount = 0
  constructor(rootStore) {
    this.root = rootStore
    makeAutoObservable(this)
  }
  
  setStatus(status) {
    this._status = status
  }
  setMixCount() {
    this._mixCount = this._mixCount < this.root.game.mixes ? 
      this._mixCount += 1 : 
      this.root.game.mixes
  }
  setPoints(amount) {
    this._points += 
      (amount * this.root.game.stepRatio) + 
      this.root.game.stepRatio * 
      (amount - this.root.game.minDestroy)
  }
  setMovesCount() {
    this._movesCount = this._movesCount < this.root.game.moves ?  
      this._movesCount += 1 :
      this.root.game.moves
  }
  reset() {
    this.setStatus('process')
    this._points = 0
    this._mixCount = 0
    this._movesCount = 0
    this.root.tile.initCurrentList()
  }

  get status() {
    return this._status
  }
  get movesCount() {
    return this._movesCount
  }
  get points() {
    return this._points
  }
  get mixCount() {
    return this._mixCount
  }
  
}
