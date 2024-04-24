import {DESTROY_RESOURCE, MAIN_RESOURCE, UNDELETED_BUILDINGS} from '../constants/variables';
import HelpController from './HelpController';

let instance = null;

export default class DestroyCommand {
  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute({area, cell}) {
    if (!this.help.isHaveCell(area, cell)) return;

    const currentWorldState = this.help.getWorldState();

    const {type, improvement} = currentWorldState[area][cell];

    if (
      UNDELETED_BUILDINGS.includes(type)
      ||
      this.gameData.account[`${MAIN_RESOURCE}_amount`] < improvement[DESTROY_RESOURCE]
    ) return;

    const newAreaState = {};
    for (const cellId in currentWorldState[area])
      if (cellId !== cell)
        newAreaState[cellId] = currentWorldState[area][cellId];

    this.help.updateArea(area, newAreaState);

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();
  }
}
