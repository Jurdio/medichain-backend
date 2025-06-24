import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NonceService } from './nonce.service';
import { verifySignature } from './solana.util';

@Injectable()
export class AuthService {
    constructor(
        private nonceSvc: NonceService,
        private jwt: JwtService,
    ) {}

    createNonce(pubkey: string) {
        const nonce = this.nonceSvc.generate(pubkey);
        const msg = `Login to example.com\nNonce: ${nonce}`;
        return { nonce, msgToSign: msg };
    }

    async verify(pubkey: string, signature: number[], nonce: string) {
        if (!this.nonceSvc.consume(pubkey, nonce)) {
            throw new UnauthorizedException('Invalid nonce');
        }
        const msg = new TextEncoder().encode(`Login to example.com\nNonce: ${nonce}`);
        const ok = verifySignature(msg, signature, pubkey);
        if (!ok) throw new UnauthorizedException('Bad signature');

        return this.jwt.sign({ sub: pubkey });
    }
}
