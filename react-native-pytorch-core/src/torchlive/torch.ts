/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// Allows tensor data with arbitrary dimensions
type Item = ItemArray;
interface ItemArray extends Array<Item | number> {}

/**
 * TypedArray type to allow index-based access to tensor data.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray}
 *
 * The type should preferrably be `ArrayBufferView`. However, that type includes
 * `DataView`, which itself is not indexable.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView}
 *
 * A valid TypeScript expression is as follows:
 *
 * ```
 * torch.rand([2, 3]).data[3];
 * ```
 */
type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

/**
 * IValue (Interpreter Value) is a tagged union over the types supported by the
 * TorchScript interpreter.
 *
 * {@link https://pytorch.org/cppdocs/api/structc10_1_1_i_value.html#struct-documentation}
 */
export interface IValue {
  /**
   * Returns a list of [[IValue]].
   *
   * @experimental This function is subject to change.
   */
  toList(): Array<IValue>;
  /**
   * Returns a [[Tensor]].
   *
   * @experimental This function is subject to change.
   */
  toTensor(): Tensor;
  /**
   * Returns a generic dict of key value pairs of strings as keys and
   * [[IValue]] as values.
   *
   * @experimental This function is subject to change.
   */
  toGenericDict(): {[key: string]: IValue};
  /**
   * Returns a tuple of [[IValue]].
   *
   * @experimental This function is subject to change.
   */
  toTuple(): Array<IValue>;
}

export interface Module {
  /**
   * Module forward function.
   *
   * @param input Module input.
   */
  forward(...input: Tensor[]): Promise<IValue>;
  /**
   * Synchronous module forward function.
   *
   * @param input Module input.
   */
  forwardSync(...input: Tensor[]): IValue;
}

interface JIT {
  /**
   * Loads a serialized mobile module.
   *
   * @param filePath Path to serialized mobile module.
   */
  _loadForMobile(filePath: string): Promise<Module>;
}

export type TensorOptions = {
  /**
   * The desired data type of a tensor.
   */
  dtype?:
    | 'double'
    | 'float'
    | 'float32'
    | 'float64'
    | 'int'
    | 'int16'
    | 'int32'
    // Hermes doesn't support BigInt yet (https://github.com/facebook/hermes/issues/510)
    // | 'int64'
    | 'int8'
    // Hermes doesn't support BigInt yet (https://github.com/facebook/hermes/issues/510)
    // | 'long'
    | 'short'
    | 'uint8';
};

// Adopt the notion of a Scalar
export type Scalar = number;

export interface Tensor {
  /**
   * Computes the absolute value of each element in input.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.abs.html}
   */
  abs(): Tensor;
  /**
   * Add a scalar or tensor to this tensor.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.add.html}
   *
   * @param other Scalar or tensor to be added to each element in this tensor.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  add(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;
  /**
   * Returns the indices of the maximum value of all elements in the input
   * tensor.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.argmax.html}
   *
   * @param options argmax Options as keywords argument in pytorch
   * @param options.dim The dimension to reduce. If `undefined`, the argmax of the flattened input is returned.
   * @param options.keepdim Whether the output tensor has `dim` retained or not. Ignored if `dim` is `undefined`.
   */
  argmax(options?: {dim?: number; keepdim?: boolean}): Tensor;
  /**
   * Returns the tensor data as [[TypedArray]] buffer.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray}
   *
   * A valid TypeScript expression is as follows:
   *
   * ```typescript
   * torch.rand([2, 3]).data[3];
   * ```
   *
   * :::note
   *
   * The function only exists in JavaScript.
   *
   * :::
   *
   * @experimental
   */
  data: TypedArray;
  /**
   * Divides each element of the input input by the corresponding element of
   * other.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.div.html}
   *
   * @param other Scalar or tensor that divides each element in this tensor.
   * @param options.rounding_mode Type of rounding applied to the result
   */
  div(
    other: Scalar | Tensor,
    options?: {rounding_mode?: 'trunc' | 'floor'},
  ): Tensor;
  /**
   * A dtype is an string that represents the data type of a torch.Tensor.
   *
   * {@link https://pytorch.org/docs/1.11/tensor_attributes.html}
   */
  dtype: string;
  /**
   * Returns the value of this tensor as a `number`. This only works for
   * tensors with one element.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.item.html}
   *
   */
  item(): number;
  /**
   * Multiplies input by other scalar or tensor.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.mul.html}
   *
   * @param other Scalar or tensor multiplied with each element in this tensor.
   */
  mul(other: Scalar | Tensor): Tensor;
  /**
   * Returns a view of the original tensor input with its dimensions permuted.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.permute.html}
   *
   * @param dims The desired ordering of dimensions.
   */
  permute(dims: number[]): Tensor;
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html}
   */
  shape: number[];
  /**
   * Returns the size of the tensor.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.size.html}
   */
  size(): number[];
  /**
   * Applies a softmax function. It is applied to all slices along dim, and
   * will re-scale them so that the elements lie in the range `[0, 1]` and sum
   * to `1`.
   *
   * {@link https://pytorch.org/docs/stable/generated/torch.nn.functional.softmax.html}
   *
   * @param dim A dimension along which softmax will be computed.
   */
  softmax(dim: number): Tensor;
  /**
   * Returns a tensor with all the dimensions of input of size 1 removed.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.squeeze.html}
   *
   * @param dim If given, the input will be squeezed only in this dimension.
   */
  squeeze(dim?: number): Tensor;
  /**
   * Subtracts other from input.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.sub.html}
   *
   * @param other The scalar or tensor to subtract from input.
   * @param options.alpha The multiplier for `other`. Default: `1`.
   */
  sub(other: Scalar | Tensor, options?: {alpha?: Number}): Tensor;
  /**
   * Returns the k largest elements of the given input tensor along a given
   * dimension.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.topk.html}
   *
   * @param k The k in "top-k"
   */
  topk(k: number): [Tensor, Tensor];
  /**
   * Returns a new tensor with a dimension of size one inserted at the
   * specified position.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.Tensor.unsqueeze.html}
   *
   * @param dim The index at which to insert the singleton dimension.
   */
  unsqueeze(dim: number): Tensor;
  /**
   * Access tensor with index.
   *
   * ```typescript
   * const tensor = torch.rand([2]);
   * console.log(tensor.data, tensor[0].data);
   * // [0.8339180946350098, 0.17733973264694214], [0.8339180946350098]
   * ```
   *
   * {@link https://pytorch.org/cppdocs/notes/tensor_indexing.html}
   */
  [index: number]: Tensor;
}

