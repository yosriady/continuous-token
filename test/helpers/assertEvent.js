const _ = require('lodash');

module.exports = function assertEvent(result, index = 0, assertions, message) {
  const event = result.logs[index];
  assert(event, `No event at index ${index} is emitted!`);
  assert.equal(event.event, assertions.event, `Event name mismatch, found: ${event.event} instead of ${assertions.event}`);

  const eventArgs = Object.keys(event.args).reduce((previous, current) => {
    previous[current] =
      (event.args[current] && typeof event.args[current].toString === 'function')
        ? event.args[current].toString()
        : event.args[current];
    return previous;
  }, {});

  const assertionArgs = Object.keys(assertions.args).reduce((previous, current) => {
    previous[current] =
      (assertions.args[current] && typeof assertions.args[current].toString === 'function')
        ? assertions.args[current].toString()
        : assertions.args[current];
    return previous;
  }, {});

  const isSubset = _.isMatch(eventArgs, assertionArgs);
  assert(isSubset, `Args mismatch, found: ${JSON.stringify(eventArgs)}`);
  assert(true, message);
};
