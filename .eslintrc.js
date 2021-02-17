// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    /* 'off'或者0  //关闭规则关闭
    'warn'或者1  //在打开的规则作为警告（不影响退出代码）
    'error'或者2  //把规则作为一个错误（退出代码触发时为1） */

    //检查分号
    //'semi': ["error", "always"],
    //不检查分号
    'semi': 0,
    'quotes': [0, 'single'], //引号类型 `` "" ''
    'space-before-function-paren': [0, 'never'] //函数定义时括号前面要不要有空格
  }
}
