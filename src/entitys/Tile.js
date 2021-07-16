export default class Tile {
  constructor({store, colorId, indexCell}) {
    this.store = store
    this.colorId = colorId !== undefined ? 
      colorId : 
      this.store.randomNum(this.store.tile.list.length)
    this.tile = this.store.tile.list[this.colorId]
    this.x = this.store.field.cells.ge
  }
}