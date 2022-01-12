const MIN_RATE = 1;
const MAX_RATE = 3;

export default (previousBlock) => {
  const { difficulty } = previousBlock;

  return difficulty >= MIN_RATE && difficulty <= MAX_RATE
    ? difficulty + 1
    : difficulty - 1;
};
