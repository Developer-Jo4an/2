import {IS_BROKEN_FIELD} from '../constants/variables';
import HelpController from './HelpController';

let instance = null;

export default class BrokeCommand {
  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute(cells) {
    cells.forEach(({area, cell}) => {
      if (!this.help.isHaveCell(area, cell)) return;

      this.help.updateCell(area, cell, IS_BROKEN_FIELD, true);
    });

    this.help.updateDisasterTime();

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();

    return this.gameData.account;
  }
}
