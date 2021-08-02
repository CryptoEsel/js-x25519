# js-x25519
Javascript implementation of Elliptic curve Diffie-Hellman key exchange over Curve25519

# Description
In cryptography, Curve25519 is an elliptic curve offering 128 bits of security and designed for use with the elliptic curve Diffie–Hellman (ECDH) key agreement scheme. It is one of the fastest ECC curves; it is not covered by any known patents, and it is less susceptible to weak random-number generators. The reference implementation is public domain software.

The original Curve25519 paper defined it as a Diffie–Hellman (DH) function. Daniel J. Bernstein has since proposed that the name Curve25519 be used for the underlying curve, and the name X25519 for the DH function.

# Example
```javascript
(function testPrivateKeyGeneration() {
  var random32BytesFromRNG = new Uint8Array([255, 139, 14, 184, 144, 114, 181, 250, 229, 233, 18, 170, 255, 131, 185, 77, 228, 76, 98, 49, 140, 224, 49, 235, 154, 213, 246, 41, 73, 175, 34, 255]);
  X25519.clamp(random32BytesUint8Array);
  var privateKey = random32BytesFromRNG;

  var privateKeyJson = JSON.stringify(Array.from(privateKey));
  if (privateKeyJson !== "[200,139,14,184,144,114,181,250,229,233,18,170,255,131,185,77,228,76,98,49,140,224,49,235,154,213,246,41,73,175,34,107]") {
    throw "private key gen failed";
  }
  console.log(privateKey);
})();

(function testKeyExchange() {
  var priv = new Uint8Array([26, 161, 171, 118, 89, 183, 243, 249, 81, 245, 99, 164, 82, 212, 226, 48, 108, 146, 232, 28, 156, 162, 123, 194, 143, 36, 52, 202, 241, 174, 175, 51]);
  var pub = new Uint8Array([114, 108, 198, 227, 40, 114, 101, 1, 21, 194, 180, 84, 84, 94, 133, 112, 252, 146, 181, 118, 21, 125, 217, 206, 51, 0, 226, 33, 64, 97, 235, 119]);
  var shared = X25519.getSharedKey(priv, pub);
  var sharedJsonS = JSON.stringify(Array.from(shared));
  if (sharedJsonS !== "[150,133,189,203,88,197,123,255,56,125,121,218,192,200,28,102,219,106,100,8,142,95,40,214,128,17,78,190,139,9,57,90]") {
    throw "bc getSharedKey";
  }
  console.log(shared);
})();

(function testGetPublic() {
  var priv = new Uint8Array([26, 161, 171, 118, 89, 183, 243, 249, 81, 245, 99, 164, 82, 212, 226, 48, 108, 146, 232, 28, 156, 162, 123, 194, 143, 36, 52, 202, 241, 174, 175, 51]);
  var pub = X25519.getPublic(priv);
  var pubJsonS = JSON.stringify(Array.from(pub));
  if (pubJsonS !== "[232,241,35,119,212,237,228,179,91,223,25,144,76,10,24,130,223,121,119,240,131,200,252,208,106,169,252,81,98,13,57,22]") {
    throw "bc getPublic";
  }
  console.log(pub);
})();
```


# Authors
* [Mykola Bubelich](https://bubelich.com) 

# Projects
* [CryptoEsel](https://cryptoesel.com) - Safe and secure file transfer

# Links
* http://tweetnacl.cr.yp.to/
* https://github.com/dchest/tweetnacl-js
* https://github.com/rev22/curve255js/
* http://www.flownet.com/ron/code/djbec.js
* https://cr.yp.to/ecdh.html
* https://gnunet.org/svn/gnunet-java/src/main/java/org/gnunet/util/crypto/Ed25519.java
* http://www.movable-type.co.uk/scripts/sha256.html
* http://samuelkerr.com/?p=431

