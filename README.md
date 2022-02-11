# Dummycoin Blockchain Network

Project based on blockchain technology which simulates the architecture of Bitcoin, it is a fully functional network with features such as mining blocks, creating transactions and generating wallets, it have an API that you can consume.

## Install

    npm install

## Run the app

    npm start

## Run the tests

    npm test

# REST API

The REST API to the Dummycoin backend is described below.

### Request

`GET /blocks/`              --> Return list of blocks of our blockchain  
`GET /transactions/`        --> Return list of transactions allocated in memory pool  
`GET /mine/transactions/`   --> Mine new block and set block data with all transactions in memory pool, returns list of blocks  
`GET /wallet/`              --> Return our public key from our own wallet  

`POST /wallet/`             --> Create a new wallet, retuns public key  
`POST /transaction/`        --> Create new transaction, request data: `body: { recipient, amount }`  

