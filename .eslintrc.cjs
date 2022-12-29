/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: [
    "airbnb",
    "airbnb/hooks",
    "airbnb-typescript",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-props-no-spreading": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["vite.config.ts"],
      },
    ],
    "react/no-unknown-property": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-use-before-define": "off",
  },
};
