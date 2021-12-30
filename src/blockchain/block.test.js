import Block from "./block";

describe("Block", () => {
  let timestamp;
  let previousBlock;
  let data;
  let hash;
  let nonce;

  beforeEach(() => {
    timestamp = new Date(2010, 0, 1);
    previousBlock = Block.genesis;
    data = "t3St-d4t4";
    hash = "h4S4";
    nonce = 128;
  });

  it("create an instance with parameters", () => {
    const block = new Block(timestamp, previousBlock.hash, hash, data, nonce);

    expect(block.timestamp).toEqual(timestamp);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.data).toEqual(data);
    expect(block.hash).toEqual(hash);
    expect(block.nonce).toEqual(nonce);
  });

  it("use static mine()", () => {
    const block = Block.mine(previousBlock, data);
    const { difficulty } = block;

    expect(block.hash.length).toEqual(64);
    expect(block.hash.substring(0, difficulty)).toEqual('0'.repeat(difficulty));
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.nonce).not.toEqual(0);
    expect(data).toEqual(data);
  });

  it("use static hash()", () => {
    hash = Block.hash(timestamp, previousBlock.hash, data, nonce);
    const hasOutput = "16e9e12cf0c2fbb6c28861c1ce346f33aa3dc0b3e4f63aea317f8e4184ae58b7";

    expect(hash).toEqual(hasOutput);
  });

  it("use toString()", () => {
    const block = Block.mine(previousBlock, data);

    console.log(block.toString());

    expect(typeof block.toString()).toEqual("string");
  });
});
