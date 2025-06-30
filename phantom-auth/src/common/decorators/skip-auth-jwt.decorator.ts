import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_JWT_KEY = 'skipAuthJwt';

export const SkipAuthJwt = () => SetMetadata(SKIP_AUTH_JWT_KEY, true);
