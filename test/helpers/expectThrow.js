module.exports = async function expectThrow(promise, message) {
  try {
    await promise;
  } catch (error) {
    // Message is an optional parameter here
    if (message) {
      assert(
        error.message.search(message) >= 0,
        `Expected ${message}, got ${error} instead`,
      );
      return;
    }

    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert') >= 0;
    assert(
      invalidOpcode || outOfGas || revert,
      `Expected throw, got ${error} instead`,
    );
    return;
  }
  assert.fail('Expected throw not received');
}
