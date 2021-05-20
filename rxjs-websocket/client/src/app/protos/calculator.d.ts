/* eslint-disable @typescript-eslint/no-explicit-any */
import * as $protobuf from 'protobufjs';

export interface ICalculation {
  value1?: (number | null);
  value2?: (number | null);
  operation?: (Calculation.Operation | null);
}

export class Calculation implements ICalculation {
  public value1: number;
  public value2: number;
  public operation: Calculation.Operation;

  constructor(properties?: ICalculation);

  public static create(properties?: ICalculation): Calculation;

  public static encode(message: ICalculation, writer?: $protobuf.Writer): $protobuf.Writer;

  public static encodeDelimited(message: ICalculation, writer?: $protobuf.Writer): $protobuf.Writer;

  public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): Calculation;

  public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): Calculation;

  public static verify(message: { [k: string]: any }): (string | null);

  public static fromObject(object: { [k: string]: any }): Calculation;

  public static toObject(message: Calculation, options?: $protobuf.IConversionOptions): { [k: string]: any };

  public toJSON(): { [k: string]: any };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Calculation {

  enum Operation {
    Addition = 0,
    Subtraction = 1,
    Multiplication = 2,
    Division = 3
  }
}

export interface IResult {
  result?: (number | null);
}

export class Result implements IResult {
  public result: number;

  constructor(properties?: IResult);

  public static create(properties?: IResult): Result;

  public static encode(message: IResult, writer?: $protobuf.Writer): $protobuf.Writer;

  public static encodeDelimited(message: IResult, writer?: $protobuf.Writer): $protobuf.Writer;

  public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): Result;

  public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): Result;

  public static verify(message: { [k: string]: any }): (string | null);

  public static fromObject(object: { [k: string]: any }): Result;

  public static toObject(message: Result, options?: $protobuf.IConversionOptions): { [k: string]: any };

  public toJSON(): { [k: string]: any };
}
