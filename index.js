import PKG from './package.json';
import Block from './src/blockchain/block';

const { name, version } = PKG;
console.log(name, version);

const block = new Block(Date.now(), 'pr3vi0us_h4sh', 'h4sh', 'd4t4');
console.log(block.toString());
