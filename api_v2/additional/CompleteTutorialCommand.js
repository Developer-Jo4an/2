import HelpController from './HelpController';

let instance = null;

export default class CompleteTutorialCommand {
  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute() {
    this.gameData.account.passed_tutorial = true;

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();
  }
}
