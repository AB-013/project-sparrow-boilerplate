// build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
// ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
// docs: Documentation only changes
// feat: A new feature
// fix: A bug fix
// perf: A code change that improves performance
// refactor: A code change that neither fixes a bug nor adds a feature
// style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
// test: Adding missing tests or correcting existing tests

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'translation',
        'security',
        'changeset',
      ],
    ],
  },
};

/*
Here are some examples of commit messages that follow the conventions defined in the above configuration:

1. feat(login): add user authentication  
   This commit adds user authentication to the login functionality. It's a new feature (`feat`) with the scope `login`.

2. fix(api): resolve null pointer issue in data retrieval  
   This commit fixes a bug (`fix`) related to a null pointer issue in the API. The scope is `api`.

3. docs(readme): update installation instructions  
   This commit only updates documentation (`docs`) related to installation instructions. The scope is `readme`.

4. style(css): adjust indentation in styles  
   This commit is related to code style changes (`style`) in the CSS files. The scope is `css`.

5. chore(build): configure Webpack for production  
   This commit is a chore (`chore`) that involves configuring Webpack for production builds. The scope is `build`.

6. test(user-service): add unit tests for user service  
   This commit adds unit tests (`test`) for the user service. The scope is `user-service`.

7. perf(api): optimize database query for faster response  
   This commit includes a performance improvement (`perf`) in the API by optimizing a database query. The scope is `api`.

8. refactor(components): simplify component rendering logic  
   This commit is a code refactor (`refactor`) that simplifies the rendering logic of components. The scope is `components`.

9. ci: update CI configuration  
   This commit is related to changes in the CI/CD configuration (`ci`) for CI..

10. revert: revert previous commit  
    This commit is a special case where it reverts a previous commit (`revert`). It doesn't have a scope.

These examples demonstrate how you can structure commit messages to convey their purpose and scope, following the conventions specified in the configuration.
*/
