import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as fc from 'fast-check';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Property-Based Test for JWT Guard Authentication Enforcement
 *
 * **Feature: project-structure, Property 3: JWT Guard Authentication Enforcement**
 * **Validates: Requirements 3.5**
 *
 * Property: For any HTTP request to a protected route without a valid JWT token,
 * the JWT_Guard SHALL return a 401 Unauthorized response.
 */
describe('JwtAuthGuard - Property-Based Tests', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  /**
   * Helper to create a mock ExecutionContext
   */
  const createMockContext = (isPublic: boolean): ExecutionContext => {
    const mockHandler = jest.fn();
    const mockClass = jest.fn();

    return {
      getHandler: () => mockHandler,
      getClass: () => mockClass,
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
        getResponse: () => ({}),
        getNext: () => jest.fn(),
      }),
      getType: () => 'http',
      getArgs: () => [],
      getArgByIndex: () => ({}),
      switchToRpc: () => ({}) as any,
      switchToWs: () => ({}) as any,
    } as ExecutionContext;
  };

  describe('Property 3: JWT Guard Authentication Enforcement', () => {
    /**
     * Property: For any protected route (non-public), when handleRequest is called
     * with no user and no error, it SHALL throw UnauthorizedException (401).
     * This simulates requests without valid JWT tokens.
     */
    it('should throw UnauthorizedException for any request without valid user on protected routes', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary info messages or null (info doesn't affect the outcome)
          fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
          (infoMsg) => {
            const error = null; // No authentication error from passport
            const info = infoMsg ? new Error(infoMsg) : null;
            const user = null; // No valid user - simulating missing/invalid token

            // When user is null (no valid token), handleRequest should throw UnauthorizedException
            expect(() => guard.handleRequest(error, user, info)).toThrow(
              UnauthorizedException,
            );
          },
        ),
        { numRuns: 100 },
      );
    });

    /**
     * Property: For any error passed to handleRequest, it SHALL throw that error
     * or UnauthorizedException if no user is present.
     */
    it('should throw the provided error when an error is passed to handleRequest', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), (errorMsg) => {
          const error = new Error(errorMsg);
          const user = { id: 'test' }; // Even with a user, error takes precedence
          const info = null;

          expect(() => guard.handleRequest(error, user, info)).toThrow(error);
        }),
        { numRuns: 100 },
      );
    });

    /**
     * Property: For any valid user object, handleRequest SHALL return that user.
     */
    it('should return the user for any valid user object without errors', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            email: fc.emailAddress(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          (user) => {
            const result = guard.handleRequest(null, user, null);
            expect(result).toEqual(user);
          },
        ),
        { numRuns: 100 },
      );
    });

    /**
     * Property: Public routes should always allow access regardless of authentication state.
     */
    it('should allow access to public routes for any request', () => {
      fc.assert(
        fc.property(
          fc.boolean(), // Whether request has auth header
          () => {
            const context = createMockContext(true);

            // Mock reflector to return true for public routes
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

            const result = guard.canActivate(context);
            expect(result).toBe(true);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
