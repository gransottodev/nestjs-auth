import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '@prisma/client';
import { Request } from 'express';
import { CaslAbilityService } from 'src/casl/casl-ability.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = this.jwtService.verify<{
        id: string;
        name: string;
        email: string;
        role: Roles;
        permissions: string[];
      }>(token, { algorithms: ['HS256'] });

      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;

      this.abilityService.createForUser(user);

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials', { cause: error });
    }
  }
}
