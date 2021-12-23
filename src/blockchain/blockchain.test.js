import Blockchain from "./blockchain";
import Block from "./block";

describe("Blockchain", () => {
  let blockchain;
  let blockchain2;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
  });

  it("every blockchain has a genesis block", () => {
    const [genesisBlock] = blockchain.blocks;

    expect(genesisBlock).toEqual(Block.genesis);
    expect(blockchain.blocks.length).toEqual(1);
  });

  it("use add block", () => {
    const data = "d4t4";
    blockchain.addBlock(data);
    const [, lastBlock] = blockchain.blocks;

    expect(lastBlock.data).toEqual(data);
    expect(blockchain.blocks.length).toEqual(2);
  });

  it("replaces the chain with a valid chain", () => {
    blockchain2.addBlock("bl4ck-1");
    blockchain.replace(blockchain2.blocks);

    expect(blockchain.blocks).toEqual(blockchain2.blocks);
  });

  it("does not replace the chain with one with less blocks", () => {
    blockchain.addBlock("block-1");

    expect(() => {
      blockchain.replace(blockchain2.blocks);
    }).toThrowError("Received chain is not longer than current chain.");
  });

  it("not replace the chain with one is not valid", () => {
    blockchain2.addBlock("block-1");
    blockchain2.blocks[1].data = "block-h4ck";

    expect(() => {
      blockchain.replace(blockchain2.blocks);
    }).toThrowError("Received chain is invalid");
  });
});
