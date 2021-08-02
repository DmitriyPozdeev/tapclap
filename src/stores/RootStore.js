import { makeAutoObservable, computed } from 'mobx'
import TileStore from './TileStore'
import FieldStore from './FieldStore'

export default class RootStore {
  canvas = null
  context = null
  minDestroy = 2
  points = 1234567890
  stepRatio = 50
  mixCount = 3
  attempts = 7 
  
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
  update() {
    if(this.field.isAnimate) {
      this.tile.currentList.forEach((row, i) => {
        row.forEach((tile, j) => {
          const currentIndex = i * this.field.size.cols + j
          const {xs} = this.field.cells[currentIndex].getCoord()
          if(tile.index !== currentIndex) {
            tile.xs -= this.offsetSpeed
            if(tile.xs === xs){
              tile.index = currentIndex
              this.field.cells[currentIndex].reset()
              this.tile.setCurrentDelete([])
              console.log(currentIndex) 
            }
          }
        })
        
        let diff = this.field.size.cols - row.length
        let count = 0
        for(let j = diff; row.length < this.field.size.cols; j++) {
          row.push({
            index: i * this.field.size.cols,
            colorId: this.randomNum(this.tile.srcs.length),
            xs: this.field.size.cols * this.field.cellSize + 
                diff  * this.field.cellSize + 
                count * this.field.cellSize * 2,
            ys: i * this.field.cellSize,
          })
          count+=1
        }
        count = 0
        //const control = this.tile.currentList.flat().filter((tile, i) => {
        //  return tile.xs === this.field.cells[i].xs
        //})
        //console.log(control)
        //if(control.length !== 0) this.field.isAnimate = false
      }) 
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
    if(this.field.isAnimate) {
      this.field.cells.forEach(cell => {
        const { index } = cell
        if (cell.image && this.tile.currentDelete.includes(index)) {
          cell.animateImage()
        }
      })
    }
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
