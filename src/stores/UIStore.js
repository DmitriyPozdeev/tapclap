import { makeAutoObservable, computed } from 'mobx'

export default class UIStore {
  constructor(rootStore) {
    this.root = rootStore
    this._messages = {
      process: {
        title: null,
        text: null,
        smile: null,
      },
      error: {
        title: 'ОШИБКА',
        text: 'Игра невозможна, слишком высокое значение minDestroy',
        smile: null,
      },
      start: {
        title: 'ПРАВИЛА',
        text: `При клике на тайл сжигается область, 
        состоящая из группы прилегающих тайлов того же цвета, 
        размер группы не может быть меньше чем ${this.root.minDestroy}`,
        smile: null,
      },
      win: {
        title: 'ПОБЕДА',
        text: 'Вы победили!',
        smile: <span>&#129321;</span>,
      },
      lose: {
        title: 'ПРОИГРЫШ',
        text: 'Вы проиграли',
        smile: <span>&#128577;</span>,
      },
      mix: {
        title: 'ПЕРЕМЕШАТЬ',
        text: `У Вас нет доступных ходов,
        После закрытия окна
        тайлы будут перемешаны`,
        smile: <span>&#8635;</span>,
      },
      noMoves: {
        title: 'НЕТ ХОДОВ',
        text: `У Вас нет доступных ходов 
        и исчерпан лимит перемешиваний,
        вы проиграли`,
        smile: <span>&#128577;</span>,
      },
    }
    makeAutoObservable(this, {
      fieldSize: computed
    })
  }
  get progress() {
    return  (this.root.user.points / this.root.game.minWinPoints) * 100
  }
  get balanceMoves() {
    return this.root.game.moves - this.root.user.movesCount
  }
  get currentMessage() {
    return this._messages[this.root.user.status]
  }
  get fieldSize() {
    return {
      width: this.root.field.size.cols * this.root.field.cellSize,
      height: this.root.field.size.rows * this.root.field.cellSize,
    }
  }
}
