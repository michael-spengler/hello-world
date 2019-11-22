import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public static configurationFile: any;

  public getHello(): string {
    return 'Hallo liebe Studenten!';
  }
}
