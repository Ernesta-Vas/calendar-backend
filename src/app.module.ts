import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { DatabaseCheckMiddleware } from './middleware/database-check.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DatabaseCheckMiddleware).forRoutes('*');
  }
}
