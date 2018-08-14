# eslint-plugin-wordpress

A collection of custom ESLint rules that help enforce JavaScript coding standard in the WordPress project.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-wordpress`:

```
$ npm install eslint-plugin-wordpress --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-wordpress` globally.

## Usage

Add `wordpress` to the plugins section of your `.eslintrc.json` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "wordpress"
    ]
}
```

Or add `wordpress` to the plugins section of your `.eslintrc.js` configuration file. You can omit the `eslint-plugin-` prefix:

```js
{
    "plugins": [
        "wordpress"
    ]
}
```

Or add `wordpress` to the plugins section of your `.eslintrc.yaml`/`.eslintrc.yml` configuration file. You can omit the `eslint-plugin-` prefix:

```yaml
{
    "plugins": [
        "wordpress"
    ]
}
```
http://eslint.org/docs/user-guide/configuring.html#configuration-file-formats


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "wordpress/space-negation-operator": 2
    }
}
```

# Rules

- [space-negation-operator](docs/rules/space-negation-operator.md): Require space after `!` negation operators. See also https://github.com/eslint/eslint/issues/5060

# Ressources

- [WordPress JavaScript coding standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/javascript/)

# Code Sources, References

- ESLint https://github.com/eslint/eslint/blob/master/tests/lib/rules/space-unary-ops.js
- ESLint https://github.com/eslint/eslint/blob/master/lib/rules/space-unary-ops.js
