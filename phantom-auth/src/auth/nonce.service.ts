import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class NonceService {
    private store = new Map<string, { nonce: string; exp: number }>();
    private ttlMs = 5 * 60_000;

    generate(pubkey: string) {
        const nonce = randomBytes(24).toString('hex');
        this.store.set(pubkey, { nonce, exp: Date.now() + this.ttlMs });
        return nonce;
    }

    consume(pubkey: string, nonce: string) {
        const entry = this.store.get(pubkey);
        if (!entry) return false;
        if (entry.nonce !== nonce || entry.exp < Date.now()) return false;
        this.store.delete(pubkey);
        return true;
    }
}
