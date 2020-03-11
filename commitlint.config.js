module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(:\w*:)(?:\((.*?)\))?\s((?:.*(?=\())|.*)(?:\(#(\d*)\))?/,
      headerCorrespondence: ['type', 'scope', 'subject', 'ticket'],
    },
  },
  rules: {
    'header-max-length': [2, 'always', 72],
    'header-min-length': [2, 'always', 5],

    'type-enum': [
      2,
      'always',
      [
        ':tada:',
        ':bug:',
        ':memo:',
        ':rocket:',
        ':twisted_rightwards_arrows',
        ':arrow_up_down:',
        ':rewind:',
        ':heavy_check_mark:',
        ':hammer:',
        ':fire:',
      ],
    ],
    'type-case': [2, 'always', 'lowerCase'],
    'type-empty': [2, 'never'],

    'subject-case': [2, 'always', ['sentence-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', ['.']],

    'scope-case': [2, 'always', 'lower-case'],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
