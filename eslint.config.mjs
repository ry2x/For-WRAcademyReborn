import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  eslintConfigPrettier,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  importPlugin.flatConfigs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        console: true,
        module: true,
        process: true,
        client: 'writable',
      },
    },
    ignores: ['node_modules/', 'dist/', 'build/', '.env', '.env.test'],
    plugins: {
      'unused-imports': unusedImports,
    },
    settings: {
      'import/resolver': {
        typescript: createTypeScriptImportResolver({
          project: './tsconfig.json',
        }),
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      'unused-imports/no-unused-imports': 'warn',
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
        },
      ],
    },
  },
);
