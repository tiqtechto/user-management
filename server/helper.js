const crypto = require('crypto');

function getImageTypeFromBase64(base64String) {
    const signature = base64String.substring(0, 16); // Consider the first 16 characters for the signature

    if (signature.includes('data:image/jpeg')) {
        return 'jpeg';
    } else if (signature.includes('data:image/png')) {
        return 'png';
    } else if (signature.includes('data:image/png')) {
        return 'GIF';
    } else if (signature.includes('data:image/webp')) {
        return 'webp';
    }
    
    else {
        return null;
    }
}

const cypherKey = "sdjfdofeiio@#$#$lkf";

function encrypt(text){
  var cipher = crypto.createCipher('aes256', cypherKey)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted; //94grt976c099df25794bf9ccb85bea72
}

function decrypt(text){
  var decipher = crypto.createDecipher('aes256',cypherKey)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec; //myPlainText
}

module.exports = {
    getImageTypeFromBase64,
    encrypt,
    decrypt
};
