'use strict';

const plugin = ({term, display, actions}) => {
  // It is your main plugin function
  // do something and call display() with your results
  display({
    title: 'It works',
    subtitle: `You entered ${term}`
  });
};

module.exports = {
  fn: plugin
}
