import {AMPL_BUILDING, DEFAULT_CELL, LAST_TIME_COLLECTED_FIELD} from '../constants/variables';
import {nowInSec} from '../helpers/helpers';
import HelpController from './HelpController';

let instance = null

export default class CollectCommand {

  constructor(gameData) {
    if (instance) return instance
    instance = this

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute({area, cell}) {
    if (!this.help.isHaveCell(area, cell)) return;

    const currentWorldState = this.help.getWorldState();

    const {
      improvement: {
        production_type,
        production_quantity,
        bonus_chance,
        bonus_multiplier
      }
    } = currentWorldState[area][cell];

    const bonus = Math.random() < bonus_chance ? bonus_multiplier : 1;
    const fromRoadAmpl = currentWorldState[area][DEFAULT_CELL].improvement.amplification_value;
    const nearCells = this.help.getNearCells(area, cell)
    const fromOfficeAmpl = Object.values(nearCells)
    .reduce((multiple, building) =>
        building?.type === AMPL_BUILDING ?
          multiple * building.improvement.amplification_value
          :
          multiple
      , 1);

    const totalQuantity = fromRoadAmpl * fromOfficeAmpl * bonus * production_quantity

    this.help.addResource(production_type, totalQuantity);

    this.help.updateCell(area, cell, LAST_TIME_COLLECTED_FIELD, nowInSec());

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();

    return this.gameData.account;
  }
}
