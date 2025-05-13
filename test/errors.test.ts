import { type ErrorRecoveryStrategy } from '@/types/error.js';
import { ErrorHandler } from '@/utils/errors/errorHandler.js';
import {
  APIError,
  BaseError,
  DatabaseError,
  DiscordError,
  ValidationError,
} from '@/utils/errors/errors.js';
import { describe, expect, test } from 'vitest';

describe('Error System Tests', () => {
  describe('Error Classes', () => {
    test('BaseError should maintain context', () => {
      const context = {
        timestamp: new Date(),
        severity: 'ERROR' as const,
        command: 'test',
        userId: '123',
      };

      const error = new BaseError('Test error', context);
      expect(error.context).toEqual(context);
      expect(error.name).toBe('BaseError');
    });

    test('ValidationError should handle validation errors', () => {
      const validationErrors = {
        field1: ['Required'],
        field2: ['Invalid format'],
      };

      const error = new ValidationError(
        'Validation failed',
        { timestamp: new Date() },
        validationErrors,
      );

      expect(error.context.severity).toBe('WARNING');
      expect(error.context.metadata).toHaveProperty(
        'validationErrors',
        validationErrors,
      );
    });

    test('APIError should handle status codes', () => {
      const error = new APIError(
        'API request failed',
        { timestamp: new Date() },
        404,
      );

      expect(error.context.severity).toBe('ERROR');
      expect(error.context.metadata).toHaveProperty('statusCode', 404);
    });
  });

  describe('ErrorHandler', () => {
    test('ErrorHandler should be singleton', () => {
      const handler1 = ErrorHandler.getInstance();
      const handler2 = ErrorHandler.getInstance();
      expect(handler1).toBe(handler2);
    });

    test('ErrorHandler should create context', () => {
      const context = ErrorHandler.createContext({
        command: 'test',
        userId: '123',
      });

      expect(context).toHaveProperty('timestamp');
      expect(context.severity).toBe('ERROR');
      expect(context.command).toBe('test');
      expect(context.userId).toBe('123');
    });

    test('ErrorHandler should handle recovery strategy', async () => {
      let recoveryAttempted = false;
      const context = ErrorHandler.createContext({
        command: 'test',
      });

      const recoveryStrategy: ErrorRecoveryStrategy = {
        shouldRetry: true,
        maxRetries: 1,
        backoffStrategy: 'fixed',
        fallbackAction: async () => {
          await Promise.resolve(); // Add async operation
          recoveryAttempted = true;
        },
      };

      const error = new DatabaseError(
        'Database connection failed',
        context,
        undefined, // causedBy parameter is optional
        recoveryStrategy, // Add recovery strategy
      );

      const handler = ErrorHandler.getInstance();
      await handler.handle(error);
      expect(recoveryAttempted).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    test('Error handling flow', async () => {
      const context = ErrorHandler.createContext({
        command: 'ping',
        userId: '123',
        metadata: {
          guildId: '456',
        },
      });

      const discordError = new DiscordError('Failed to send message', context);

      const handler = ErrorHandler.getInstance();
      await expect(handler.handle(discordError)).resolves.not.toThrow();
    });

    test('DiscordError should handle Discord-specific properties', () => {
      const context = ErrorHandler.createContext({
        command: 'slash',
        userId: '789',
        metadata: {
          guildId: '101',
        },
      });

      const error = new DiscordError('Invalid interaction', context);
      expect(error.context.metadata?.guildId).toBe('101');
      expect(error.context.severity).toBe('ERROR');
      expect(error.message).toBe('Invalid interaction');
    });

    test('Error properties should be properly set', () => {
      const context = ErrorHandler.createContext({
        command: 'test',
        metadata: { custom: 'value' },
      });

      const baseError = new BaseError('Custom error message', context);
      expect(baseError.message).toBe('Custom error message');
      expect(baseError.context.severity).toBe('ERROR');
      expect(baseError.name).toBe('BaseError');
    });

    test('ErrorHandler should handle nested errors', async () => {
      const innerContext = ErrorHandler.createContext({
        command: 'api',
        metadata: { statusCode: 500 },
      });

      const innerError = new APIError('Inner API error', innerContext, 500);

      const outerContext = ErrorHandler.createContext({
        command: 'wrapper',
        metadata: { innerError },
      });

      const outerError = new BaseError('Outer error', outerContext);

      const handler = ErrorHandler.getInstance();
      await expect(handler.handle(outerError)).resolves.not.toThrow();
      expect(outerError.context.metadata?.innerError).toBe(innerError);
    });
  });
});
