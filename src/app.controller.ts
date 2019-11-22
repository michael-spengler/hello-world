import { Controller, Get, Res, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() response): string {
    // return response.sendfile('assets/hello-world.html');
    return response.redirect('https://dance-planner.de');
  }

  @Get('/sagHallo')
  sagHallo(@Res() response): string {
    return response.send('Hallo');
  }

  @Get('/sag/:wort')
  sagEinWort(@Param() params, @Res() response): string {
    return response.send(params.wort);
  }

}
