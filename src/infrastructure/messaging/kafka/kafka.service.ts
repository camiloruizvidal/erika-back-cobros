import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, KafkaConfig } from 'kafkajs';
import { Config } from '../../config/config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
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
    try {
      await this.producer.connect();
      this.logger.log('Kafka producer conectado exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar Kafka producer:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.logger.log('Kafka producer desconectado');
    } catch (error) {
      this.logger.error('Error al desconectar Kafka producer:', error);
    }
  }

  async enviarMensaje(
    topic: string,
    mensaje: Record<string, unknown>,
  ): Promise<void> {
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
    return this.producer;
  }
}

