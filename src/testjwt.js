const crypto = require('crypto');

// function hashPassword(password) {
//     const hashObject = crypto.createHash('sha512');
//     const hashedPw = hashObject
//         .update(password)
//         .digest('hex');
//     return hashedPw;
// }
// console.log(hashPassword('admin'));



// const crypto = require('crypto');
// const plainPw = 'admin';
// function hashPasswordWithSalt(password) {
//     const salt = crypto.randomBytes(128).toString('hex');
//     // console.log(salt);
//     const hashedPw = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
//     return hashedPw;
//     console.log( hashedPw);
// }
// console.log(hashPasswordWithSalt('admin'));
// const i =10;

//     hashPasswordWithSalt(plainPw);
//     hashPasswordWithSalt(plainPw);
// const secret = 'secret';
// function encrypt(input) {
//     //  const cipher = crypto.createCipher('aes-256-cbc', secret);
//     const input2 = input + secret;
//     const encrypted = reverse(input2);
   
//     console.log(encrypted);
//     return encrypted;
// }
// function reverse(str) {
//     return str.split("").reverse().join("");
// }

// console.log(encrypt('admin'));
// function decrypt(input) {
//     // const decipher = crypto.createDecipher('aes-256-cbc', secret);
//     const decrypted = reverse(input);
//     const decrypted2 = decrypted.substring(0, decrypted.length - secret.length);
//     console.log(decrypted2);
//     return decrypted2;
// }
// console.log({
//     decrypted: decrypt('terces456nimda')
// });
const {
    publicKey,
    privateKey,
} = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });

//Encrypt data with the private key...
function encrypt(data) {
    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        //We convert the data string to a buffer using `Buffer.from`
        Buffer.from(data)
    );

    //The encrypted data is in the form of bytes, so we print it in base64 format
    console.log("encrypted data: ", encryptedData.toString("base64"));
    return encryptedData.toString("base64");   
}   

function decrypt(data) {
    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, Buffer.from(data, "base64"));

        console.log("decrypted data: ", decryptedData.toString());
        return decryptedData.toString();
};
encrypt('admin');
decrypt(encrypt('admin'));