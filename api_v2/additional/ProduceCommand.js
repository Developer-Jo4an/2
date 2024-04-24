import {PRODUCE_START_FIELD} from '../constants/variables';
import {nowInSec} from '../helpers/helpers';
import HelpController from './HelpController';

let instance = null;

export default class ProduceCommand {
  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute({ area, cellId: cell }) {
    if (!this.help.isHaveCell(area, cell)) return;

    this.help.updateCell(area, cell, PRODUCE_START_FIELD, nowInSec());

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();
  }
}
