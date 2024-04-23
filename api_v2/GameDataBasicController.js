import {basicGameData} from './constants/basic';
import {gameDataPresets} from './constants/presets';

export default class GameDataBasicController {
  constructor() {
    this.gameData = {};
    this.preset = null
  }

  setGameWithoutPresetData() {
    const gameData = localStorage.getItem('gameData');

    if (!gameData) {
      this.gameData = JSON.parse(JSON.stringify(basicGameData));
      this.updateGameData();
      return;
    }

    this.gameData = JSON.parse(gameData)
  }

  setGameDataWidthPreset(preset) {
    const presetGameData = gameDataPresets[preset]

    if (presetGameData) {
      this.preset = preset
      this.gameData = presetGameData;
      return;
    }

    this.setGameWithoutPresetData()
  }

  initGameData() {
    const preset = new URLSearchParams(new URL(location.href).search).get('preset');

    if (!preset) {
      this.setGameWithoutPresetData();
      return;
    }

    this.setGameDataWidthPreset(preset);
  }

  getGameData() {
    return this.gameData;
  }

  updateGameData() {
    if (!this.preset)
      localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }
}
