import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Expo from 'expo-server-sdk';

@Injectable()
export class ExpoService {
  public expo: Expo;

  constructor(private configService: ConfigService) {
    const EXPO_ACCESS_TOKEN =
      this.configService.get<string>('EXPO_ACCESS_TOKEN');
    this.expo = new Expo({
      accessToken: EXPO_ACCESS_TOKEN,
      useFcmV1: true,
    });
  }
}
