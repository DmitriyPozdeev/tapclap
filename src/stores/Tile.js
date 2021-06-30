  export default class Tile {
    constructor(id) {
      this.id = id
      this.color = this.getRandomColor(3)
      this.adress = null
    }
    getRandomColor(max) {
      const colorsList = ['red', 'green', 'blue']
      return colorsList[Math.floor(Math.random() * max)]
    }
  }