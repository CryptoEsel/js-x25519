/**
 * Created by Mykola Bubelich
 * 2017-04-16
 */

import test from 'tape'
import X25519 from '../x25519'
import VECTORS from './vector'
import Hexi from './jshexi'

/**
 * General Test
 */
test("Class 'X25519' should exists", tape => {
  'use strict'

  const curve = new X25519(new Uint8Array(32))
  tape.assert(curve instanceof X25519)

  tape.end()
})

test("Should generate valid public key", tape => {
  for (let i = 0; i < VECTORS.length; i++) {
    const secret = Hexi.fromBase16(VECTORS.secrets[i]);
    const pub = Hexi.fromBase16(VECTORS.public[i]);

    tape.deepEqual(X25519.getPublic(secret), pub);
  }

  tape.end()
});

test("Should generate valid shared key", tape => {
  for (let i = 0; i < VECTORS.length; i++) {
    const secret = Hexi.fromBase16(VECTORS.secrets[i]);
    const pub = X25519.getPublic(secret);
    const shared = X25519.getSharedKey(secret, pub);

    tape.deepEqual(shared, Hexi.fromBase16(VECTORS.shared[i]));
  }

  tape.end()
});

/**
 * Errors
 */

test("Should throw error when secret key wrong size", tape => {
  const err = tape.throws(() => {

    X25519.getPublic(new Uint8Array(31));

  }, Error);

  tape.end();
});
test("Should throw error when secret or public key wrong size", tape => {
  const error = tape.throws(() => {
    X25519.getSharedKey(new Uint8Array(10), new Uint8Array(20));
  }, Error);

  tape.end()
});

/**
 * Benchmarks
 */

test("Benchmark for public key generation", tape => {
  const iters = 100;
  const secret = Hexi.fromBase16(VECTORS.secrets[0]);

  let result;
  const t1 = new Date().getTime();

  for (let i = 0; i < iters; i++) {
    result = X25519.getPublic(secret);
  }

  const t2 = new Date().getTime() - t1;

  // Generation check //
  tape.deepEqual(result, Hexi.fromBase16(VECTORS.public[0]));

  console.log(`Iteration: ${iters}, time: ${t2}, ${t2 / iters} ms to gen key`);

  tape.end()
});

test("Benchmark for shared generation", tape => {
  const iters = 100;

  const secret = Hexi.fromBase16(VECTORS.secrets[0]);
  const pub = Hexi.fromBase16(VECTORS.public[0]);

  let result;

  const t1 = new Date().getTime();

  for (let i = 0; i < iters; i++) {
    result = X25519.getSharedKey(secret, pub);
  }

  const t2 = new Date().getTime() - t1;

  // Generation check //
  tape.deepEqual(result, Hexi.fromBase16(VECTORS.shared[0]));

  console.log(`Iteration: ${iters}, time: ${t2}, ${t2 / iters} ms to gen key`);

  tape.end()
});
