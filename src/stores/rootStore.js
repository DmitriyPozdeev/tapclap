import { makeAutoObservable, computed } from 'mobx'
import TileStore from './TileStore'
import FieldStore from './FieldStore'

export default class RootStore {
  canvas = null
  context = null
  minDestroy = 2
  points = 0
  minWinPoints = 5000
  stepRatio = 50
  mixCount = 2
  moves = 18

  constructor() {
    this.tile = new TileStore(this)
    this.field = new FieldStore(this)
    makeAutoObservable(this, {
      canvasCoordinates: computed,
      offsetSpeed: computed,
    }) 
  }
 
  initGame({canvas, context}) {
    this.canvas = canvas
    this.context = context
  }

  addTiles(row, numRow) {
    const cols = this.field.size.cols
    const cellSize = this.field.cellSize
    let diff = cols - row.length
    let count = 0
    for(let j = diff; row.length < cols; j++) {
      row.push({
        index: numRow * cols,
        colorId: this.randomNum(this.tile.srcs.length),
        xs: cols * cellSize + 
            diff  * cellSize + 
            count * cellSize * 2,
        ys: numRow * cellSize,
      })
      count+=1
    }
    count = 0
  }
  update() {
    const cols = this.field.size.cols
    this.tile.currentList.forEach((row, i) => {
      row.forEach((tile, j) => {
        const currentIndex = i * cols + j
        const {xs, ys} = this.field.cells[currentIndex].getCoord()
        if(tile.index !== currentIndex) {
          tile.xs -= this.offsetSpeed
          tile.ys = ys
          if(tile.xs === xs){
            tile.index = currentIndex
            this.field.cells[currentIndex].reset()
          }
        }
      })
      this.addTiles(row, i)
    })
  }
  run() {
   window.requestAnimationFrame(() => {
     // console.log(this.isAnimate)
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
      (amount * this.stepRatio) + 
      this.stepRatio * 
      (amount - this.minDestroy)
  }
  setMoves() {
    this.moves = this.moves > 0 ?  this.moves-= 1 : 0
  }
  checkWin() {

  }

  bfs(index) {
    let color = this.tile.currentList.flat()[index]?.colorId
    let result = []
	  let queue = [index]
    let visited = new Set([])

	  while(queue.length > 0) {
     let v = queue.shift() 
     this.field.cells[v].neighbors.forEach(neighbor => {
       if(
         !visited.has(neighbor) && 
         this.tile.currentList.flat()[neighbor]?.colorId === color
       ) {                  
         visited.add(neighbor)
         queue.push(neighbor)
         result.push(neighbor) 
       }
     })
    }
	  return result.length >= this.minDestroy ? result : [] 
  }
  
  randomNum(max) {
    return Math.floor(Math.random() * max) 
  }
  get canvasCoor() {
    return this.canvas.getBoundingClientRect()
  }
  get offsetSpeed() {
    return this.field.cellSize / 6
  } 
}
