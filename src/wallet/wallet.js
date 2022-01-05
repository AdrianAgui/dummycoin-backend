import { elliptic, genHash } from "../modules";
import Transaction from './transaction';

const INITIAL_BALANCE = 100;

class Wallet {
  constructor(blockchain, initialBalance = INITIAL_BALANCE) {
    this.balance = initialBalance;
    this.keyPair = elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.blockchain = blockchain;
  }

  toString() {
    const { balance, publicKey } = this;

    return ` Wallet - 
      publicKey       : ${publicKey}
      balance         : ${balance}
    `;
  }

  sign(data) {
    return this.keyPair.sign(genHash(data));
  }

  createTransaction(recipientAddress, amount) {
    const { blockchain: { memoryPool } } = this;
    const balance = this.calculateBalance();

    if (amount > balance) throw Error(`Amount: ${amount} exceeds current balance: ${balance}`);

    let tx = memoryPool.find(this.publicKey);
    if (tx) {
      tx.update(this, recipientAddress, amount);
    } else {
      tx = Transaction.create(this, recipientAddress, amount);
      memoryPool.addOrUpdate(tx);
    }

    return tx;
  }

  calculateBalance() {
    const { blockchain: { blocks = [] }, publicKey } = this;
    let { balance } = this;
    const txs = [];

    blocks.forEach(({ data = [] }) => {
      if (Array.isArray(data)) data.forEach((tx) => txs.push(tx));
    });

    const walletInputTxs = txs.filter((tx) => tx.input.address === publicKey);
    let timestamp = 0;

    if (walletInputTxs.length > 0) {
      const recentInputTx = walletInputTxs
        .sort((a, b) => a.input.timestamp - b.input.timestamp)
        .pop();
      balance = recentInputTx.outputs.find(({ address }) => address === publicKey).amount;
      timestamp = recentInputTx.input.timestamp;
    }

    txs
      .filter(({ input }) => input.timestamp > timestamp)
      .forEach(({ outputs }) => {
        outputs.forEach(({ address, amount }) => {
          if (address === publicKey) balance += amount;
        });
      });

    return balance;
  }
}

export { INITIAL_BALANCE };
export default Wallet;
