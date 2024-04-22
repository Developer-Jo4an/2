import {basicGameData} from './constants/basic';

export default class GameDataBasicController {
  constructor() {
    this.gameData = {};
  }

  initGameData() {
    const gameData = localStorage.getItem('gameData');

    if (!gameData) {
      localStorage.setItem('gameData', JSON.stringify(basicGameData));
      this.gameData = JSON.parse(JSON.stringify(basicGameData));
      return;
    }
    this.gameData = JSON.parse(gameData);
  }

  getGameData() {
    return this.gameData;
  }

  updateGameData() {
    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }
}