export interface Torch {
  /**
   * Returns a 1-D tensor of size `(end - 0) / 1` with values from the interval
   * `[0, end)` taken with common difference step beginning from start.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.arange.html}
   *
   * @param end The ending value for the set of points.
   * @param options
   */
  arange(end: number, options?: TensorOptions): Tensor;
  /**
   * Returns a 1-D tensor of size `(end - start) / 1` with values from the
   * interval `[start, end)` taken with common difference 1 beginning from
   * `start`.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.arange.html}
   *
   * @param start The starting value for the set of points.
   * @param end The ending value for the set of points.
   * @param options
   */
  arange(start: number, end: number, options?: TensorOptions): Tensor;
  /**
   * Returns a 1-D tensor of size `(end - start) / step` with values from the
   * interval `[start, end)` taken with common difference `step` beginning from
   * `start`.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.arange.html}
   *
   * @param start The starting value for the set of points.
   * @param end The ending value for the set of points.
   * @param step The gap between each pair of adjacent points.
   * @param options
   */
  arange(
    start: number,
    end: number,
    step: number,
    options?: TensorOptions,
  ): Tensor;
  /**
   * Returns a tensor filled with uninitialized data. The shape of the tensor
   * is defined by the variable argument size.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.empty.html}
   *
   * @param size A sequence of integers defining the shape of the output
   * tensor.
   */
  empty(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with ones on the diagonal, and zeroes elsewhere.
   * The shape of the tensor is defined by the arguments n and m.
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.eye.html}
   *
   * @param n An integer defining the number of rows in the result.
   * @param m An integer defining the number of columns in the result. Optional, defaults to n.
   */
  eye(n: number, m?: number, options?: TensorOptions): Tensor;
  /**
   * Exposes the given data as a Tensor without taking ownership of the
   * original data.
   *
   * :::note
   *
   * The function exists in JavaScript and C++ (torch::from_blob).
   *
   * :::
   *
   * @param blob The blob holding the data.
   * @param sizes Should specify the shape of the tensor, strides the stride
   * in each dimension.
   */
  fromBlob(blob: any, sizes?: number[]): Tensor;
  /**
   * Returns a tensor filled with random numbers from a uniform distribution on
   * the interval `[0, 1)`.
   *
   * @param size A sequence of integers defining the shape of the output tensor.
   * @param options Tensor options.
   */
  rand(size: number[], options?: TensorOptions): Tensor;
  /**
   * Returns a tensor filled with random integers generated uniformly between
   * `0` (inclusive) and `high` (exclusive).
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.randint.html}
   *
   * @param high One above the highest integer to be drawn from the distribution.
   * @param size A tuple defining the shape of the output tensor.
   */
  randint(high: number, size: number[]): Tensor;
  /**
   * Returns a tensor filled with random integers generated uniformly between
   * `low` (inclusive) and `high` (exclusive).
   *
   * {@link https://pytorch.org/docs/1.11/generated/torch.randint.html}
   *
   * @param low Lowest integer to be drawn from the distribution.
   * @param high One above the highest integer to be drawn from the distribution.
   * @param size A tuple defining the shape of the output tensor.
   */
  randint(low: number, high: number, size: number[]): Tensor;
  /**
   * Constructs a tensor with no autograd history.
   *
   * @param data Tensor data as multi-dimensional array.
   * @param options Tensor options.
   */
  tensor(data: Scalar | ItemArray, options?: TensorOptions): Tensor;

  /**
   * JIT module
   */
  jit: JIT;

  // Tensor Data Type
  double: 'double';
  float: 'float';
  float32: 'float32';
  float64: 'float64';
  int: 'int';
  int16: 'int16';
  int32: 'int32';
  int64: 'int64';
  int8: 'int8';
  long: 'long';
  short: 'short';
  uint8: 'uint8';
}

type Torchlive = {
  torch: Torch;
};

declare const __torchlive__: Torchlive;

export const torch: Torch = __torchlive__.torch;
