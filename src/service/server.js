import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import Blockchain from '../blockchain';
import Miner from '../miner';
import Wallet from '../wallet';
import P2PService, { MESSAGE } from './p2p';

const { PORT = 3000 } = process.env;
const endpoint = (arg) => `/api/v1/${arg}`;

const app = express();

const blockchain = new Blockchain();
const wallets = [];
const minerWallet = new Wallet(blockchain, 0);
const p2pService = new P2PService(blockchain);
const miner = new Miner(blockchain, p2pService, minerWallet);

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  console.log('REQUEST Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Port: ', PORT);
  console.log('Body: ', req.body);
  next();
});

app.get(endpoint(''), (req, res) => {
  res.send('<h1>Welcome to DummyCoin Backend</h1>');
});

app.get(endpoint('blocks'), (req, res) => {
  res.json({ length: blockchain.blocksLength(), blocks: blockchain.blocks });
});

app.get(endpoint('transactions'), (req, res) => {
  const {
    memoryPool: { transactions }
  } = blockchain;
  res.json({ length: transactions.length, txs: transactions });
});

app.get(endpoint('mine/transactions'), (req, res) => {
  try {
    miner.mine();
    res.redirect(endpoint('blocks'));
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get(endpoint('wallet'), (req, res) => {
  const {
    query: { key }
  } = req;
  const wallet = wallets.find((w) => w.publicKey === key);
  if (wallet) {
    const { currentBalance } = wallet;
    res.json({ key, currentBalance });
  } else {
    res.status(404).json({
      error: 'Wallet not found'
    });
  }
});

app.get(endpoint('wallets'), (req, res) => {
  res.json({ wallets });
});

app.post(endpoint('wallet'), (req, res) => {
  const wallet = new Wallet(blockchain);
  wallets.push(wallet);
  const { publicKey } = wallet;
  res.json({ publicKey });
});

app.post(endpoint('transaction'), (req, res) => {
  const {
    body: { sender, recipient, amount }
  } = req;
  try {
    const wallet = wallets.find((w) => w.publicKey === sender);
    if (wallet) {
      const tx = wallet.createTransaction(recipient, amount);
      p2pService.broadcast(MESSAGE.TX, tx);
      res.json(tx);
    } else {
      res.status(404).json({
        error: 'Wallet not found'
      });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.use((req, res) => {
  console.log(req.path);
  res.status(404).json({
    error: 'Not found'
  });
});

app.listen(PORT, () => {
  console.log(`Service HTTP:${PORT} listening...`);
  p2pService.listen();
});
