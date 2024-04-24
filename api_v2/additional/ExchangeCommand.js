import {nowInSec} from '../helpers/helpers';
import HelpController from './HelpController';

let instance = null;

export default class ExchangeCommand {
  constructor(gameData) {
    if (instance) return instance;
    instance = this;

    this.gameData = gameData;
    this.help = new HelpController();
  }

  execute({id, quantity}) {
    const {afford_type, receive_type, afford_quantity} = this.gameData.exchanger
    .find(({id: exchangerId}) => exchangerId === id);

    //todo: Возможно сделать до проверку на то, хватает ли ресурсов

    this.help.addResource(receive_type, quantity)
    this.help.subtractResource(afford_type, quantity * afford_quantity)
    this.gameData.account[`last_exchange_on_${receive_type}`] = nowInSec();

    this.help.updateAccountTime();

    this.help.updateGameDataInStorage();
  }
}
