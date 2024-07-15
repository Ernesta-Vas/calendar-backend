import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseCheckMiddleware implements NestMiddleware {
  constructor(private sequelize: Sequelize) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.sequelize.authenticate();
      console.log('Database connection is successful.');
      next();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      res.status(500).send('Failed to connect to the database.');
    }
  }
}
