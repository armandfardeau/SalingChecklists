// Mock for @expo/vector-icons for testing
const React = require('react');

const MockIcon = (props) => {
  return React.createElement('MaterialIcons', props);
};

module.exports = {
  MaterialIcons: MockIcon,
};
