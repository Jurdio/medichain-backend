import bs58 from 'bs58';
import * as nacl from 'tweetnacl';

export function verifySignature(
    message: Uint8Array,
    signature: number[],
    pubkeyBase58: string,
): boolean {
    const sig = Uint8Array.from(signature);
    const pk  = bs58.decode(pubkeyBase58);
    return nacl.sign.detached.verify(message, sig, pk);
}
