import { makeAutoObservable } from 'mobx'
import tileStore from './tileStore'
import playFieldStore from './playFieldStore'

export default class RootStore {
  constructor() {
    thisTile

    makeAutoObservable(this)
  }
  
  get mechel() {
    return this._mechel
  }
}
