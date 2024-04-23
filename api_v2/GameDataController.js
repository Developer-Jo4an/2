import {basicGameData} from './constants/basic';
import {gameDataPresets} from './constants/presets';
import BuildCommand from './additional/BuildCommand';
import OpenCommand from './additional/OpenCommand';
import HelpController from './additional/HelpController';
import CollectCommand from './additional/CollectCommand';
import UpgradeCommand from './additional/UpgradeCommand';
import BrokeCommand from './additional/BrokeCommand';
import CompleteTutorialCommand from './additional/CompleteTutorialCommand';
import ProduceCommand from './additional/ProduceCommand';
import RepairCommand from './additional/RepairCommand';
import DestroyCommand from './additional/DestroyCommand';
import ExchangeCommand from './additional/ExchangeCommand';

export default class GameDataController {

  static _instance;

  static get instance() {
    if (!this._instance)
      this._instance = new GameDataController();

    return this._instance;
  }

  constructor() {
    this.gameData = {};
    this.preset = null;

    this.init()

    this.help = new HelpController(this.gameData, this.preset)

    this.commands = {
      collect: new CollectCommand(this.gameData),
      build: new BuildCommand(this.gameData),
      open: new OpenCommand(this.gameData),
      upgrade: new UpgradeCommand(this.gameData),
      broke: new BrokeCommand(this.gameData),
      completeTutorial: new CompleteTutorialCommand(this.gameData),
      produce: new ProduceCommand(this.gameData),
      repair: new RepairCommand(this.gameData),
      destroy: new DestroyCommand(this.gameData),
      exchange: new ExchangeCommand(this.gameData)
    }
  }

  init() {
    const params = new URL(location.href).search;
    const preset = new URLSearchParams(params).get('preset');

    preset ?
      this.setGameDataWidthPreset(preset)
      :
      this.setGameDataWithoutPreset();

    !this.preset && localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  setGameDataWithoutPreset() {
    const gameData = localStorage.getItem('gameData');

    this.gameData = gameData ?
      JSON.parse(gameData)
      :
      JSON.parse(JSON.stringify(basicGameData));
  }

  setGameDataWidthPreset(preset) {
    const presetGameData = gameDataPresets[preset];

    if (!presetGameData) {
      this.setGameDataWithoutPreset();
      return;
    }

    this.preset = preset;
    this.gameData = presetGameData;
  }

  executeCommand(commandName, params) {
    this.commands[commandName].execute(params)
    return {
      account: this.gameData.account
    }
  }
}

