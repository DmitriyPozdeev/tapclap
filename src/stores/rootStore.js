import { makeAutoObservable, computed, get } from 'mobx'
import TileStore from './TileStore'
import FieldStore from './FieldStore'

export default class RootStore {
  canvas = null
  context = null
  minDestroy = 2
  points = 0
  stepRatio = 50
  mixCount = 3
  attempts = 7 
  isAnimation = false
  x = 70
  y =0
  constructor() {
    this.tile = new TileStore(this)
    this.field = new FieldStore(this)
    makeAutoObservable(this, {
      canvasCoordinates: computed,
    }) 
  }
  initGame({canvas, context}) {
    this.canvas = canvas
    this.context = context
  }
  run() {
    this.render()
    window.requestAnimationFrame(() => {
      this.run()
    })
  } 
  scanField() {
    const x = this.field.cells.filter(cell => {
      return cell.colorId === null
    }).sort((a,b) => a - b)
    x.map(cell => cell.colorId = 2)
    console.log(x)
    this.isAnimation = false
  }
  render() {
    if (this.isAnimation) {
      this.scanField()
    } 
  //const x = this.field.cells[0].getCoord().xs
  //const y = this.field.cells[3].getCoord().ys
  //this.scanField()
  //const size = this.field.cellSize
  //const imageData = this.context.getImageData(this.x, this.y, size, size * 3)
//
  //this.context.clearRect(this.x, this.y, size, size * 3)
//
  //this.y = this.y < 70 ? this.y += 10: this.y
  //this.context.putImageData(imageData, this.x, this.y)
  }

  start({canvas, context}) {
    this.initGame({canvas, context})
    this.field.initCells()
    this.field.initCols()
    this.tile.preloadAvailableList()
    .then(() => {
      this.field.fillCells()
      this.run()
    })
  }

  setPoints(amount) {
    this.points += 
      (amount * this.stepRatio) + 
      this.stepRatio * 
      (amount - this.minDestroy)
  }
  setAttempts() {
    this.attempts -= 1
  }
  
  filterColor(id) {
    return this.field.cells.slice().filter(cell => {
      return cell.colorId === id
    })
  } 
  bfs(index) {
    const adj = {}
    const validColorCells = this
      .filterColor(this.field.cells[index].colorId)

    validColorCells.map(cell => {
      return adj[cell.index] = cell.neighbors
    })

    const set = new Set(
      validColorCells.map(item => item.index)
    )
    const checkColor = (index) => set.has(index)
    let result = []
	  let queue = [index]
    let visited = new Set([])
    
	  while(queue.length > 0) {
	  	let v = queue.shift() 
	  	for(let neighbor of adj[v]) {
	  		if(!visited.has(neighbor) && checkColor(neighbor)) {                     
	  			visited.add(neighbor)
          queue.push(neighbor)
          result.push(neighbor) 
	  		}
	  	} 
	  }

    //const celsArr = this.field.cells.slice().filter((cel) => {
    //  return result.includes(cel.index) 
    //})
    //console.log(celsArr)
    //console.log(this.field.getCol(2))
	  return result
  }
  
  randomNum(max) {
    return Math.floor(Math.random() * max) 
  }
  get canvasCoor () {
    return this.canvas.getBoundingClientRect()
  }
}
