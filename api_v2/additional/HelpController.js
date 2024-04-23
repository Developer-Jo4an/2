import {nowInSec} from '../helpers/helpers';
import moment from 'moment/moment';

let instance = null;

export default class HelpController {

  constructor(gameData, preset) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.preset = preset;
  }

  updateGameDataInStorage() {
    !this.preset && localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  getWorldState() {
    return this.gameData.account.world_state;
  }

  isHaveArea(area) {
    return this.getWorldState().hasOwnProperty(area);
  }

  isHaveCell(area, cell) {
    return !!this.getWorldState()[area]?.hasOwnProperty(cell);
  }

  getTimeInterval(extraTime) {
    const nowDate = nowInSec();
    return {
      start: nowDate,
      end: nowDate + extraTime
    };
  }

  updateAccountTime() {
    const momentNow = moment(Date.now())
    const format = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

    this.gameData.account.update_at = momentNow.format(format);
  }

  updateDisasterTime() {
    this.gameData.account.last_time_disaster = nowInSec();
  }

  createArea({area, cells}) {
    return {
      ...this.getWorldState()[area],
      ...cells
    }
  }

  updateArea(area, newArea) {
    const currentWorldState = this.getWorldState();

    this.gameData.account.world_state = {
      ...currentWorldState,
      [area]: newArea
    };
  }

  createCell({cell, type, improvement, start, end}) {
    return {
      [cell]: {
        cell,
        type,
        improvement,
        start_upgrading: start,
        last_time_upgraded: end,
        produce_start: null,
        is_broken: false,
        last_time_collected: null,
      }
    }
  }

  updateCell(area, cell, field, fieldValue) {
    const currentWorldState = this.getWorldState();

    this.gameData.account.world_state = {
      ...currentWorldState,
      [area]: {
        ...currentWorldState[area],
        [cell]: {
          ...currentWorldState[area][cell],
          [field]: fieldValue
        }
      }
    };
  }

  addResource(resourceType, sum) {
    this.gameData.account[`${resourceType}_amount`] += sum;
  }

  subtractResource(resourceType, sum) {
    this.gameData.account[`${resourceType}_amount`] -= sum;
  }

  getNearCells(area, cell) {
    const currentWorldState = this.getWorldState();
    const currentCellNumber = +cell.at(-1);

    const prevCell = currentWorldState[area][`cell_${currentCellNumber - 1}`];
    const nextCell = currentWorldState[area][`cell_${currentCellNumber + 1}`];

    return {prevCell, nextCell};
  }

  getStartImprovement(buildingType) {
    const needBuildings = this.gameData.buildings.find(({ type }) => type === buildingType)
    return needBuildings.improvements.find(({ is_start_improvement }) => is_start_improvement)
  }
}

