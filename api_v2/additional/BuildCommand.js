import {MAIN_RESOURCE} from '../constants/variables';
import HelpController from './HelpController';

let instance = null;

export default class BuildCommand {

  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute({area, cell, type}) {
    if (!this.help.isHaveArea(area)) return;

    const improvement = this.help.getStartImprovement(type);

    if (this.gameData.account[`${MAIN_RESOURCE}_amount`] < improvement.cost) return;

    this.help.subtractResource(MAIN_RESOURCE, improvement.cost);

    const {start, end} = this.help.getTimeInterval(improvement.construction_time);
    const newCell = this.help.createCell({type, cell, improvement, start, end});
    const newArea = this.help.createArea({area, cells: [newCell]});
    this.help.updateArea(area, newArea);

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();
  }
}
