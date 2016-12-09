const TinyTest = require('../grunt/tinyTest');
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
const config = pkg.gruntBuild;

module.exports = new TinyTest(function (test) {
  if (config.isProduction) {
  } else {
  }

  // // Postive test
  // test(
  //   // Name of the test
  // )
  //   .this(
  //     // value to test
  //   )
  //   .equal(
  //     // Result
  //   );
  //
  // // Negative test
  // test(
  //   // Name of the test
  // )
  //   .this(
  //     // value to test
  //   )
  //   .notEqual(
  //     // Result
  //   );
  //
  // // Failure / catch test
  // test(
  //   // Name of the test
  // )
  //   .this(
  //     // value to test
  //   )
  //   .fail(
  //     // Result
  //   );
  //
  // test.done();

});
