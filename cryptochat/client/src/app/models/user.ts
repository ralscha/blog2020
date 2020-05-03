export interface User {
  username: string;
  publicKey: Uint8Array;
  sharedKey?: CryptoKey;
}
