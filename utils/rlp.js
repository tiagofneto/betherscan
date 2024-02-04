// RLP logic ported from ethereumjs: https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/rlp
function rlp_encode(input) {
    let bytes = rlp_encode_bytes(input);
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '0x');

    function rlp_encode_bytes(input) {
      if (Array.isArray(input)) {
        const output = []
        let outputLength = 0
        for (let i = 0; i < input.length; i++) {
          const encoded = rlp_encode_bytes(input[i])
          output.push(encoded)
          outputLength += encoded.length
        }
        return concatBytes(encodeLength(outputLength, 192), ...output)
      }
      const inputBuf = toBytes(input)
      if (inputBuf.length === 1 && inputBuf[0] < 128) {
        return inputBuf
      }
      return concatBytes(encodeLength(inputBuf.length, 128), inputBuf)
    }

    function concatBytes(...arrays) {
      if (arrays.length === 1) return arrays[0]
      const length = arrays.reduce((a, arr) => a + arr.length, 0)
      const result = new Uint8Array(length)
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i]
        result.set(arr, pad)
        pad += arr.length
      }
      return result
    }

    function encodeLength(len, offset) {
      if (len < 56) {
        return Uint8Array.from([len + offset])
      }
      const hexLength = numberToHex(len)
      const lLength = hexLength.length / 2
      const firstByte = numberToHex(offset + 55 + lLength)
      return Uint8Array.from(hexToBytes(firstByte + hexLength))
    }

    function numberToHex(integer) {
      if (integer < 0) {
        throw new Error('Invalid integer as argument, must be unsigned!')
      }
      const hex = integer.toString(16)
      return hex.length % 2 ? `0${hex}` : hex
    }

    function hexToBytes(hex) {
      if (typeof hex !== 'string') {
        throw new TypeError('hexToBytes: expected string, got ' + typeof hex)
      }
      if (hex.length % 2) throw new Error('hexToBytes: received invalid unpadded hex')
      const array = new Uint8Array(hex.length / 2)
      for (let i = 0; i < array.length; i++) {
        const j = i * 2
        array[i] = parseHexByte(hex.slice(j, j + 2))
      }
      return array
    }

    function parseHexByte(hexByte) {
      const byte = Number.parseInt(hexByte, 16)
      if (Number.isNaN(byte)) throw new Error('Invalid byte sequence')
      return byte
    }

    function toBytes(v) {
      if (v instanceof Uint8Array) {
        return v
      }
      if (typeof v === 'string') {
        if (isHexPrefixed(v)) {
          return hexToBytes(padToEven(stripHexPrefix(v)))
        }
        return utf8ToBytes(v)
      }
      if (typeof v === 'number' || typeof v === 'bigint') {
        if (!v) {
          return Uint8Array.from([])
        }
        return hexToBytes(numberToHex(v))
      }
      if (v === null || v === undefined) {
        return Uint8Array.from([])
      }
      throw new Error('toBytes: received unsupported type ' + typeof v)
    }

    function utf8ToBytes(utf) {
      return new TextEncoder().encode(utf)
    }

    function isHexPrefixed(str) {
      return str.length >= 2 && str[0] === '0' && str[1] === 'x'
    }

    function padToEven(a) {
      return a.length % 2 ? `0${a}` : a
    }

    function stripHexPrefix(str) {
      if (typeof str !== 'string') {
        return str
      }
      return isHexPrefixed(str) ? str.slice(2) : str
    }
}

