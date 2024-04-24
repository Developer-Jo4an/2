import { IS_BROKEN_FIELD, MAIN_RESOURCE, PRODUCE_START_FIELD } from '../constants/variables'
import HelpController from './HelpController';
import { nowInSec } from '../helpers/helpers'

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

    const repairCost = currentWorldState[area][cell].improvement.repair_cost;

    if (this.gameData.account[`${MAIN_RESOURCE}_amount`] < repairCost) return;

    this.help.subtractResource(MAIN_RESOURCE, repairCost);

    this.help.updateCell(area, cell, IS_BROKEN_FIELD, false);
    this.help.updateCell(area, cell, PRODUCE_START_FIELD, nowInSec())

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();
  }
}
