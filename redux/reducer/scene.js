import Builder from '../../utils/redux/builder';
import {states} from '../../constants/empire';
import {importControllerJS} from '../../utils/scene/utils/helpers/import';
import {getBuildingSettings} from '../../utils/empire/data';
import tutorialController from '../../controllers/empire/tutorial/TutorialController';

let instance;
let api;
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
  saveData(state, {payload: {areas, buildings, exchanger, account}}) {

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

    instance = (await importControllerJS()).default.instance;
    api = (await import('/api_v2/GameDataController')).default.instance;
    await instance.loadingPromise;

    return api.gameData;
  }
})
.createExtraReducer({
  thunkName: 'build',
  func: params => {
    const account = api.executeCommand('build', params);
    global.window?.soundManager?.onPlay('building',);
    return account;
  }
})
.createExtraReducer({
  thunkName: 'upgrade',
  func: params => {
    const account = api.executeCommand('upgrade', params);
    global.window?.soundManager?.onPlay('upgrade',);
    return account;
  }
})
.createExtraReducer({
  thunkName: 'completeTutorial',
  saveData(state) {
    state.worldState.passed_tutorial = true;
  },
  func: (params, state) => {
    if (state.worldState.passed_tutorial) return;
    api.executeCommand('completeTutorial');
  }
})
.createExtraReducer({
  thunkName: 'open',
  func: params => api.executeCommand('open', params)
})
.createExtraReducer({
  thunkName: 'broke',
  func: params => {
    params.cells.forEach(data => data.reason = params.type);
    return api.executeCommand('broke', params.cells);
  }
})
.createExtraReducer({
  thunkName: 'update',
  func: () => api.gameData
})
.createExtraReducer({
  thunkName: 'produce',
  func: params => api.executeCommand('produce', params)
})
.createExtraReducer({
  thunkName: 'repair',
  func: params => {
    const account = api.executeCommand('repair', params);
    global.window?.soundManager?.onPlay('repair',);
    return account;
  }
})
.createExtraReducer({
  thunkName: 'collect',
  func: params => api.executeCommand('collect', params)
})
.createExtraReducer({
  thunkName: 'destroy',
  func: params => {
    const account = api.executeCommand('destroy', params);
    global.window?.soundManager?.onPlay('destroy',);
    return account;
  }
})
.createExtraReducer({
  thunkName: 'exchange',
  func: params => api.executeCommand('exchange', params)
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

