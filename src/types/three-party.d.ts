declare module 'json-bigint' {
  /**
   * Converts a JavaScript Object Notation (JSON) string into an object.
   * Number would be a BigNumber when it is not a [SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
   * @param text A valid JSON string.
   * @param reviver A function that transforms the results. This function is called for each member of the object.
   * If a member contains nested objects, the nested objects are transformed before the parent object is.
   */
  function parse(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
  ): any;

  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * The output number value would be BigNumber
   * when it is not a [SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer A function that transforms the results.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  function stringify(
    value: any,
    replacer?: (
      this: any,
      key: string,
      value: any,
    ) => any | Array<number | string> | null,
    space?: string | number,
  ): string;
}
