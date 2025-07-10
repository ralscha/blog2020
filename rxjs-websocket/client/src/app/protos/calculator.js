/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Calculation = $root.Calculation = (() => {

    /**
     * Properties of a Calculation.
     * @exports ICalculation
     * @interface ICalculation
     * @property {number|null} [value1] Calculation value1
     * @property {number|null} [value2] Calculation value2
     * @property {Calculation.Operation|null} [operation] Calculation operation
     */

    /**
     * Constructs a new Calculation.
     * @exports Calculation
     * @classdesc Represents a Calculation.
     * @implements ICalculation
     * @constructor
     * @param {ICalculation=} [properties] Properties to set
     */
    function Calculation(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Calculation value1.
     * @member {number} value1
     * @memberof Calculation
     * @instance
     */
    Calculation.prototype.value1 = 0;

    /**
     * Calculation value2.
     * @member {number} value2
     * @memberof Calculation
     * @instance
     */
    Calculation.prototype.value2 = 0;

    /**
     * Calculation operation.
     * @member {Calculation.Operation} operation
     * @memberof Calculation
     * @instance
     */
    Calculation.prototype.operation = 0;

    /**
     * Creates a new Calculation instance using the specified properties.
     * @function create
     * @memberof Calculation
     * @static
     * @param {ICalculation=} [properties] Properties to set
     * @returns {Calculation} Calculation instance
     */
    Calculation.create = function create(properties) {
        return new Calculation(properties);
    };

    /**
     * Encodes the specified Calculation message. Does not implicitly {@link Calculation.verify|verify} messages.
     * @function encode
     * @memberof Calculation
     * @static
     * @param {ICalculation} message Calculation message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Calculation.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.value1 != null && Object.hasOwnProperty.call(message, "value1"))
            writer.uint32(/* id 1, wireType 1 =*/9).double(message.value1);
        if (message.value2 != null && Object.hasOwnProperty.call(message, "value2"))
            writer.uint32(/* id 2, wireType 1 =*/17).double(message.value2);
        if (message.operation != null && Object.hasOwnProperty.call(message, "operation"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.operation);
        return writer;
    };

    /**
     * Encodes the specified Calculation message, length delimited. Does not implicitly {@link Calculation.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Calculation
     * @static
     * @param {ICalculation} message Calculation message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Calculation.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Calculation message from the specified reader or buffer.
     * @function decode
     * @memberof Calculation
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Calculation} Calculation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Calculation.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Calculation();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
                case 1: {
                    message.value1 = reader.double();
                    break;
                }
                case 2: {
                    message.value2 = reader.double();
                    break;
                }
                case 3: {
                    message.operation = reader.int32();
                    break;
                }
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    };

    /**
     * Decodes a Calculation message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Calculation
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Calculation} Calculation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Calculation.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Calculation message.
     * @function verify
     * @memberof Calculation
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Calculation.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.value1 != null && message.hasOwnProperty("value1"))
            if (typeof message.value1 !== "number")
                return "value1: number expected";
        if (message.value2 != null && message.hasOwnProperty("value2"))
            if (typeof message.value2 !== "number")
                return "value2: number expected";
        if (message.operation != null && message.hasOwnProperty("operation"))
            switch (message.operation) {
                default:
                    return "operation: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
            }
        return null;
    };

    /**
     * Creates a Calculation message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Calculation
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Calculation} Calculation
     */
    Calculation.fromObject = function fromObject(object) {
        if (object instanceof $root.Calculation)
            return object;
        let message = new $root.Calculation();
        if (object.value1 != null)
            message.value1 = Number(object.value1);
        if (object.value2 != null)
            message.value2 = Number(object.value2);
        switch (object.operation) {
            default:
                if (typeof object.operation === "number") {
                    message.operation = object.operation;
                    break;
                }
                break;
            case "Addition":
            case 0:
                message.operation = 0;
                break;
            case "Subtraction":
            case 1:
                message.operation = 1;
                break;
            case "Multiplication":
            case 2:
                message.operation = 2;
                break;
            case "Division":
            case 3:
                message.operation = 3;
                break;
        }
        return message;
    };

    /**
     * Creates a plain object from a Calculation message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Calculation
     * @static
     * @param {Calculation} message Calculation
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Calculation.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.value1 = 0;
            object.value2 = 0;
            object.operation = options.enums === String ? "Addition" : 0;
        }
        if (message.value1 != null && message.hasOwnProperty("value1"))
            object.value1 = options.json && !isFinite(message.value1) ? String(message.value1) : message.value1;
        if (message.value2 != null && message.hasOwnProperty("value2"))
            object.value2 = options.json && !isFinite(message.value2) ? String(message.value2) : message.value2;
        if (message.operation != null && message.hasOwnProperty("operation"))
            object.operation = options.enums === String ? $root.Calculation.Operation[message.operation] === undefined ? message.operation : $root.Calculation.Operation[message.operation] : message.operation;
        return object;
    };

    /**
     * Converts this Calculation to JSON.
     * @function toJSON
     * @memberof Calculation
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Calculation.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Calculation
     * @function getTypeUrl
     * @memberof Calculation
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Calculation.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Calculation";
    };

    /**
     * Operation enum.
     * @name Calculation.Operation
     * @enum {number}
     * @property {number} Addition=0 Addition value
     * @property {number} Subtraction=1 Subtraction value
     * @property {number} Multiplication=2 Multiplication value
     * @property {number} Division=3 Division value
     */
    Calculation.Operation = (function () {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "Addition"] = 0;
        values[valuesById[1] = "Subtraction"] = 1;
        values[valuesById[2] = "Multiplication"] = 2;
        values[valuesById[3] = "Division"] = 3;
        return values;
    })();

    return Calculation;
})();

