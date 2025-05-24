import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, PostsModule, CaslModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
