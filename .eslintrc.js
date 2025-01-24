// module.exports = {
//   extends: ['next/core-web-vitals', 'next', 'prettier'],
//   parserOptions: {
//     ecmaVersion: 2021,
//     sourceType: 'module',
//   },
//   rules: {},
// };

module.exports = {
  root: true, // Указывает, что это корневой файл конфигурации ESLint
  env: {
    browser: true, // Доступ к объектам браузера (window, document)
    es2021: true, // Поддержка ES2021
    node: true, // Доступ к объекту Node.js (process, __dirname)
  },
  extends: [
    'eslint:recommended', // Базовые правила ESLint
    'plugin:@typescript-eslint/recommended', // Рекомендации для TypeScript
    'plugin:react/recommended', // Рекомендации для React
    'plugin:react-hooks/recommended', // Рекомендации для хуков React
    'next/core-web-vitals', // Рекомендации для Next.js
    'plugin:prettier/recommended', // Поддержка Prettier для форматирования
  ],
  parser: '@typescript-eslint/parser', // Анализатор для TypeScript
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Поддержка JSX
    },
    ecmaVersion: 2021, // Версия ECMAScript
    sourceType: 'module', // Модули ES
  },
  plugins: [
    '@typescript-eslint', // Плагин для TypeScript
    'react', // Плагин для React
    'react-hooks', // Плагин для хуков React
    'unused-imports', // Плагин для удаления неиспользуемых импортов
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Отключает требование явных типов в экспортируемых функциях

    // React
    'react/react-in-jsx-scope': 'off', // Не требует React в scope (Next.js это делает автоматически)
    'react/jsx-uses-react': 'off', // Отключение устаревшего правила
    'react/prop-types': 'off', // Отключение проверки типов через PropTypes (используем TypeScript)
    'react/no-unescaped-entities': 'warn', // Предупреждение для неэкранированных символов
    'react-hooks/rules-of-hooks': 'error', // Проверяет правильное использование хуков
    'react-hooks/exhaustive-deps': 'warn', // Предупреждение о зависимости в useEffect

    // Import
    'unused-imports/no-unused-imports': 'error', // Удаляет неиспользуемые импорты
    'no-unused-vars': 'off', // Отключение базового правила (заменяется TypeScript правилом)

    // Next.js
    '@next/next/no-img-element': 'warn', // Предупреждение для использования <img> вместо <Image>
    '@next/next/no-html-link-for-pages': 'warn', // Проверка ссылок на страницы через Link

    // Стиль
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
        tabWidth: 2,
        useTabs: false,
        endOfLine: 'auto',
        singleQuote: true,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect', // Автоматическое определение версии React
    },
  },
};
