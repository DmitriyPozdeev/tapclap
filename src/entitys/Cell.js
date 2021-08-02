export default class Cell {
  constructor(store, row, col) {
    this.store = store
    this.image = null
    this.colorId = null
    this.coord = {
      xs: col * (this.store.cellSize), 
      ys: row * (this.store.cellSize),
      xe: col * (this.store.cellSize) + this.store.cellSize,
      ye: row * (this.store.cellSize) + this.store.cellSize,
    }
    this.animateData = {
      x: 0,
      y: 0,
      w: this.store.cellSize,
      h: this.store.cellSize, 
    }
    this.index = this.store.size.cols * row + col
    this.neighbors = this.getNeighbors()
  }
  sephia(imageData) {
    // получаем одномерный массив, описывающий все пиксели изображения
    const pixels = imageData.data;
    // циклически преобразуем массив, изменяя значения красного, зеленого и синего каналов
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      pixels[i]     = r+g+b; // red
      pixels[i + 1] = r+g+b; // green
      pixels[i + 2] = r+g+b; // blue
    }
    return imageData;
  }
  captureImage() {
    this.image = this.store.root.context.getImageData(
      this.coord.xs, this.coord.ys, this.store.cellSize, this.store.cellSize
    )
    this.sephia(this.image)
  }
  animateImage() {
    this.store.root.context.putImageData(
      this.image, 
      this.coord.xs, 
      this.coord.ys,
      this.animateData.x += 1.5,
      this.animateData.y += 1.5,
      this.animateData.w >= 0 ? this.animateData.w -= 3 : 0,
      this.animateData.h >= 0 ? this.animateData.h -= 3 : 0,
    )
  }
  reset() {
    this.image = null
    this.animateData = {
      x: 0,
      y: 0,
      w: this.store.cellSize,
      h: this.store.cellSize, 
    }
  }
  getCoord() {
    return this.coord
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
} 