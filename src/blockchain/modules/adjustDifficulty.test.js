import adjustDifficult from './adjustDifficulty';

describe("adjustDifficulty()", () => {
  let block;

  beforeEach(() => {
    block = { timestamp: Date.now(), difficulty: 1 };
  });

  it('lowers the difficulty for slowly mined blocks', () => {
    block = { timestamp: Date.now(), difficulty: 5 };
    expect(adjustDifficult(block)).toEqual(block.difficulty - 1);
  });

  it('lowers the difficulty for slowly mined blocks', () => {
    block = { timestamp: Date.now(), difficulty: 1 };
    expect(adjustDifficult(block)).toEqual(block.difficulty + 1);
  });
});
