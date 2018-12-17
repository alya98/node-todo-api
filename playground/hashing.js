const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = 'qwer1234!';

bcrypt.genSalt(10, (err,salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  })
});

const hashedPassword = '$2a$10$557x9c6M1szLCYLPTRrhLOXWoAz.y2NlJruYIHLQcShOV3DmNb52.';

bcrypt.compare('qwer1234', hashedPassword, (err, res) => console.log(res))
// const data = {
//   id: 4,
// };

// const token = jwt.sign(data, '123qwer');
// console.log(token);
// const decoded = jwt.verify(token, '123qwer')
// console.log('decoded: ', decoded)

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