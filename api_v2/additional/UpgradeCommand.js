import {MAIN_RESOURCE} from '../constants/variables';
import HelpController from './HelpController';

let instance = null;

export default class UpgradeCommand {
  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute({area, cell}) {
    if (!this.help.isHaveCell(area, cell)) return;

    const nextImprovement = this.help.getWorldState()[area][cell].improvement.next_improvement;

    const {type, improvement} = this.gameData.buildings.reduce((acc, building) => {
      const needImprovement = building.improvements.find(({id}) => id === nextImprovement);
      return needImprovement ?
        {type: building.type, improvement: needImprovement}
        :
        acc;
    }, {});

    if (this.gameData.account[`${MAIN_RESOURCE}_amount`] < improvement.cost) return;

    this.help.subtractResource(MAIN_RESOURCE, improvement.cost);

    const {start, end} = this.help.getTimeInterval(improvement.construction_time);
    const newCell = this.help.createCell({type, cell, improvement, start, end})
    const newArea = this.help.createArea({area, cells: [newCell]})
    this.help.updateArea(area, newArea);

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();
  }
}
