import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { KafkaModule } from './infrastructure/messaging/kafka/kafka.module';
import { CuentasCobroService } from './application/services/cuentas-cobro.service';
import { CuentasCobroController } from './presentation/controllers/cuentas-cobro.controller';
import { ManejadorError } from './utils/manejador-error/manejador-error';

@Module({
  imports: [DatabaseModule, KafkaModule],
  controllers: [AppController, CuentasCobroController],
  providers: [AppService, CuentasCobroService, ManejadorError],
})
export class AppModule {}
