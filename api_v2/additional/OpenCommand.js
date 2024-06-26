import {DEFAULT_BUILDING, DEFAULT_CELL, MAIN_RESOURCE, OPEN_RESOURCE} from '../constants/variables';
import HelpController from './HelpController';

let instance = null;

export default class OpenCommand {

  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute({ area }) {
    if (this.help.isHaveArea(area)) return;

    const improvement = this.help.getStartImprovement(DEFAULT_BUILDING)

    const openCost = this.gameData.areas.find(({name}) => name === area).open_cost;

    if (this.gameData.account[`${MAIN_RESOURCE}_amount`] < openCost) return;

    this.help.subtractResource(MAIN_RESOURCE, openCost);

    const { start, end } = this.help.getTimeInterval(0)
    const newCell = this.help.createCell({ cell: DEFAULT_CELL, improvement, type: DEFAULT_BUILDING, start, end })
    const newArea = this.help.createArea({ area, cells: [newCell]})
    this.help.updateArea(area, newArea)

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();
  }
}
