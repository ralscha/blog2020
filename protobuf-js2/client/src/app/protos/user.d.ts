import * as $protobuf from "protobufjs";
import Long = require("long");

export interface IUserRequest {
  firstname?: (string | null);
  lastname?: (string | null);
  age?: (number | null);
  gender?: (UserRequest.Gender | null);
}

export class UserRequest implements IUserRequest {
  constructor(properties?: IUserRequest);

  public firstname: string;
  public lastname: string;
  public age: number;
  public gender: UserRequest.Gender;

  public static create(properties?: IUserRequest): UserRequest;

  public static encode(message: IUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

  public static encodeDelimited(message: IUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

  public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): UserRequest;

  public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): UserRequest;

  public static verify(message: { [k: string]: any }): (string | null);

  public static fromObject(object: { [k: string]: any }): UserRequest;

  public static toObject(message: UserRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

  public toJSON(): { [k: string]: any };

  public static getTypeUrl(typeUrlPrefix?: string): string;
}

export namespace UserRequest {

  enum Gender {
    MALE = 0,
    FEMALE = 1
  }
}

export interface IUserResponse {
  id?: (string | null);
  status?: (UserResponse.Status | null);
}

export class UserResponse implements IUserResponse {
  constructor(properties?: IUserResponse);

  public id: string;
  public status: UserResponse.Status;

  public static create(properties?: IUserResponse): UserResponse;

  public static encode(message: IUserResponse, writer?: $protobuf.Writer): $protobuf.Writer;

  public static encodeDelimited(message: IUserResponse, writer?: $protobuf.Writer): $protobuf.Writer;

  public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): UserResponse;

  public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): UserResponse;

  public static verify(message: { [k: string]: any }): (string | null);

  public static fromObject(object: { [k: string]: any }): UserResponse;

  public static toObject(message: UserResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

  public toJSON(): { [k: string]: any };

  public static getTypeUrl(typeUrlPrefix?: string): string;
}

export namespace UserResponse {

  enum Status {
    OK = 0,
    NOT_OK = 1
  }
}
