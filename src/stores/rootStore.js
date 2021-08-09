import { makeAutoObservable, computed } from 'mobx'
import TileStore from './TileStore'
import FieldStore from './FieldStore'

export default class RootStore {
  _minWinPoints = 5000
  _minDestroy = 7
  _stepRatio = 50
  _moves = 18
  _mixes = 2
  _userStatus = 'start'
  _startCounter = new Set([])
  _stopCounter = new Set([])
  canvas = null
  context = null
  points = 0
  progress = 0
  mixCount = 0
  movesCount = 0
  
  
  
  constructor() {
    this.tile = new TileStore(this)
    this.field = new FieldStore(this)
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
    return  this._startCounter.size ===  this._stopCounter.size
  }
  clearStartStopCounters() {
    this._startCounter.clear()
    this._stopCounter.clear()
  }

  resetAll() {
    this.setUserStatus('process')
    this.points = 0
    this.progress = 0
    this.mixCount = 0
    this.movesCount = 0
    this.tile.initCurrentList()
  }
  setMixCount() {
    this.mixCount = this.mixCount < this._mixes ? this.mixCount += 1 : this._mixes
  }
  setUserStatus(status) {
    this._userStatus = status
  }
  setProgress() {
    this.progress = (this.points / this._minWinPoints) * 100
  }
  initGame({canvas, context}) {
    this.canvas = canvas
    this.context = context
  }
  
  addTiles(row, numRow) {
    const cols = this.field.size.cols
    const cellSize = this.field.cellSize
    let diff = cols - row.length
    for(let j = 0; j < diff; j++) {
      row.push({
        index: numRow * cols,
        colorId: this.randomNum(this.tile.srcs.length),
        xs: cols * cellSize + 
            diff  * cellSize + 
            j * cellSize * 1.5,
        ys: numRow * cellSize,
      })
    }
  }

  update() {
    if(this.field.isAnimate) {
      const cols = this.field.size.cols
      this.tile.currentList.forEach((row, i) => {
        row.forEach((tile, j) => {
          const currentIndex = i * cols + j
          const { xs } = this.field.cells[currentIndex].getCoord()
          if(tile.index !== currentIndex) {
            this.setStartCounter(currentIndex)
            tile.xs -= this.offsetSpeed
            if(tile.xs === xs){
              this.setStopCounter(currentIndex)
              tile.index = currentIndex
              this.field.cells[currentIndex].reset()
              if(this.equalityCounters()){
                this.field.isAnimate = false
                this.clearStartStopCounters()
                this.checkEndGame()
              }
            }
          }
        })
        this.addTiles(row, i)
      })
    }
  }
  checkEndGame() {
    if(this.points >= this._minWinPoints) {
      this.setUserStatus('win')
    } 
    else if(this._moves === 0) {
      this.setUserStatus('lose')
    }
    if(!this.tile.checkList() && this.mixCount === this._mixes){
      this.setUserStatus('noMoves')
    } else if(!this.tile.checkList()) {
      this.setUserStatus('mix')
    }
  }
  run() {
    window.requestAnimationFrame(() => {
      this.update()  
      this.render()
      this.run()
    })
  } 
  render() {
    this.context.fillStyle = "#020526";
    this.context.fillRect(
      0, 0, this.canvas.width, this.canvas.height
    )
    this.renderDelete()
    this.renderTiles()
  }
  renderDelete() {
    this.field.cells.forEach(cell => {
      const { index } = cell
      if (cell.image && this.tile.currentDelete.includes(index)) {
        cell.animateImage()
      }
    })
  }
  renderTiles() {
    this.tile.currentList.forEach((row) => {
      row.forEach((tile) => {
        this.context.drawImage(
          this.tile.imgList[tile.colorId], 
          tile.xs, tile.ys, 
          this.field.cellSize, this.field.cellSize
        )   
      })
    })
  }
  
  start({canvas, context}) {
    this.initGame({canvas, context})
    this.field.initCells()
    this.tile.preloadImgList()
    .then(() => {
      this.tile.initCurrentList()
      this.run()
    })
  }

  setPoints(amount) {
    this.points += 
      (amount * this._stepRatio) + 
      this._stepRatio * 
      (amount - this._minDestroy)
  }
  setMoves() {
    this._moves = this._moves > 0 ?  this._moves -= 1 : 0
  }

  searcValidTile(index) {
    const flatList = this.tile.currentList.flat()
    let color = flatList[index]?.colorId
    let result = []
	  let queue = [index]
    let visited = new Set([])

	  while(queue.length > 0) {
     let v = queue.shift() 
     this.field.cells[v].neighbors.forEach(neighbor => {
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
	  return result.length >= this._minDestroy ? result : [] 
  }
  
  randomNum(max) {
    return Math.floor(Math.random() * max) 
  }
  get canvasCoord() {
    return this.canvas.getBoundingClientRect()
  }
  get offsetSpeed() {
    return this.field.cellSize / (this.field.cellSize/10)
  } 
}
