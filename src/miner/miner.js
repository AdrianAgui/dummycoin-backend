import { Transaction, blockchainWallet } from "../wallet";
import { MESSAGE } from '../service/p2p';

class Miner {
  constructor(blockchain, p2pService, wallet) {
    this.blockchain = blockchain;
    this.p2pService = p2pService;
    this.wallet = wallet;
  }

  mine() {
    const { blockchain: { memoryPool }, wallet, p2pService } = this;

    if (memoryPool.transactions.length === 0) throw Error('There are non unconfirmed transactions.');

    memoryPool.transactions.push(Transaction.reward(wallet, blockchainWallet));
    const block = this.blockchain.addBlock(memoryPool.transactions);
    p2pService.sync();
    memoryPool.wipe();
    p2pService.broadcast(MESSAGE.WIPE);

    return block;
  }
}

export default Miner;
