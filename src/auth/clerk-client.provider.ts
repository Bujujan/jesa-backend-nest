import { createClerkClient } from '@clerk/backend';
import { Provider } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

export const CLERK_CLIENT = 'ClerkClient';

export const ClerkClientProvider: Provider = {
  provide: CLERK_CLIENT,
  useFactory: (configService: ConfigService) => {
    return createClerkClient({
      secretKey: configService.get<string>('CLERK_SECRET_KEY'),
    });
  },
  inject: [ConfigService],
};