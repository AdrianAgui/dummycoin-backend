import Wallet from "./wallet";
import Transaction, { REWARD } from './transaction';
import { blockchainWallet } from './index';

describe('Transaction', () => {
  let wallet;
  let transaction;
  let amount;
  let recipientAddress;

  beforeEach(() => {
    wallet = new Wallet();
    recipientAddress = 'r3c1p13nt';
    amount = 5;
    transaction = Transaction.create(wallet, recipientAddress, amount);
  });

  it('outputs the amount substracted from the wallet balance', () => {
    const output = transaction.outputs.find((o) => o.address === wallet.publicKey);
    expect(output.amount).toEqual(wallet.balance - amount);
  });

  it('outputs the amount added to the recipient', () => {
    const output = transaction.outputs.find((o) => o.address === recipientAddress);
    expect(output.amount).toEqual(amount);
  });

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('inputs the sender address of the wallet', () => {
    expect(transaction.input.address).toEqual(wallet.publicKey);
  });

  it('inputs has a signature using the wallet', () => {
    expect(typeof transaction.input.signature).toEqual('object');
    expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));
  });

  it('validate a valid transaction ', () => {
    expect(Transaction.verify(transaction)).toBe(true);
  });

  it('invalidate a corrupt transaction', () => {
    transaction.outputs[0].amount = 500;
    expect(Transaction.verify(transaction)).toBe(false);
  });

  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 500;
      transaction = null;
    });

    it('does not create the transaction', () => {
      expect(() => {
        transaction = Transaction.create(wallet, recipientAddress, amount);
      }).toThrowError(`Amount ${amount} exceeds balance`);
    });
  });

  describe('updating a transaction', () => {
    let nextAmount;
    let nextRecipient;

    beforeEach(() => {
      nextAmount = 3;
      nextRecipient = 'n3xt-4ddr3ss';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it('substracts the next amount from the senders wallet', () => {
      const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
      expect(output.amount).toEqual(wallet.balance - amount - nextAmount);
    });

    it('outputs an amount for the next recipient', () => {
      const output = transaction.outputs.find(({ address }) => address === nextRecipient);
      expect(output.amount).toEqual(nextAmount);
    });
  });

  describe('creating reward transaction', () => {
    beforeEach(() => {
      transaction = Transaction.reward(wallet, blockchainWallet);
    });

    it('rewards the miners wallet', () => {
      expect(transaction.outputs.length).toEqual(2);

      let output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
      expect(output.amount).toEqual(REWARD);

      output = transaction.outputs.find(({ address }) => address === blockchainWallet.publicKey);
      expect(output.amount).toEqual(blockchainWallet.balance - REWARD);
    });
  });
});
