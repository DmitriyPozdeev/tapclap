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
  update() {

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
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderTiles()
  }
  renderTiles() {
    this.tile.tiles.forEach( tile => {
      this.context.drawImage(
        this.tile.imgList[tile.colorId], tile.x, tile.y, 70, 70
      )
    })
  }
  start({canvas, context}) {
    this.initGame({canvas, context})
    this.field.initCells()
    this.field.initCols()
    this.tile.preloadImgList()
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
    return this.tile.tiles.slice().filter(tile => {
      return tile.colorId === id
    })
  } 
  bfs(index) {
    const adj = {}
    const validColorTiles = this
      .filterColor(this.tile.tiles[index].colorId)
    validColorTiles.map(tile => {
      return adj[tile.index] = this.field.cells[tile.index].neighbors
    })
    const set = new Set(
      validColorTiles.map(item => item.index)
    )
    const checkColor = (index) => set.has(index)
    let result = []
	  let queue = [index]
    let visited = new Set([])
    
	  while(queue.length > 0) {
	  	let v = queue.shift() 
      console.log(adj)
	  	for(let neighbor of adj[v]) {
	  		if(!visited.has(neighbor) && checkColor(neighbor)) {                     
	  			visited.add(neighbor)
          queue.push(neighbor)
          result.push(neighbor) 
	  		}
	  	} 
	  }
	  return result
  }
  
  randomNum(max) {
    return Math.floor(Math.random() * max) 
  }
  get canvasCoor () {
    return this.canvas.getBoundingClientRect()
  }
}
