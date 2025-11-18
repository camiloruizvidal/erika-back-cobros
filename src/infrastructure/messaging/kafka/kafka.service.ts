import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Kafka, Producer, KafkaConfig } from 'kafkajs';
import { Config } from '../../config/config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka | null = null;
  private producer: Producer | null = null;

  constructor() {
    if (!Config.kafkaBroker || !Config.kafkaClientId) {
      this.logger.warn(
        'Kafka no configurado. Las variables KAFKA_BROKER y KAFKA_CLIENT_ID son requeridas.',
      );
      return;
    }

    const kafkaConfig: KafkaConfig = {
      clientId: Config.kafkaClientId,
      brokers: [Config.kafkaBroker],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    };

    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer();
  }

  async onModuleInit(): Promise<void> {
    if (!this.producer) {
      this.logger.warn('Kafka producer no inicializado. Saltando conexión.');
      return;
    }
    try {
      await this.producer.connect();
      this.logger.log('Kafka producer conectado exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar Kafka producer:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.producer) {
      return;
    }
    try {
      await this.producer.disconnect();
      this.logger.log('Kafka producer desconectado');
    } catch (error) {
      this.logger.error('Error al desconectar Kafka producer:', error);
    }
  }

  async enviarMensaje(
    topic: string,
    mensaje: Record<string, unknown> | object,
  ): Promise<void> {
    if (!this.producer) {
      this.logger.warn(
        `Kafka no configurado. No se puede enviar mensaje al topic: ${topic}`,
      );
      return;
    }
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: `${topic}-${Date.now()}`,
            value: JSON.stringify(mensaje),
            timestamp: Date.now().toString(),
          },
        ],
      });
      this.logger.log(`Mensaje enviado al topic: ${topic}`);
    } catch (error) {
      this.logger.error(`Error al enviar mensaje al topic ${topic}:`, error);
      throw error;
    }
  }

  getProducer(): Producer {
    return this.producer!;
  }
}