export const Result = $root.Result = (() => {

    /**
     * Properties of a Result.
     * @exports IResult
     * @interface IResult
     * @property {number|null} [result] Result result
     */

    /**
     * Constructs a new Result.
     * @exports Result
     * @classdesc Represents a Result.
     * @implements IResult
     * @constructor
     * @param {IResult=} [properties] Properties to set
     */
    function Result(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Result result.
     * @member {number} result
     * @memberof Result
     * @instance
     */
    Result.prototype.result = 0;

    /**
     * Creates a new Result instance using the specified properties.
     * @function create
     * @memberof Result
     * @static
     * @param {IResult=} [properties] Properties to set
     * @returns {Result} Result instance
     */
    Result.create = function create(properties) {
        return new Result(properties);
    };

    /**
     * Encodes the specified Result message. Does not implicitly {@link Result.verify|verify} messages.
     * @function encode
     * @memberof Result
     * @static
     * @param {IResult} message Result message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Result.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.result != null && Object.hasOwnProperty.call(message, "result"))
            writer.uint32(/* id 1, wireType 1 =*/9).double(message.result);
        return writer;
    };

    /**
     * Encodes the specified Result message, length delimited. Does not implicitly {@link Result.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Result
     * @static
     * @param {IResult} message Result message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Result.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Result message from the specified reader or buffer.
     * @function decode
     * @memberof Result
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Result} Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Result.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Result();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
                case 1: {
                    message.result = reader.double();
                    break;
                }
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    };

    /**
     * Decodes a Result message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Result
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Result} Result
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Result.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Result message.
     * @function verify
     * @memberof Result
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Result.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.result != null && message.hasOwnProperty("result"))
            if (typeof message.result !== "number")
                return "result: number expected";
        return null;
    };

    /**
     * Creates a Result message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Result
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Result} Result
     */
    Result.fromObject = function fromObject(object) {
        if (object instanceof $root.Result)
            return object;
        let message = new $root.Result();
        if (object.result != null)
            message.result = Number(object.result);
        return message;
    };

    /**
     * Creates a plain object from a Result message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Result
     * @static
     * @param {Result} message Result
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Result.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.result = 0;
        if (message.result != null && message.hasOwnProperty("result"))
            object.result = options.json && !isFinite(message.result) ? String(message.result) : message.result;
        return object;
    };

    /**
     * Converts this Result to JSON.
     * @function toJSON
     * @memberof Result
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Result.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Result
     * @function getTypeUrl
     * @memberof Result
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Result.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Result";
    };

    return Result;
})();

export {$root as default};
