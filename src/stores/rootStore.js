import { makeAutoObservable, computed } from 'mobx'
import TileStore from './TileStore'
import FieldStore from './FieldStore'

export default class RootStore {
  constructor() {
    this.canvas = null
    this.context = null
    this.tile = new TileStore(this)
    this.field = new FieldStore(this)
    this.minDestroy = 2
    this.points = 0
    this.stepRatio = 50
    this.mixCount = 3
    this.attempts = 7 
    
    makeAutoObservable(this, {
      canvasCoordinates: computed,
    }) 
  }

  run() {
    window.requestAnimationFrame(() => {
      this.render()
    })
  } 
  render() {
    this.field.fillCells()
  }

  start({canvas, context}) {
    this.initGame({canvas, context})
    this.field.initCells()
    this.tile.preload()
    .then(() => this.run())
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
  randomNum(max) {
    return Math.floor(Math.random() * max) 
  }
  mixTiles() {
    const colorIds = this.field.cells
    .slice()
    .sort(() => Math.random() - 0.5)
    .map( item => item.colorId)
    this.field.clearField()
    colorIds.map( colorId => {
      const {xs, ys} = this.field.fillRandomEmptyCell(colorId)
      const {tile} = this.tile.list[colorId]
      this.context.drawImage(tile, xs, ys, this.tile.size, this.tile.size)
    })
  }
  initGame({canvas, context}) {
    this.canvas = canvas
    this.context = context
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
	  return result
  }
  
  click(e) {
    const eventCoor = {
      x: e.clientX - this.canvasCoor.x,
      y: e.clientY - this.canvasCoor.y,
    }
    const targetCell = this.field.cells.find(cell => {
      return (
        (cell.coor.xs <= eventCoor.x) &&  
        (cell.coor.xe >= eventCoor.x) &&
        (cell.coor.ys <= eventCoor.y) &&  
        (cell.coor.ye >= eventCoor.y)
      )
    })
    const { index } = targetCell
    const deletedTiles = this.bfs(index)
    const lengthTiles = deletedTiles.length
    if (lengthTiles >= this.minDestroy && targetCell.colorId !== null) {
      deletedTiles.map( index => this.field.clearTile(index))
      this.setPoints(lengthTiles)
      this.setAttempts()
    }
  }  
  
  get canvasCoor () {
    return this.canvas.getBoundingClientRect()
  }
}
