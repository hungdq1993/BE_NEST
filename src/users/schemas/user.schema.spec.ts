import * as fc from 'fast-check';
import { UserSchema } from './user.schema';

/**
 * Kiểm thử Property-Based cho User Schema Timestamps
 *
 * **Feature: project-structure, Property 2: Schema Timestamps Consistency**
 * **Validates: Requirements 4.6**
 *
 * Thuộc tính: Với bất kỳ schema MongoDB nào trong backend, schema đó PHẢI bao gồm
 * cấu hình timestamps (createdAt, updatedAt) được Mongoose tự động quản lý.
 */
describe('User Schema - Kiểm thử Property-Based', () => {
  describe('Property 2: Tính nhất quán của Timestamps trong Schema', () => {
    /**
     * Thuộc tính: User schema PHẢI có option timestamps được bật.
     * Điều này đảm bảo createdAt và updatedAt được tự động quản lý.
     */
    it('schema phải có option timestamps được bật', () => {
      fc.assert(
        fc.property(fc.constant(UserSchema), (schema) => {
          const options = schema.options;
          expect(options.timestamps).toBe(true);
        }),
        { numRuns: 100 },
      );
    });

    /**
     * Thuộc tính: Với bất kỳ document nào tạo từ User schema,
     * cấu hình schema PHẢI hỗ trợ các trường timestamp tự động.
     */
    it('schema phải hỗ trợ các trường timestamp tự động', () => {
      fc.assert(
        fc.property(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 100 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          () => {
            const schemaOptions = UserSchema.options;

            // timestamps: true nghĩa là Mongoose sẽ tự động thêm createdAt và updatedAt
            expect(schemaOptions.timestamps).toBe(true);

            // Xác minh schema được cấu hình đúng
            expect(UserSchema).toBeDefined();
            expect(typeof UserSchema.obj).toBe('object');
          },
        ),
        { numRuns: 100 },
      );
    });

    /**
     * Thuộc tính: Cấu hình timestamp của schema PHẢI nhất quán
     * bất kể truy cập bao nhiêu lần.
     */
    it('cấu hình timestamps phải nhất quán qua nhiều lần truy cập', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 10 }), (soLanTruyCap) => {
          const ketQua: boolean[] = [];
          for (let i = 0; i < soLanTruyCap; i++) {
            ketQua.push(UserSchema.options.timestamps === true);
          }

          // Tất cả các lần truy cập phải trả về cùng giá trị (true)
          expect(ketQua.every((r) => r === true)).toBe(true);
        }),
        { numRuns: 100 },
      );
    });
  });
});
