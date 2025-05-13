import { ErrorHandler } from '@/utils/errors/errorHandler.js';
import { BaseError } from '@/utils/errors/errors.js';
import { describe, expect, test } from 'vitest';

describe('Error Handler Performance Tests', () => {
  test('Should handle large number of errors efficiently', async () => {
    const handler = ErrorHandler.getInstance();
    const startTime = process.hrtime();
    const errorCount = 1000;

    for (let i = 0; i < errorCount; i++) {
      const context = ErrorHandler.createContext({
        command: `test-${i}`,
        metadata: { iteration: i },
      });
      const error = new BaseError(`Test error ${i}`, context);
      await handler.handle(error);
    }

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const totalTime = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

    // エラー処理の平均時間が1ms以下であることを確認
    expect(totalTime / errorCount).toBeLessThan(1);
  });

  test('Should handle deeply nested errors', async () => {
    const handler = ErrorHandler.getInstance();
    const nestingDepth = 50;

    let currentError = null;
    for (let i = 0; i < nestingDepth; i++) {
      const context = ErrorHandler.createContext({
        command: `nested-${i}`,
        metadata: {
          depth: i,
          innerError: currentError,
        },
      });
      currentError = new BaseError(`Nested error ${i}`, context);
    }

    const startTime = process.hrtime();
    await handler.handle(currentError as BaseError);
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const totalTime = seconds * 1000 + nanoseconds / 1000000;

    // 深くネストされたエラーの処理が100ms以下で完了することを確認
    expect(totalTime).toBeLessThan(100);
  });

  test('Should handle errors with large metadata', async () => {
    const handler = ErrorHandler.getInstance();
    const largeMetadata = {
      details: 'A'.repeat(10000), // 10KBのテストデータ
      array: Array(1000).fill('test'),
      nested: {
        level1: {
          level2: {
            level3: {
              data: Array(100).fill('nested'),
            },
          },
        },
      },
    };

    const context = ErrorHandler.createContext({
      command: 'large-metadata',
      metadata: largeMetadata,
    });
    const error = new BaseError('Error with large metadata', context);

    const startTime = process.hrtime();
    await handler.handle(error);
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const totalTime = seconds * 1000 + nanoseconds / 1000000;

    // 大きなメタデータを持つエラーの処理が50ms以下で完了することを確認
    expect(totalTime).toBeLessThan(50);
  });
});
