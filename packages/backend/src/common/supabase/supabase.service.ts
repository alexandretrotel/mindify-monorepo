import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { ExtractJwt } from 'passport-jwt';
import { Database } from '../types/supabase';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient<Database>;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {}

  getClient() {
    this.logger.log('getting supabase supabase...');
    if (this.clientInstance) {
      this.logger.log('supabase exists - returning for current Scope.REQUEST');
      return this.clientInstance;
    }

    this.logger.log('initialising new supabase supabase for new Scope.REQUEST');

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(this.request);

    this.clientInstance = createClient<Database>(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_ANON_KEY'),
      {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
        global: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      },
    );

    this.logger.log('auth has been set!');

    return this.clientInstance;
  }
}
