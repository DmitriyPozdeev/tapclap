import { makeAutoObservable, computed } from 'mobx'

export default class GameStore {
  _minWinPoints = 5000
  _minDestroy = 4
  _stepRatio = 50
  _moves = 18
  _mixes = 2
  _startCounter = new Set([])
  _stopCounter = new Set([])
  _canvas = null
  _context = null
  
  constructor(rootStore) {
    this.root = rootStore
    makeAutoObservable(this, {
      canvasCoordinates: computed,
      offsetSpeed: computed,
    }) 
  }
  
  setStartCounter(index) {
    this._startCounter.add(index)
  }
  setStopCounter(index) {
    this._stopCounter.add(index)
  }
  equalityCounters() {
    return  (
      this._startCounter.size ===  this._stopCounter.size
    )
  }
  clearStartStopCounters() {
    this._startCounter.clear()
    this._stopCounter.clear()
  }
  
  start({canvas, context}) {
    this.initGame({canvas, context})
    this.root.field.initCells()
    this.root.tile.preloadImgList()
    .then(() => { 
      this.root.tile.initCurrentList()
      this.run()
    })
  }
  initGame({canvas, context}) {
    this._canvas = canvas
    this._context = context
  }
  run() {
    window.requestAnimationFrame(() => {
      this.update()  
      this.render()
      this.run()
    })
  } 
  update() {
    if(this.root.field.isAnimate) {
      const cols = this.root.field.size.cols
      this.root.tile.currentList.forEach((row, numRow) => {
        row.forEach((tile, numCol) => {
          const currentIndex = numRow * cols + numCol
          const { xs } = this.root.field.cells[currentIndex].coord
          if(tile.index !== currentIndex) {
            this.setStartCounter(currentIndex)
            tile.xs -= this.offsetSpeed
            if(tile.xs === xs){
              this.setStopCounter(currentIndex)
              tile.index = currentIndex
              this.root.field.cells[currentIndex].reset()
              if(this.equalityCounters()){
                this.root.field.setAnimate(false)
                this.clearStartStopCounters()
                this.checkEndGame()
              }
            }
          }
        })
        this.addTiles(row, numRow)
      })
    }
  }
  render() {
    const { width, height } = this.canvas
    this.context.fillStyle = "#020526";
    this.context.fillRect(
      0, 0, width, height
    )
    this.renderDelete()
    this.renderTiles()
  }

  renderDelete() {
    if(this.root.field.isAnimate) {
      this.root.field.cells.forEach(cell => {
        const { index } = cell
        if (cell.image && 
        this.root.tile.currentDelete.includes(index)) {
          cell.animateImage()
        }
      })
    }
  }
  renderTiles() {
    this.root.tile.currentList.forEach((row) => {
      row.forEach((tile) => {
        const { xs, ys, colorId } = tile
        const size = this.root.field.cellSize
        this.context.drawImage(
          this.root.tile.imgList[colorId], 
          xs, ys, 
          size, size
        )   
      })
    })
  }
  addTiles(row, numRow) {
    const cols = this.root.field.size.cols
    const cellSize = this.root.field.cellSize
    let diff = cols - row.length
    for(let addedTileNum = 0; addedTileNum < diff; addedTileNum++) {
      row.push({
        index: numRow * cols,
        colorId: this.root.randomNum(this.root.tile.srcs.length),
        xs: cols * cellSize + 
            diff  * cellSize + 
            addedTileNum * cellSize * 1.5,
        ys: numRow * cellSize,
      })
    }
  }
  checkEndGame() {
    if(this.root.user.points >= this.minWinPoints) {
      this.root.user.setStatus('win')
      return
    } 
    else if(this.root.user.movesCount === this.moves) {
      this.root.user.setStatus('lose')
      return
    }
    if(!this.root.tile.checkList() && 
    this.root.user.mixCount === this.mixes){
      this.root.user.setStatus('noMoves')
    } else if(!this.root.tile.checkList()) {
      this.root.user.setStatus('mix')
    }
  }
  
  searchValidTiles(index) {
    const flatList = this.root.tile.currentList.flat()
    let color = flatList[index]?.colorId
    let result = []
	  let queue = [index]
    let visited = new Set([])

	  while(queue.length > 0) {
     let v = queue.shift() 
     this.root.field.cells[v].neighbors.forEach(neighbor => {
       if(
         !visited.has(neighbor) && 
         flatList[neighbor]?.colorId === color
       ) {                  
         visited.add(neighbor)
         queue.push(neighbor)
         result.push(neighbor) 
       } 
     })
    }
	  return result.length >= this.minDestroy ? result : [] 
  }
  get stepRatio() {
    return this._stepRatio
  }
  get minWinPoints() {
    return this._minWinPoints
  }
  get canvasCoord() {
    return this.canvas.getBoundingClientRect()
  }
  get offsetSpeed() {
    return this.root.field.cellSize / (this.root.field.cellSize/10)
  } 
  get mixes() {
    return this._mixes
  }
  get moves() {
    return this._moves
  }
  get minDestroy() {
    return this._minDestroy
  }
  get canvas() {
    return this._canvas
  }
  get context() {
    return this._context
  }
}