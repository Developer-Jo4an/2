import GameDataBasicController from './GameDataBasicController';
import moment from 'moment';
import {nowInSec} from './helpers/helpers';
import {
  amplBuilding,
  buildAreaResource,
  defaultBuildingInNewArea,
  defaultCellInNewArea,
  openAreaResource,
  repairAreaResource,
  undeletedBuildings,
  upgradeResource
} from './constants/variables';

class GameDataController extends GameDataBasicController {
  isHaveArea(area) {
    return this.gameData.account.world_state.hasOwnProperty(area);
  }

  isHaveCell(area, cell) {
    return this.gameData.account.world_state[area]?.[cell];
  }

  getWorldState() {
    return this.gameData.account.world_state;
  }

  updateAccountTime() {
    this.gameData.account.update_at = moment(nowInSec() * 1000).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
  }

  updateDisasterTime() {
    this.gameData.account.last_time_disaster = nowInSec();
  }

  getUpgradeDates(addedTime) {
    const nowDate = nowInSec();
    return {
      start: nowDate,
      end: nowDate + addedTime
    };
  }

  getCellByNearCell(area, cell, isPrev) {
    const cellNumber = +(cell.at(-1));
    const cellId = `cell_${cellNumber + (!isPrev ? 1 : -1)}`;

    return this.getWorldState()[area][cellId];
  }

  subtractResource(resourceType, sum) {
    this.gameData.account[`${resourceType}_amount`] -= sum;
  }

  addResource(resourceType, sum) {
    this.gameData.account[`${resourceType}_amount`] += sum;
  }

  updateArea(area, newAreaState) {
    const currentWorldState = this.getWorldState();

    this.gameData.account.world_state = {
      ...currentWorldState,
      [area]: newAreaState
    };
  }

  updateCell(area, cell, field, value) {
    const currentWorldState = this.getWorldState();

    this.gameData.account.world_state = {
      ...currentWorldState,
      [area]: {
        ...currentWorldState[area],
        [cell]: {
          ...currentWorldState[area][cell],
          [field]: value
        }
      }
    };
  }

  build({area, cell, building_type}) {
    if (!this.isHaveArea(area)) return;

    const improvement = this.gameData.buildings
    .find(({type}) => type === building_type)
      .improvements[0];

    this.subtractResource(buildAreaResource, improvement.cost);

    const {start, end} = this.getUpgradeDates(improvement.construction_time);

    this.updateAccountTime();

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
    if (!this.isHaveArea(area)) return;

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

    this.subtractResource(upgradeResource, improvement.cost);

    const {start, end} = this.getUpgradeDates(improvement.construction_time);

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

    this.updateAccountTime();

    this.updateArea(area, newAreaState);

    this.updateGameData();

    return this.gameData.account;
  }

  completeTutorial() {
    this.updateAccountTime();

    this.gameData.account.passed_tutorial = true;

    this.updateGameData();
  }

  open(area) {
    if (this.isHaveArea(area)) return;

    const improvement = this.gameData.buildings
    .find(({type}) => type === defaultBuildingInNewArea)
      .improvements[0];

    const currentWorldState = this.getWorldState();

    const upgradingTime = nowInSec();

    const openCostArea = this.gameData.areas.find(({name}) => name === area).open_cost;

    this.subtractResource(openAreaResource, openCostArea);

    this.gameData.account.world_state = {
      ...currentWorldState,
      [area]: {
        [defaultCellInNewArea]: {
          type: defaultBuildingInNewArea,
          cell: defaultCellInNewArea,
          improvement: improvement,
          produce_start: null,
          is_broken: false,
          last_time_collected: null,
          start_upgrading: upgradingTime,
          last_time_upgraded: upgradingTime
        }
      }
    };

    this.updateAccountTime();

    this.updateGameData();

    return this.gameData.account;
  }

  broke(cells) {
    if (!cells.length) return;

    cells.forEach(({area, cell}) => {
      if (!this.isHaveArea(area) || !this.isHaveCell(area, cell)) return;

      this.updateCell(area, cell, 'is_broken', true);
    });

    this.updateDisasterTime();

    this.updateAccountTime();

    this.updateGameData();

    return this.gameData.account;
  }

  produce({area, cell}) {
    if (!this.isHaveArea(area) || !this.isHaveCell(area, cell)) return;

    this.updateCell(area, cell, 'produce_start', nowInSec());

    this.updateAccountTime();

    this.updateGameData();

    return this.gameData.account;
  }

  repair({area, cell}) {
    if (!this.isHaveArea(area) || !this.isHaveCell(area, cell)) return;

    const currentWorldState = this.getWorldState();

    const {repair_cost} = currentWorldState[area][cell].improvement;

    this.subtractResource(repairAreaResource, repair_cost);

    this.updateCell(area, cell, 'is_broken', false);

    this.updateAccountTime();

    this.updateGameData();

    return this.gameData.account;
  }

  collect({area, cell}) {
    if (!this.isHaveArea(area) || !this.isHaveCell(area, cell)) return;

    const currentWorldState = this.getWorldState();

    const {
      improvement: {
        production_type,
        production_quantity,
        bonus_chance,
        bonus_multiplier
      }
    } = currentWorldState[area][cell];

    const bonus = Math.random() < bonus_chance ? bonus_multiplier : 1;

    const fromRoadAmpl = currentWorldState[area][defaultCellInNewArea].improvement.amplification_value;

    const prevCell = this.getCellByNearCell(area, cell, true);
    const nextCell = this.getCellByNearCell(area, cell, false);

    const fromOfficeAmpl = [prevCell, nextCell]
    .reduce((multiple, building) =>
        building?.type === amplBuilding ?
          multiple * building.improvement.amplification_value
          :
          multiple
      , 1);

    this.addResource(production_type, fromRoadAmpl * fromOfficeAmpl * bonus * production_quantity);

    this.updateCell(area, cell, 'last_time_collected', nowInSec());

    this.updateAccountTime();

    this.updateGameData();

    return this.gameData.account;
  }

  destroy({area, cell}) {
    if (!this.isHaveArea(area) || !this.isHaveCell(area, cell)) return;

    const currentWorldState = this.getWorldState();

    const {type} = currentWorldState[area][cell];

    if (undeletedBuildings.includes(type)) return;

    const newAreaState = {};

    for (const cellId in currentWorldState[area])
      if (cellId !== cell)
        newAreaState[cellId] = currentWorldState[area][cellId];

    this.updateArea(area, newAreaState);

    this.updateAccountTime();

    this.updateGameData();

    return this.gameData.account;
  }

  exchange({id, quantity}) {
    const { afford_type, receive_type, afford_quantity } = this.gameData.exchanger
      .find(({ id: exchangerId }) => exchangerId === id)

    this.gameData.account[`${receive_type}_amount`] += quantity
    this.gameData.account[`${afford_type}_amount`] -= quantity * afford_quantity
    this.gameData.account[`last_exchange_on_${receive_type}`] = nowInSec()

    this.updateAccountTime();

    this.updateGameData();

    return this.gameData.account
  }
}

export const gameDataController = new GameDataController();
