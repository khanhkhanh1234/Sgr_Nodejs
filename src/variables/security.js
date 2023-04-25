const crypto = require('crypto');
const { hasSubscribers } = require('diagnostics_channel');
const plainPw = 'admin';
function hashPasswordWithSalt(password) {
    const salt = crypto.randomBytes(128).toString('hex');
    // console.log(salt);
    const hashedPw = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt,
        hashedPw
    }
}
function hashPasswordWithSaltFromDB(password, salt) {
    const hashedPw = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt,
        hashedPw
    }
}
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
module.exports = {
    hashPasswordWithSalt,
    hashPasswordWithSaltFromDB,
    encrypt,
    decrypt
}