const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
  id: 4,
};

const token = jwt.sign(data, '123qwer');
console.log(token);
const decoded = jwt.verify(token, '123qwer')
console.log('decoded: ', decoded)

// const message = 'i am alina';

// const hash = SHA256(message).toString();

// console.log(`Message: ${message}. Hash: ${hash}`);

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+ 'somesecret').toString(),
// }
// token.data.id=5;
// token.hash=SHA256(JSON.stringify(token.data)).toString()

// const resultHash = SHA256(JSON.stringify(data)+'somesecret').toString();

// if(resultHash === token.hash) {
//   console.log('data was not changed')
// } else {
//   console.log('data was changed')
// }