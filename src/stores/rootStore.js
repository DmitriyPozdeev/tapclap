import { makeAutoObservable } from 'mobx'
import TileStore from './TileStore'
import PlayFieldStore from './PlayFieldStore'
import Tile from './Tile'

export default class RootStore {
  constructor() {
    this.tileStore = new TileStore(this)
    this.playFieldStore = new PlayFieldStore(this)
    makeAutoObservable(this)
  }
  initTilesList() {
    const amountTiles = this.playFieldStore.fieldSize.rows * 
      this.playFieldStore.fieldSize.colls
    this.tileStore.tilesList = []
    for (let i = 0; i < amountTiles; i++) {
      this.tileStore.tilesList.push(
        new Tile(i)
      )
    }
  }
  initField() {
    this.playFieldStore.field = []
    console.log(this.playFieldStore.fieldSize)
    for (let i = 0; i < this.playFieldStore.fieldSize.rows; i++) {
      for (let j = 0; j < this.playFieldStore.fieldSize.colls; j++) {
        this.playFieldStore.field.push(
          {
            address: {
              row: i,
              coll: j,
            },
            coordinates: {
              x: null, 
              y: null,
            },
            tileId: null,
          }
        ) 
      }
    }
  }
  mixTiles() {

  }

}
