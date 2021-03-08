//secret.js

import CryptoJS from 'crypto-js'; //导入加密模块

const key = CryptoJS.enc.Utf8.parse('0123456789abcdef'); //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('abcdef0123456789'); //十六位十六进制数作为密钥偏移量

/**
 * 加密方法
 * @param {String} word 需要加密的字符
 * @returns {String} 加密后的字符
 */
export function encrypt(word) {
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

/**
 * 解密方法
 * @param {String} word 需要解密的字符
 * @returns {String} 解密后的字符
 */
export function decrypt(word) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

export default {
    encrypt,
    decrypt
};