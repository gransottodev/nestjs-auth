import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { packRules } from '@casl/ability/extra';
import { CaslAbilityService } from 'src/casl/casl-ability.service';

@Controller('auth')
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private abilityService: CaslAbilityService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = compareSync(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ability = this.abilityService.createForUser(user);

    const token = this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: packRules(ability.rules),
    });

    return { accessToken: token };
  }
}
