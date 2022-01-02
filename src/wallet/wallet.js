import { elliptic, genHash } from "../modules";

const INITIAL_BALANCE = 100;

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
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
}

export { INITIAL_BALANCE };
export default Wallet;
