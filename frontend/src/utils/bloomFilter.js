/**
 * Enterprise Bloom Filter Implementation for Client-Side Credential Pre-Filtering
 * 
 * Algorithm:
 * - Bit array of size m bits (using Uint8Array).
 * - k independent hash functions derived from FNV-1a and Murmur3 bit-mixers.
 * - Optimal false positive probability formula: p ≈ (1 - e^(-kn/m))^k
 * - Space complexity: O(m) bits.
 * - Time complexity: O(k) = O(1) lookup and insertion.
 * 
 * Use cases:
 * 1. Rapid pre-check against 100,000+ leaked/pwned password signatures.
 * 2. Instant O(1) user verification before sending remote authentication requests.
 */

export class BloomFilter {
  /**
   * @param {number} size Number of bits (m) in the bitset (default: 16384 bits = 2KB)
   * @param {number} hashCount Number of hash functions (k) (default: 5)
   */
  constructor(size = 16384, hashCount = 5) {
    this.size = size;
    this.hashCount = hashCount;
    this.byteLength = Math.ceil(size / 8);
    this.bitArray = new Uint8Array(this.byteLength);
    this.itemCount = 0;
  }

  /**
   * Fast 32-bit FNV-1a Hash
   */
  _hashFNV(str, seed = 0) {
    let hash = 2166136261 ^ seed;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  /**
   * Fast Murmur-like Bit Mixer
   */
  _hashMixer(hash, seed = 0) {
    hash ^= seed;
    hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
    hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
    return (hash ^ (hash >>> 16)) >>> 0;
  }

  /**
   * Computes k hash values using double hashing
   */
  _getHashes(item) {
    const str = String(item).toLowerCase().trim();
    const h1 = this._hashFNV(str, 0x12345678);
    const h2 = this._hashMixer(h1, 0x9abcdef0);
    const indices = [];

    for (let i = 0; i < this.hashCount; i++) {
      // Double hashing: (h1 + i * h2) mod size
      const combined = (h1 + Math.imul(i, h2)) >>> 0;
      indices.push(combined % this.size);
    }
    return indices;
  }

  /**
   * Add an element into the Bloom filter
   */
  add(item) {
    if (!item) return;
    const indices = this._getHashes(item);
    for (const bitIndex of indices) {
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;
      this.bitArray[byteIndex] |= 1 << bitOffset;
    }
    this.itemCount++;
  }

  /**
   * Test membership in O(1) time
   * @returns {boolean} true if probably in set; false if definitely not in set
   */
  has(item) {
    if (!item) return false;
    const indices = this._getHashes(item);
    for (const bitIndex of indices) {
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;
      if ((this.bitArray[byteIndex] & (1 << bitOffset)) === 0) {
        return false; // Definitely not present
      }
    }
    return true; // Probably present
  }

  /**
   * Theoretical false positive rate
   */
  getFalsePositiveRate() {
    if (this.itemCount === 0) return 0;
    const exp = -1 * (this.hashCount * this.itemCount) / this.size;
    return Math.pow(1 - Math.exp(exp), this.hashCount);
  }

  /**
   * Total bits set to 1
   */
  getBitsSet() {
    let count = 0;
    for (let i = 0; i < this.byteLength; i++) {
      let b = this.bitArray[i];
      while (b > 0) {
        count += b & 1;
        b >>= 1;
      }
    }
    return count;
  }
}

// Pre-seeded Leaked/Breached Password Bloom Filter
// Used for sub-millisecond client-side zero-latency leaked credential warning
const COMMON_BREACHED_PASSWORDS = [
  'password', '123456', '12345678', '1234', 'qwerty', '12345', 'dragon', 'pussy',
  'baseball', 'football', 'letmein', 'master', 'monkey', 'shadow', 'sunshine',
  '1234567', 'admin', 'welcome', 'login', 'admin123', 'iloveyou', 'starwars',
  'superman', 'princess', 'solo', 'pass123', 'guest', 'hunter2', 'passcode'
];

export const breachedPasswordFilter = new BloomFilter(8192, 4);
COMMON_BREACHED_PASSWORDS.forEach((pw) => breachedPasswordFilter.add(pw));

// Verified Enterprise Domain & User Pre-Filter
export const enterpriseDomainFilter = new BloomFilter(4096, 3);
['pawpulse.in', 'pawcare.org', 'vetlife.health', 'petfirst.in', 'gmail.com', 'google.com'].forEach(
  (dom) => enterpriseDomainFilter.add(dom)
);
