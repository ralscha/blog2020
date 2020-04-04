/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function (global, factory) { /* global define, require, module */

  /* AMD */
  if (typeof define === 'function' && define.amd)
    define(["protobufjs/minimal"], factory);

  /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
    module.exports = factory(require("protobufjs/minimal"));

})(this, function ($protobuf) {
  "use strict";

  // Common aliases
  var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

  // Exported root namespace
  var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

  $root.UserRequest = (function () {

    /**
     * Properties of a UserRequest.
     * @exports IUserRequest
     * @interface IUserRequest
     * @property {string|null} [firstname] UserRequest firstname
     * @property {string|null} [lastname] UserRequest lastname
     * @property {number|null} [age] UserRequest age
     * @property {UserRequest.Gender|null} [gender] UserRequest gender
     */

    /**
     * Constructs a new UserRequest.
     * @exports UserRequest
     * @classdesc Represents a UserRequest.
     * @implements IUserRequest
     * @constructor
     * @param {IUserRequest=} [properties] Properties to set
     */
    function UserRequest(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserRequest firstname.
     * @member {string} firstname
     * @memberof UserRequest
     * @instance
     */
    UserRequest.prototype.firstname = "";

    /**
     * UserRequest lastname.
     * @member {string} lastname
     * @memberof UserRequest
     * @instance
     */
    UserRequest.prototype.lastname = "";

    /**
     * UserRequest age.
     * @member {number} age
     * @memberof UserRequest
     * @instance
     */
    UserRequest.prototype.age = 0;

    /**
     * UserRequest gender.
     * @member {UserRequest.Gender} gender
     * @memberof UserRequest
     * @instance
     */
    UserRequest.prototype.gender = 0;

    /**
     * Creates a new UserRequest instance using the specified properties.
     * @function create
     * @memberof UserRequest
     * @static
     * @param {IUserRequest=} [properties] Properties to set
     * @returns {UserRequest} UserRequest instance
     */
    UserRequest.create = function create(properties) {
      return new UserRequest(properties);
    };

    /**
     * Encodes the specified UserRequest message. Does not implicitly {@link UserRequest.verify|verify} messages.
     * @function encode
     * @memberof UserRequest
     * @static
     * @param {IUserRequest} message UserRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserRequest.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.firstname != null && message.hasOwnProperty("firstname"))
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.firstname);
      if (message.lastname != null && message.hasOwnProperty("lastname"))
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.lastname);
      if (message.age != null && message.hasOwnProperty("age"))
        writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.age);
      if (message.gender != null && message.hasOwnProperty("gender"))
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.gender);
      return writer;
    };

    /**
     * Encodes the specified UserRequest message, length delimited. Does not implicitly {@link UserRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserRequest
     * @static
     * @param {IUserRequest} message UserRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserRequest.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserRequest message from the specified reader or buffer.
     * @function decode
     * @memberof UserRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserRequest} UserRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserRequest.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserRequest();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.firstname = reader.string();
            break;
          case 2:
            message.lastname = reader.string();
            break;
          case 3:
            message.age = reader.uint32();
            break;
          case 4:
            message.gender = reader.int32();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a UserRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserRequest} UserRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserRequest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserRequest message.
     * @function verify
     * @memberof UserRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserRequest.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.firstname != null && message.hasOwnProperty("firstname"))
        if (!$util.isString(message.firstname))
          return "firstname: string expected";
      if (message.lastname != null && message.hasOwnProperty("lastname"))
        if (!$util.isString(message.lastname))
          return "lastname: string expected";
      if (message.age != null && message.hasOwnProperty("age"))
        if (!$util.isInteger(message.age))
          return "age: integer expected";
      if (message.gender != null && message.hasOwnProperty("gender"))
        switch (message.gender) {
          default:
            return "gender: enum value expected";
          case 0:
          case 1:
            break;
        }
      return null;
    };

    /**
     * Creates a UserRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserRequest} UserRequest
     */
    UserRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.UserRequest)
        return object;
      var message = new $root.UserRequest();
      if (object.firstname != null)
        message.firstname = String(object.firstname);
      if (object.lastname != null)
        message.lastname = String(object.lastname);
      if (object.age != null)
        message.age = object.age >>> 0;
      switch (object.gender) {
        case "MALE":
        case 0:
          message.gender = 0;
          break;
        case "FEMALE":
        case 1:
          message.gender = 1;
          break;
      }
      return message;
    };

    /**
     * Creates a plain object from a UserRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserRequest
     * @static
     * @param {UserRequest} message UserRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserRequest.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.defaults) {
        object.firstname = "";
        object.lastname = "";
        object.age = 0;
        object.gender = options.enums === String ? "MALE" : 0;
      }
      if (message.firstname != null && message.hasOwnProperty("firstname"))
        object.firstname = message.firstname;
      if (message.lastname != null && message.hasOwnProperty("lastname"))
        object.lastname = message.lastname;
      if (message.age != null && message.hasOwnProperty("age"))
        object.age = message.age;
      if (message.gender != null && message.hasOwnProperty("gender"))
        object.gender = options.enums === String ? $root.UserRequest.Gender[message.gender] : message.gender;
      return object;
    };

    /**
     * Converts this UserRequest to JSON.
     * @function toJSON
     * @memberof UserRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gender enum.
     * @name UserRequest.Gender
     * @enum {string}
     * @property {number} MALE=0 MALE value
     * @property {number} FEMALE=1 FEMALE value
     */
    UserRequest.Gender = (function () {
      var valuesById = {}, values = Object.create(valuesById);
      values[valuesById[0] = "MALE"] = 0;
      values[valuesById[1] = "FEMALE"] = 1;
      return values;
    })();

    return UserRequest;
  })();

  $root.UserResponse = (function () {

    /**
     * Properties of a UserResponse.
     * @exports IUserResponse
     * @interface IUserResponse
     * @property {string|null} [id] UserResponse id
     * @property {UserResponse.Status|null} [status] UserResponse status
     */

    /**
     * Constructs a new UserResponse.
     * @exports UserResponse
     * @classdesc Represents a UserResponse.
     * @implements IUserResponse
     * @constructor
     * @param {IUserResponse=} [properties] Properties to set
     */
    function UserResponse(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserResponse id.
     * @member {string} id
     * @memberof UserResponse
     * @instance
     */
    UserResponse.prototype.id = "";

    /**
     * UserResponse status.
     * @member {UserResponse.Status} status
     * @memberof UserResponse
     * @instance
     */
    UserResponse.prototype.status = 0;

    /**
     * Creates a new UserResponse instance using the specified properties.
     * @function create
     * @memberof UserResponse
     * @static
     * @param {IUserResponse=} [properties] Properties to set
     * @returns {UserResponse} UserResponse instance
     */
    UserResponse.create = function create(properties) {
      return new UserResponse(properties);
    };

    /**
     * Encodes the specified UserResponse message. Does not implicitly {@link UserResponse.verify|verify} messages.
     * @function encode
     * @memberof UserResponse
     * @static
     * @param {IUserResponse} message UserResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserResponse.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.id != null && message.hasOwnProperty("id"))
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
      if (message.status != null && message.hasOwnProperty("status"))
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.status);
      return writer;
    };

    /**
     * Encodes the specified UserResponse message, length delimited. Does not implicitly {@link UserResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserResponse
     * @static
     * @param {IUserResponse} message UserResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserResponse.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserResponse message from the specified reader or buffer.
     * @function decode
     * @memberof UserResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserResponse} UserResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserResponse.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserResponse();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.id = reader.string();
            break;
          case 2:
            message.status = reader.int32();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a UserResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserResponse} UserResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserResponse.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserResponse message.
     * @function verify
     * @memberof UserResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserResponse.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.id != null && message.hasOwnProperty("id"))
        if (!$util.isString(message.id))
          return "id: string expected";
      if (message.status != null && message.hasOwnProperty("status"))
        switch (message.status) {
          default:
            return "status: enum value expected";
          case 0:
          case 1:
            break;
        }
      return null;
    };

    /**
     * Creates a UserResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserResponse} UserResponse
     */
    UserResponse.fromObject = function fromObject(object) {
      if (object instanceof $root.UserResponse)
        return object;
      var message = new $root.UserResponse();
      if (object.id != null)
        message.id = String(object.id);
      switch (object.status) {
        case "OK":
        case 0:
          message.status = 0;
          break;
        case "NOT_OK":
        case 1:
          message.status = 1;
          break;
      }
      return message;
    };

    /**
     * Creates a plain object from a UserResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserResponse
     * @static
     * @param {UserResponse} message UserResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserResponse.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.defaults) {
        object.id = "";
        object.status = options.enums === String ? "OK" : 0;
      }
      if (message.id != null && message.hasOwnProperty("id"))
        object.id = message.id;
      if (message.status != null && message.hasOwnProperty("status"))
        object.status = options.enums === String ? $root.UserResponse.Status[message.status] : message.status;
      return object;
    };

    /**
     * Converts this UserResponse to JSON.
     * @function toJSON
     * @memberof UserResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserResponse.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Status enum.
     * @name UserResponse.Status
     * @enum {string}
     * @property {number} OK=0 OK value
     * @property {number} NOT_OK=1 NOT_OK value
     */
    UserResponse.Status = (function () {
      var valuesById = {}, values = Object.create(valuesById);
      values[valuesById[0] = "OK"] = 0;
      values[valuesById[1] = "NOT_OK"] = 1;
      return values;
    })();

    return UserResponse;
  })();

  return $root;
});
