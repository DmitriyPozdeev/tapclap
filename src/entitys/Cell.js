export default class Cell {
  constructor(store, row, col) {
    this.store = store
    this._image = null
    this._coord = {
      xs: col * (this.store.cellSize), 
      ys: row * (this.store.cellSize),
      xe: col * (this.store.cellSize) + this.store.cellSize,
      ye: row * (this.store.cellSize) + this.store.cellSize,
    }
    this._animateData = {
      x: 0,
      y: 0,
      w: this.store.cellSize,
      h: this.store.cellSize, 
    }
    this._index = this.store.size.cols * row + col
    this._neighbors = this.getNeighbors()
  }
  deleteEffect(imageData) {
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      pixels[i]     = r+g+b; 
      pixels[i + 1] = r+g+b;
      pixels[i + 2] = r+g+b;
    }
    return imageData;
  }
  captureImage() {
    this._image = this.store.root.game.context.getImageData(
      this.coord.xs, this.coord.ys, this.store.cellSize, this.store.cellSize
    )
    this.deleteEffect(this._image)
  }
  animateImage() {
    this.store.root.game.context.putImageData(
      this.image, 
      this.coord.xs, 
      this.coord.ys,
      this._animateData.x += 1.5,
      this._animateData.y += 1.5,
      this._animateData.w >= 0 ? this._animateData.w -= 3 : 0,
      this._animateData.h >= 0 ? this._animateData.h -= 3 : 0,
    )
  }
  reset() {
    this._image = null
    this._animateData = {
      x: 0,
      y: 0,
      w: this.store.cellSize,
      h: this.store.cellSize, 
    }
  }
  getNeighbors() {
    const index = this.index
    const cols = this.store.size.cols
    const cellsAmount = this.store.cellsAmount
    const positionInRow = index % cols
    
    const neighbors = {
      top: index >= cols ? 
        index - cols : 
        null,
      bottom: index + cols < cellsAmount ? 
        index + cols : 
        null,
      left: positionInRow !== 0 ? 
        index - 1 : 
        null,
      right: positionInRow !== (cols - 1) ? 
        index + 1 : 
        null, 
    }
    const indexes = []
    for (let key in neighbors) {
      if (neighbors[key] !== null) {
        indexes.push(neighbors[key])
      }
    }
    return indexes
  }
  get image() {
    return this._image
  }
  get coord() {
    return this._coord
  }
  get index() {
    return this._index
  }
  get neighbors() {
    return this._neighbors
  }
  get animateData() {
    return this._animateData
  }
} 