import express from "express";
import bodyParser from "body-parser";

import Blockchain from "../blockchain";
import Wallet from "../wallet";
import P2PService, { MESSAGE } from "./p2p";
import Miner from '../miner';

const { PORT = 3000 } = process.env;

const app = express();

const blockchain = new Blockchain();
const wallet = new Wallet(blockchain);
const minerWallet = new Wallet(blockchain, 0);
const p2pService = new P2PService(blockchain);
const miner = new Miner(blockchain, p2pService, minerWallet);

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log('REQUEST Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Port: ', PORT);
  console.log('Body: ', req.body);
  next();
});

app.get("/", (req, res) => {
  res.send('<h1>Welcome to DummyCoin Backend</h1>');
});

app.get("/blocks", (req, res) => {
  res.json(blockchain.blocks);
});

app.get('/transactions', (req, res) => {
  const { memoryPool: { transactions } } = blockchain;
  res.json(transactions);
});

app.get('/mine/transactions', (req, res) => {
  try {
    miner.mine();
    res.redirect('/blocks');
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get('/wallet', (req, res) => {
  const { publicKey, balance  } = wallet;
  res.json({ publicKey, balance});
});

app.post('/wallet', (req, res) => {
  const { publicKey } = new Wallet(blockchain);
  res.json({ publicKey });
});

app.post('/transaction', (req, res) => {
  const { body: { recipient, amount } } = req;

  try {
    const tx = wallet.createTransaction(recipient, amount);
    p2pService.broadcast(MESSAGE.TX, tx);
    res.json(tx);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  })
});

app.listen(PORT, () => {
  console.log(`Service HTTP:${PORT} listening...`);
  p2pService.listen();
});
