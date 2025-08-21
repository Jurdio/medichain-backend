import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrivyClient } from '@privy-io/server-auth';

type ChainType = 'solana' | 'ethereum' | string;

interface PrivyWalletInfo {
  address: string;
  chain_type?: ChainType;
}

interface PrivyUser {
  id: string;
  wallets?: PrivyWalletInfo[];
}

@Injectable()
export class PrivyService {
  private readonly logger = new Logger(PrivyService.name);
  private readonly client: PrivyClient | null = null;

  constructor(private readonly configService: ConfigService) {
    const appId = this.configService.get<string>('PRIVY_APP_ID');
    const appSecret = this.configService.get<string>('PRIVY_APP_SECRET');
    if (appId && appSecret) {
      this.client = new PrivyClient(appId, appSecret);
      this.logger.log('Privy client initialized');
    } else {
      this.logger.warn('Privy client NOT initialized: missing PRIVY_APP_ID/PRIVY_APP_SECRET');
    }
  }

  async getPrimaryWalletByEmail(email: string): Promise<string | null> {
    if (!this.client) return null;
    try {
      this.logger.log(`Privy lookup started for email=${email}`);
      const response: any = await (this.client as any).getUsers({ emails: [email] });
      this.logger.log(`Privy getUsers response shape: isArray=${Array.isArray(response)} hasUsersArray=${Array.isArray(response?.users)}`);
      const users: any[] = Array.isArray(response)
        ? response
        : Array.isArray(response?.users)
          ? response.users
          : [];
      this.logger.log(`Privy users count: ${users.length}`);
      if (users.length === 0) {
        this.logger.warn('Privy returned no users for the provided email');
        return null;
      }

      const user = users[0];
      this.logger.log(`Using user id=${user?.id ?? 'unknown'}`);
      // Fetch detailed user if available for richer wallet data
      let detailed: any = null;
      try {
        detailed = await (this.client as any).getUser?.(user.id);
        if (detailed) {
          const keys = Object.keys(detailed);
          this.logger.log(`Privy detailed user keys: ${JSON.stringify(keys)}`);
        }
      } catch (e) {
        this.logger.warn('Privy getUser(id) failed; continuing with basic user');
      }

      // Gather wallets from multiple shapes (snake_case and camelCase)
      const walletsFromWallets = Array.isArray((user as any).wallets) ? (user as any).wallets : [];
      const walletsFromLinkedSnake = Array.isArray((user as any).linked_accounts)
        ? (user as any).linked_accounts
        : [];
      const walletsFromLinkedCamel = Array.isArray((user as any).linkedAccounts)
        ? (user as any).linkedAccounts
        : [];
      const walletsFromLinked = [...walletsFromLinkedSnake, ...walletsFromLinkedCamel]
        .filter((a: any) => (a?.type === 'wallet' || a?.kind === 'wallet' || a?.provider === 'wallet' || a?.category === 'wallet') && (a?.address || a?.publicAddress || a?.public_address));
      const walletsFromEmbeddedSnake = Array.isArray((user as any).embedded_wallets) ? (user as any).embedded_wallets : [];
      const walletsFromEmbeddedCamel = Array.isArray((user as any).embeddedWallets) ? (user as any).embeddedWallets : [];
      const walletsFromEmbedded = [...walletsFromEmbeddedSnake, ...walletsFromEmbeddedCamel];
      const walletsFromAccounts = Array.isArray((user as any).accounts) ? (user as any).accounts : [];
      const walletsFromWalletSingletons = [
        (user as any).wallet,
        (user as any).smartWallet,
        (detailed as any)?.wallet,
        (detailed as any)?.smartWallet,
      ].filter(Boolean);

      const walletsFromDetailedWallets = Array.isArray(detailed?.wallets) ? detailed.wallets : [];
      const walletsFromDetailedLinkedSnake = Array.isArray(detailed?.linked_accounts) ? detailed.linked_accounts : [];
      const walletsFromDetailedLinkedCamel = Array.isArray(detailed?.linkedAccounts) ? detailed.linkedAccounts : [];
      const walletsFromDetailedLinked = [...walletsFromDetailedLinkedSnake, ...walletsFromDetailedLinkedCamel]
        .filter((a: any) => (a?.type === 'wallet' || a?.kind === 'wallet' || a?.provider === 'wallet' || a?.category === 'wallet') && (a?.address || a?.publicAddress || a?.public_address));
      const walletsFromDetailedEmbeddedSnake = Array.isArray(detailed?.embedded_wallets) ? detailed.embedded_wallets : [];
      const walletsFromDetailedEmbeddedCamel = Array.isArray(detailed?.embeddedWallets) ? detailed.embeddedWallets : [];
      const walletsFromDetailedEmbedded = [...walletsFromDetailedEmbeddedSnake, ...walletsFromDetailedEmbeddedCamel];
      const walletsFromDetailedAccounts = Array.isArray(detailed?.accounts) ? detailed.accounts : [];

      const walletsFromUser: any[] = [
        ...walletsFromWallets,
        ...walletsFromLinked,
        ...walletsFromEmbedded,
        ...walletsFromAccounts,
        ...walletsFromWalletSingletons,
        ...walletsFromDetailedWallets,
        ...walletsFromDetailedLinked,
        ...walletsFromDetailedEmbedded,
        ...walletsFromDetailedAccounts,
      ];
      this.logger.log(`Wallets raw: wallets=${walletsFromWallets.length}, linked=${walletsFromLinked.length}, embedded=${walletsFromEmbedded.length}, accounts=${walletsFromAccounts.length}, singletons=${walletsFromWalletSingletons.length}, d.wallets=${walletsFromDetailedWallets.length}, d.linked=${walletsFromDetailedLinked.length}, d.embedded=${walletsFromDetailedEmbedded.length}, d.accounts=${walletsFromDetailedAccounts.length}, total=${walletsFromUser.length}`);

      const normalizedWallets: PrivyWalletInfo[] = walletsFromUser
        .map((w: any) => {
          const candidate = typeof w === 'string' ? { address: w } : w;
          const address = candidate?.address ?? candidate?.publicAddress ?? candidate?.public_address ?? candidate?.walletAddress ?? candidate?.public_key;
          const chainRaw = candidate?.chain_type ?? candidate?.chainType ?? candidate?.chain ?? candidate?.blockchain ?? candidate?.network ?? candidate?.walletType;
          const chain_type = typeof chainRaw === 'string' ? chainRaw.toLowerCase() : (typeof chainRaw?.toString === 'function' ? chainRaw.toString().toLowerCase() : undefined);
          return { address, chain_type } as PrivyWalletInfo;
        })
        .filter((w: any) => typeof w.address === 'string' && w.address.length > 0);
      this.logger.log(`Normalized wallets: ${JSON.stringify(normalizedWallets)}`);

      if (normalizedWallets.length === 0) return null;

      const solWallet = normalizedWallets.find(w => (w.chain_type ?? '') === 'solana');
      const selected = solWallet?.address ?? null;
      if (selected) {
        this.logger.log(`Selected Solana wallet: ${selected}`);
      } else {
        this.logger.warn('No Solana wallet found among normalized wallets');
      }
      return selected;
    } catch (error) {
      this.logger.error('Privy lookup failed', error as any);
      return null;
    }
  }
}
