import { makeAutoObservable, computed } from 'mobx'

export default class FieldStore {
  constructor(rootStore) {
    this.root = rootStore
    this.cells = null
    this.size = {
      rows: 5,
      colls: 4,
    }
    //this.style = {
    //  width: null,
    //  height: null,
    //}
    makeAutoObservable(this, {
      style: computed,
    })
  }
  setEmptyCell(num) {
    this.cells[num].isEmpty = false
  }
  initCells() {
    this.cells = []
    for (let i = 0; i < this.size.rows; i++) {
      for (let j = 0; j < this.size.colls; j++) {
        this.cells.push(
          {
            address: {
              row: i,
              coll: j,
            },
            coordinates: {
              x: j * (this.root.tile.size + 1), 
              y: i * (this.root.tile.size + 1),
            },
            isEmpty: true,
          }
        ) 
      }
    }
  }

  get style() {
    return {
      width: this.size.colls * this.root.tile.size + this.size.colls,
      height: this.size.rows * this.root.tile.size + this.size.rows,
    }
  }
}
