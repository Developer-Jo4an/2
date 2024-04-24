import {AMPL_BUILDING, DEFAULT_CELL, FIELD_BUILDING, LAST_TIME_COLLECTED_FIELD} from '../constants/variables';
import {nowInSec} from '../helpers/helpers';
import HelpController from './HelpController';

let instance = null;

export default class CollectCommand {

  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  getBonus({area, cell, improvement: {bonus_chance, bonus_multiplier, production_quantity}}) {
    const multiplier = Math.random() < bonus_chance ? bonus_multiplier : 1;

    const fromRoadAmpl = this.help.getWorldState()[area][DEFAULT_CELL].improvement.amplification_value;

    const fromOfficeAmpl = Object.values(this.help.getNearCells(area, cell))
    .reduce((multiple, building) =>
        building?.type === AMPL_BUILDING ?
          multiple * building.improvement.amplification_value
          :
          multiple
      , 1);

    return fromRoadAmpl * fromOfficeAmpl * multiplier * production_quantity;
  }

  fieldCollect({area, cell}) {
    const {improvement} = this.help.getWorldState()[area][cell];

    const totalEarn = this.getBonus({area, cell, improvement});

    this.help.addResource(improvement.production_type, totalEarn);

    return true;
  }

  collect({area, cell}) {
    const {improvement} = this.help.getWorldState()[area][cell];

    const totalEarn = this.getBonus({area, cell, improvement});

    const {production_cost_type, production_cost, production_type} = improvement;

    const isCollected = this.gameData.account[`${production_cost_type}_amount`] >= production_cost;

    if (!isCollected) return false;

    this.help.subtractResource(production_cost_type, production_cost);
    this.help.addResource(production_type, totalEarn);

    return true;
  }

  execute({area, cell}) {
    if (!this.help.isHaveCell(area, cell)) return;

    const {type} = this.help.getWorldState()[area][cell];

    const isCollected = type === FIELD_BUILDING ?
      this.fieldCollect({area, cell})
      :
      this.collect({area, cell});

    if (!isCollected) return;

    this.help.updateCell(area, cell, LAST_TIME_COLLECTED_FIELD, nowInSec());

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();
  }
}
