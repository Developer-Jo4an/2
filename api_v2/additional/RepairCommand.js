import {IS_BROKEN_FIELD, MAIN_RESOURCE} from '../constants/variables';
import HelpController from './HelpController';

let instance = null;

export default class RepairCommand {
  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute({area, cell}) {
    if (!this.help.isHaveCell(area, cell)) return;

    const currentWorldState = this.help.getWorldState();

    const {repair_cost} = currentWorldState[area][cell].improvement;

    this.help.subtractResource(MAIN_RESOURCE, repair_cost);

    this.help.updateCell(area, cell, IS_BROKEN_FIELD, false);

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();

    return this.gameData.account;
  }
}
