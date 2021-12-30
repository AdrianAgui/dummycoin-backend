import Block from "../block";

export default (blockchain) => {
  const [genesisBlock, ...blocks] = blockchain;

  if (JSON.stringify(genesisBlock) !== JSON.stringify(Block.genesis)) {
    throw Error("Invalid Genesis block.");
  }

  blocks.forEach((block, index) => {
    const { previousHash, timestamp, hash, data, nonce, difficulty } = block;
    const previousBlock = blockchain[index];

    if (previousHash !== previousBlock.hash) throw Error("Invalid previous hash");
    if (hash !== Block.hash(timestamp, previousHash, data, nonce, difficulty)) throw Error("Invalid hash");
  });

  return true;
};
