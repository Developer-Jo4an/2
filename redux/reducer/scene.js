import Builder from '../../utils/redux/builder';
import {states} from '../../constants/empire';
import {brokeBuildings, collect, destroy, exchange, getSettings, open, produce, repair, tasks} from '../../api/empire';
import {importControllerJS} from '../../utils/scene/utils/helpers/import';
import {getBuildingSettings} from '../../utils/empire/data';
import tutorialController from '../../controllers/empire/tutorial/TutorialController';
import {gameDataController} from '../../api_v2/GameDataController';

let instance;


let isTutorialShown;

try {
  isTutorialShown = localStorage.getItem('empireTutorial');
} catch (e) {

}

const builder = new Builder({
  name: 'scene',
  initialState: {
    state: 'loadManifest',
    settings: null,
    worldState: null,
    tasks: [],
    isTutorialShown: !!isTutorialShown,
    loadingProgress: 0,
    previousStates: []
  },
  reducers: {
    onShowTutorial(state) {
      state.isTutorialShown = true;
      try {
        localStorage.setItem('empireTutorial', 'true');
      } catch (e) {
      }
      tutorialController.check(state.worldState);
    },
    onReady(state) {
      state.ready = true;
    },
    onLoadingProgress(state, {payload: progress}) {
      state.loadingProgress = progress;
    },
    requestPreviousState(state) {
      if (state.previousStates.length)
        state.state = state.previousStates.splice(-1, 1)[0];
    },
    requestState(state, action) {
      let nextState = action.payload;

      if (!states[state.state].availableStates || states[state.state].availableStates.indexOf(nextState) !== -1) {
        state.previousStates.push(state.state);
        state.state = nextState;
      }
    },
  }
});

builder
.createSelector('building', (state, type) => {
  return {
    settings: getBuildingSettings(state.scene.settings, type),
    worldState: state.scene.worldState
  };
})
.createExtraReducer({
  thunkName: 'load',
  saveData(state, {payload}) {
    const {areas, buildings, exchanger, account} = payload;

    updateState(account, state);

    state.settings = {
      areas,
      buildings: partsBuildings(buildings)
    };

    state.exchanger = exchanger;

    instance.updateSettings(state.settings);
    instance.updateWorldState(state.worldState, true);

    state.ready = true;
    state.state = 'loadComplete';
  },
  func: async function () {
    gameDataController.initGameData();

    instance = (await importControllerJS()).default.instance;

    const data = gameDataController.getGameData();

    await instance.loadingPromise;

    return data;
  }
})
.createExtraReducer({
  thunkName: 'build',
  saveData(state, {payload: account}) {
    updateState(account, state);
    instance.updateWorldState(state.worldState, true);
  },
  func: async function ({area, cell, type}) {
    const account = gameDataController.build({area, cell, building_type: type});
    global.window?.soundManager?.onPlay('building',);
    return account;
  }
})
.createExtraReducer({
  thunkName: 'upgrade',
  saveData(state, {payload: account}) {
    updateState(account, state);
    instance.updateWorldState(state.worldState, true);
  },
  func: async function (data) {
    const account = gameDataController.upgrade(data);
    global.window?.soundManager?.onPlay('upgrade',);
    return account;
  }
})
.createExtraReducer({
  thunkName: 'completeTutorial',
  saveData(state, {payload: account}) {
    if (account) {
      updateState(account, state);
      instance.updateWorldState(state.worldState, true);
    }
  },
  func: async function (params, state) {
    if (state.worldState.passed_tutorial) return;
    return gameDataController.completeTutorial();
  }
})
.createExtraReducer({
  thunkName: 'open',
  saveData(state, {payload: account}) {
    updateState(account, state);
    instance.updateWorldState(state.worldState, true);
  },
  func: async function ({area}) {
    return gameDataController.open(area);
  }
})
.createExtraReducer({
  thunkName: 'exchange',
  func: async function ({id, quantity}) {
    const {data} = await exchange({id, receive_quantity: quantity});
    return {account: data};
  }
})
.createExtraReducer({
  thunkName: 'tasks',
  saveData(state, {payload}) {
    state.tasks = payload.results;
  },
  func: async function () {
    const {data} = await tasks();
    return data;
  }
})
.createExtraReducer({
  thunkName: 'collect',
  func: async function ({cell, area}) {
    const {data} = await collect({area, cell});
    return data;
  }
})
.createExtraReducer({
  thunkName: 'destroy',
  func: async function (data) {
    const {data: result} = await destroy(data);
    global.window?.soundManager?.onPlay('destroy',);
    return result;
  }
})
.createExtraReducer({
  thunkName: 'update',
  func: async function () {
    const {data} = await getSettings();
    return data;
  }
})
.createExtraReducer({
  thunkName: 'broke',
  func: async function ({cells, type}) {

    cells.forEach(data => data.reason = type);

    const {data} = await brokeBuildings(cells);

    return {account: data};
  }
})
.createExtraReducer({
  thunkName: 'repair',
  func: async function (params) {
    const {data} = await repair(params);
    global.window?.soundManager?.onPlay('repair',);
    return data;
  }
})
.createExtraReducer({
  thunkName: 'produce',
  func: async function ({cellId, area}) {
    const {data} = await produce({area, cell: cellId});

    return data;
  }
})
.addMatcher(({payload}) => !!payload?.account, (state, {payload: {account}}) => {
  updateState(account, state);
  instance.updateWorldState(state.worldState);
});

function updateState(account, state) {
  const data = {
    ...account,
    world_state: account.world_state
  };
  state.worldState = data;
  tutorialController.check(data);
}

function partsBuildings(buildings) {
  buildings.forEach(building => {
    let improvement = building.improvements.find(({is_start_improvement}) => is_start_improvement);
    const improvements = [improvement];

    while (improvement.next_improvement) {
      improvement = building.improvements.find(({id}) => id === improvement.next_improvement);
      improvements.push(improvement);
    }

    building.improvements = improvements;
  });

  return buildings;
}

builder.create();
const scene = builder.export();
export default scene;

export const {requestState, onReady} = scene.actions;
export const {load} = scene.thunks;
export const {useScene, useBuilding} = scene.selectors;

export function getNextState(currentState) {
  let nextState = states[currentState]?.availableStates[0];
  if (!nextState) {
    const keys = Object.keys(states);
    nextState = keys[Math.min(keys.indexOf(currentState) + 1, keys.length - 1)];
  }
  return nextState;
}

