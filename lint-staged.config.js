const path = require('path');

module.exports = {
  '{apps,libs,tools}/**/*.{ts,tsx}': files => {
    const relativeFiles = files.map(file => path.relative('.', file)).join(' ');
    return [
      `pnpm eslint --fix ${relativeFiles}`,
      `pnpm prettier --write ${relativeFiles}`
    ];
  },
  '{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}': files => {
    const relativeFiles = files.map(file => path.relative('.', file)).join(' ');
    return [
      `pnpm eslint --fix ${relativeFiles}`,
      `pnpm prettier --write ${relativeFiles}`
    ];
  },
};