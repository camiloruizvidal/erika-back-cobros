import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { KafkaModule } from './infrastructure/messaging/kafka/kafka.module';
import { CuentasCobroService } from './application/services/cuentas-cobro.service';
import { CuentasCobroController } from './presentation/controllers/cuentas-cobro.controller';
import { ManejadorError } from './utils/manejador-error/manejador-error';
import { JwtTenantGuard } from './presentation/guards/jwt-tenant.guard';
import { Config } from './infrastructure/config/config';

@Module({
  imports: [
    DatabaseModule,
    KafkaModule,
    JwtModule.register({
      secret: Config.jwtKey,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AppController, CuentasCobroController],
  providers: [AppService, CuentasCobroService, ManejadorError, JwtTenantGuard],
})
export class AppModule {}
