import { Body, Controller, Post } from '@nestjs/common';
import { CmsService } from './cms.service';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Controller('cms')
export class CmsController {
    constructor(
        private readonly cmsService: CmsService,
    ) {}

    @Post('/signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.cmsService.signup(signupDto);
    }
}
