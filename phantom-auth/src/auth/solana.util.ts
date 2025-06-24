import nacl from 'tweetnacl';
import bs58 from 'bs58';

export function verifySignature(
    message: Uint8Array,
    signature: number[],
    pubkeyBase58: string,
): boolean {
    const sigUint8 = Uint8Array.from(signature);
    const pubUint8 = bs58.decode(pubkeyBase58);
    return nacl.sign.detached.verify(message, sigUint8, pubUint8);
}
