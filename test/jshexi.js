'use strict'
/*
 * Copyright (c) 2017, Bubelich Mykola
 * https://www.bubelich.com
 *
 * (｡◕‿‿◕｡)
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var JSHexi = (function () {
  /** Base 16 Alphabet **/
  var _JENCB16 = '0123456789abcdef'
  var _JDECB16 = [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, 0, 1,
    2, 3, 4, 5, 6, 7, 8, 9, -1, -1, -1, -1,
    -1, -1, -1, 10, 11, 12, 13, 14, 15, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15
  ]

  /** Base 64 Alphabet **/
  var _JENCB64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var _JDECB64 = [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, 62, -1, 63, 52, 53, 54,
    55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34,
    35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
  ]

  return {
    /**
     * Decode input string in Base16 to array of byte.
     *
     * @param {String} data
     * @return {Uint8Array}
     */
    fromBase16: function (data) {
      this._checkLength(data.length, 2)

      var result = new Uint8Array(data.length >> 1)

      for (var i = 0; i < result.length; i++) {
        result[i] = _JDECB16[data.charCodeAt(2 * i)] << 4 | _JDECB16[data.charCodeAt(2 * i + 1)]
      }

      return result
    },

    /**
     * Decode input string in Base64 to array of byte.
     *
     * @param {String} data
     * @return {Uint8Array}
     */
    fromBase64: function (data) {
      var dlen = data.length
      var rlen = dlen * 3 / 4

      if (dlen % 2 === 0) {
        if (data[dlen - 1] === '=') {
          dlen--
          rlen--
        }

        if (data[dlen - 1] === '=') {
          dlen--
          rlen--
        }
      }

      var result = new Uint8Array(rlen)
      var dcounter = 0
      var rcounter = 0
      var buff = 0

      while (dlen >= 4) {
        buff = _JDECB64[data.charCodeAt(dcounter++)] << 18 |
          _JDECB64[data.charCodeAt(dcounter++)] << 12 |
          _JDECB64[data.charCodeAt(dcounter++)] << 6 |
          _JDECB64[data.charCodeAt(dcounter++)]

        result[rcounter++] = (buff >> 16) & 0xFF
        result[rcounter++] = (buff >> 8) & 0xFF
        result[rcounter++] = buff & 0xFF

        dlen -= 4
      }

      // Padding stage //
      switch (rlen - rcounter) {
        case 2: {
          buff = _JDECB64[data.charCodeAt(dcounter++)] << 18 |
            _JDECB64[data.charCodeAt(dcounter++)] << 12 |
            _JDECB64[data.charCodeAt(dcounter++)] << 6

          result[rcounter++] = (buff >> 16) & 0xFF
          result[rcounter++] = (buff >> 8) & 0xFF

          break
        }

        case 1 : {
          buff = _JDECB64[data.charCodeAt(dcounter++)] << 18 |
            _JDECB64[data.charCodeAt(dcounter++)] << 12

          result[rcounter++] = (buff >> 16) & 0xFF

          break
        }
      }

      return result
    },

    /**
     * Encode input byte array as Base64 string
     *
     * @param {Uint8Array} data
     * @return {String}
     */
    toBase64: function (data) {
      this._checkForUint8Array(data)

      var dlen = data.length
      var result = ''
      var buff
      var dcounter = 0

      while (dlen >= 3) {
        buff = data[dcounter++] << 16 | data[dcounter++] << 8 | data[dcounter++]

        result += _JENCB64[buff >> 18 & 0x3F]
        result += _JENCB64[buff >> 12 & 0x3F]
        result += _JENCB64[buff >> 6 & 0x3F]
        result += _JENCB64[buff & 0x3F]

        dlen -= 3
      }

      // Padding stage //
      switch (dlen) {
        case 2 : {
          buff = data[dcounter++] << 16 | data[dcounter++] << 8
          result += _JENCB64[buff >> 18 & 0x3F]
          result += _JENCB64[buff >> 12 & 0x3F]
          result += _JENCB64[buff >> 6 & 0x3F]
          result += '='

          break
        }

        case 1 : {
          buff = data[dcounter++] << 16
          result += _JENCB64[buff >> 18 & 0x3F]
          result += _JENCB64[buff >> 12 & 0x3F]
          result += '=='

          break
        }
      }

      return result
    },

    /**
     * Encode input byte array as Base16 string
     *
     * @param {Uint8Array} data
     * @return {String}
     */
    toBase16: function (data) {
      this._checkForUint8Array(data)

      var result = ''

      for (var i = 0; i < data.length; i++) {
        result = result.concat(_JENCB16[data[i] >>> 4], _JENCB16[data[i] & 0x0F])
      }

      return result
    },

    /**
     * Checks if unicode chars in data string
     *
     * @param {String} data
     * @return {boolean}
     */
    isUnicodeString: function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data.charCodeAt(i) > 0xFF) {
          return true
        }
      }

      return false
    },

    /**
     * Convert string data to bytes
     *
     * @throws {Error} when data contain unicode char, but unicode flag set to false
     * @param {String} data
     * @param {Boolean} unicode
     * @return {Uint8Array}
     */
    toBytes: function (data, unicode) {
      unicode = typeof unicode === 'undefined' ? true : unicode

      this._checkForUnicode(data, unicode)

      var buffer = new Uint8Array(unicode ? data.length << 1 : data.length)
      var i, code

      for (i = 0; i < data.length; i++) {
        code = data.charCodeAt(i)

        if (unicode) {
          buffer[i * 2] = (code >> 8) & 0xFF
          buffer[i * 2 + 1] = code & 0xFF
        } else {
          buffer[i] = code
        }
      }

      return buffer
    },

    /**
     * Convert bytes to string, can be unicode string
     *
     * @param {Uint8Array} data
     * @param {Boolean} unicode
     */
    fromBytes: function (data, unicode) {
      unicode = typeof unicode === 'undefined' ? true : unicode

      this._checkForUint8Array(data)

      var udata = (unicode) ? new Uint16Array(data.length / 2) : data

      if (unicode) {
        for (var i = 0; i < udata.length; i++) {
          udata[i] = ((data[2 * i] << 8) | (data[2 * i + 1])) & 0xFFFF
        }
      }

      return udata.reduce(function (carry, charCode) {
          return carry + String.fromCharCode(charCode)
        }, ''
      )
    },

    /**
     * Check input string for unicode char
     * If found unicode char, throw error
     *
     * @throws {Error}
     * @param {String} data
     * @param {Boolean} unicode
     * @private
     */
    _checkForUnicode: function (data, unicode) {
      if (!unicode && this.isUnicodeString(data)) {
        throw new Error('Unicode char in data!')
      }
    },

    /**
     * Check length by module
     *
     * @param length
     * @param mod
     * @private
     */
    _checkLength: function (length, mod) {
      if (length % mod !== 0) {
        throw new Error('Data string has wrong length!')
      }
    },

    /**
     * Check for input if this byte array.
     * If not, throws Error
     *
     * @throws {Error}
     * @param {*} data
     * @private
     */
    _checkForUint8Array: function (data) {
      if (!(data instanceof Uint8Array)) {
        throw new Error('Data not byte array!')
      }
    }
  }
})()

// Export //
module.exports = JSHexi
