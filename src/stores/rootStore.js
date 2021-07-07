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
    makeAutoObservable(this, {
      canvasCoordinates: computed,
    }) 
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
      const {xs, ys} = this.field.fillRandomEmptyCell(colorId).coordinates
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

    const set = new Set(validColorCells.map(item => item.index))
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
    console.log(`Результат ${result}`)
	  return result
  }
  
  click(e) {
    const event = {
      x: e.clientX - this.canvasCoordinates.x,
      y: e.clientY - this.canvasCoordinates.y,
    }
    const clickedCell = this.field.cells.find(cell => {
      return (
        (cell.coordinates.xs <= event.x) &&  
        (cell.coordinates.xe >= event.x) &&
        (cell.coordinates.ys <= event.y) &&  
        (cell.coordinates.ye >= event.y)
      )
    })
    const { index } = clickedCell
    const arr = this.bfs(index)
    arr.map( item => this.field.clearTile(item))
  }  
  run() {
    window.requestAnimationFrame(() => {
      this.render()
    })
  } 
  render() {
    for (let i = 0; i < this.field.cellsAmount; i++) {
      const {tile, colorId} = this.tile.list[this.randomNum(5)]
      const {xs, ys} = this.field.fillRandomEmptyCell(colorId).coordinates
      this.context.drawImage(tile, xs, ys, this.tile.size, this.tile.size)
    }
    console.log(this.field.cells)
  }
  start({canvas, context}) {
    this.initGame({canvas, context})
    this.field.initCells()
    this.tile.preload()
    .then(() => this.run())
    
  }
  get canvasCoordinates () {
    return this.canvas.getBoundingClientRect()
  }
}
