export default class Cell {
  constructor(store, row, col) {
    this.store = store
    this.address = {
      row,
      col,
    }
    this.coor = {
      xs: col * (this.store.cellSize), 
      ys: row * (this.store.cellSize),
      xe: col * (this.store.cellSize) + this.store.cellSize,
      ye: row * (this.store.cellSize) + this.store.cellSize,
    }
    this.colorId = null
    this.index = this.store.size.cols * row + col
    this.neighbors = this.getNeighborsIndexes()
  }
  isEmpty() {
    return this.colorId === null ? true : false
  }
  getCoord() {
    return this.coor
  }
  setTile(tile) {
    this.tile = tile
  }
  setColorId(colorId) {
    this.colorId = colorId
  }
  getTile() {
    return this.tile
  }
  deleteTile() {
    this.colorId = null
  }
  getNeighbors() {
    const positionInRow = this.index % this.store.size.cols
    return {
      top: this.index >= this.store.size.cols ? 
        this.index - this.store.size.cols : 
        null,
      bottom: this.index + this.store.size.cols < this.store.cellsAmount ? 
        this.index + this.store.size.cols : 
        null,
      left: positionInRow !== 0 ? 
        this.index - 1 : 
        null,
      right: positionInRow !== (this.store.size.cols - 1) ? 
        this.index + 1 : 
        null, 
    }
  }
  getNeighborsIndexes() {
    const indexes = []
    const neighbors = this.getNeighbors(this.index)
    for (let key in neighbors) {
      if (neighbors[key] !== null) {
        indexes.push(neighbors[key])
      }
    }
    return indexes
  }
  showData() {
    console.log(this.colorId)
  }
} 