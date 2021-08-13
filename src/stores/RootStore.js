import { makeAutoObservable } from 'mobx'
import UserStore from './UserStore'
import GameStore from './GameStore'
import TileStore from './TileStore'
import FieldStore from './FieldStore'
import UIStore from './UIStore'
import StateMachine from 'javascript-state-machine'

export default class RootStore {
  constructor() {
    this.user = new UserStore(this)
    this.game = new GameStore(this)
    this.tile = new TileStore(this)
    this.field = new FieldStore(this)
    this.ui = new UIStore(this)
    makeAutoObservable(this) 
  }

  randomNum(max) {
    return Math.floor(Math.random() * max) 
  }
}