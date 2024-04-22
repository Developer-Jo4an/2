import GameDataBasicController from './GameDataBasicController';
import moment from 'moment';
import {areaAlreadyPurchased, areaUnavailable} from './constants/errors';

class GameDataController extends GameDataBasicController {
  isHaveArea(area) {
    return this.gameData.account.world_state.hasOwnProperty(area);
  }

  getWorldState() {
    return this.gameData.account.world_state;
  }

  updateAccountTime(date) {
    this.gameData.account.update_at = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
  }

  getUpgradeDates(addedTime) {
    const nowDate = Date.now();
    return {
      start: nowDate,
      end: nowDate + addedTime
    };
  }

  subtractResource(resourceType, sum) {
    this.gameData.account[`${resourceType}_amount`] -= sum;
  }

  updateArea(area, newAreaState) {
    const currentWorldState = this.getWorldState();

    this.gameData.account.world_state = {
      ...currentWorldState,
      [area]: newAreaState
    };
  }


  build({area, cell, building_type}) {
    if (!this.isHaveArea(area)) return areaUnavailable;

    const improvement = this.gameData.buildings
    .find(({type}) => type === building_type)
      .improvements[0];

    this.subtractResource('money', improvement.cost);

    const {start, end} = this.getUpgradeDates(improvement.construction_time);

    this.updateAccountTime(start);

    const currentWorldState = this.getWorldState();

    const newAreaState = {
      ...currentWorldState[area],
      [cell]: {
        type: building_type,
        cell: cell,
        improvement: improvement,
        produce_start: null,
        is_broken: false,
        last_time_collected: null,
        start_upgrading: start,
        last_time_upgraded: end
      }
    };

    this.updateArea(area, newAreaState);

    this.updateGameData();

    return this.gameData.account;
  }

  upgrade({area, cell}) {
    if (!this.isHaveArea(area)) return areaUnavailable;

    const nextImprovement = this.gameData.account.world_state[area][cell].improvement.next_improvement;

    const {type, improvement} = this.gameData.buildings.reduce((acc, building) => {
      const needImprovement = building.improvements.find(({id}) => id === nextImprovement);
      if (needImprovement) {
        return {
          type: building.type,
          improvement: needImprovement
        };
      }
      return acc;
    }, {type: null, improvement: null});

    this.subtractResource('money', improvement.cost);

    const {start, end} = this.getUpgradeDates(improvement.construction_time);

    this.updateAccountTime(start);

    const currentWorldState = this.getWorldState();

    const newAreaState = {
      ...currentWorldState[area],
      [cell]: {
        type: type,
        cell: cell,
        improvement: improvement,
        produce_start: null,
        is_broken: false,
        last_time_collected: null,
        start_upgrading: start,
        last_time_upgraded: end
      }
    };

    this.updateArea(area, newAreaState);

    this.updateGameData();

    return this.gameData.account;
  }

  completeTutorial() {
    this.gameData.account.passed_tutorial = true;

    return this.gameData.account;
  }

  open(area) {
    if (this.isHaveArea(area)) return areaAlreadyPurchased;

    const improvement = this.gameData.buildings
    .find(({type}) => type === 'road')
      .improvements[0];

    this.subtractResource('money', improvement.cost);

    const {start, end} = this.getUpgradeDates(improvement.construction_time);

    this.updateAccountTime(start);

    const currentWorldState = this.getWorldState();

    this.gameData.account.world_state = {
      ...currentWorldState,
      [area]: {
        cell_0: {
          type: 'road',
          cell: 'cell_0',
          improvement: improvement,
          produce_start: null,
          is_broken: false,
          last_time_collected: null,
          start_upgrading: start,
          last_time_upgraded: end
        }
      }
    };

    this.updateGameData();

    return this.gameData.account;
  }
}

export const gameDataController = new GameDataController();
