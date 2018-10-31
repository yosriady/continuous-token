module.exports = function assertEvent(result, assertions, message) {
  const event = result.logs[0];
  assert(event, 'No events are emitted!');
  assert.equal(event.event, assertions.event, `Event name mismatch, found: ${event.event} instead of ${assertions.event}`);

  const eventArgs = Object.keys(event.args).reduce((previous, current) => {
    previous[current] =
      (event.args[current] && typeof event.args[current].toNumber === 'function')
        ? event.args[current].toNumber()
        : event.args[current];
    return previous;
  }, {});

  const isSubset = _.isMatch(eventArgs, assertions.args);
  assert(isSubset, `Args mismatch, found: ${JSON.stringify(eventArgs)}`);
  assert(true, message);
};
