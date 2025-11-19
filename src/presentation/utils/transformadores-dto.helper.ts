import * as moment from 'moment';

export class TransformadoresDto {
  public static transformarNumero(valor: any): number | undefined {
    if (valor === undefined || valor === null || valor === '') {
      return undefined;
    }

    const numero = typeof valor === 'number' ? valor : Number(valor);
    return Number.isNaN(numero) ? undefined : numero;
  }

  public static transformarFecha(valor: any): Date | undefined {
    if (valor === undefined || valor === null || valor === '') {
      return undefined;
    }

    const fecha = moment.utc(valor).startOf('day');
    if (!fecha.isValid()) {
      return undefined;
    }

    return fecha.toDate();
  }

  public static transformarTexto(valor: any): string | undefined {
    if (valor === undefined || valor === null) {
      return undefined;
    }

    const texto = String(valor).trim();
    return texto.length === 0 ? undefined : texto;
  }

  public static transformarBooleano(
    valor: string | number | boolean | null | undefined,
  ): boolean | undefined {
    if (valor === undefined || valor === null || valor === '') {
      return undefined;
    }

    if (typeof valor === 'boolean') {
      return valor;
    }

    if (typeof valor === 'number') {
      return valor === 1;
    }

    const texto = String(valor).toLowerCase();
    return texto === 'true' || texto === '1';
  }
}
