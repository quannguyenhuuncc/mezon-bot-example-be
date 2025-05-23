import { getOptionalFields, getRandomColor, random, showIf, capitalizeFirstLetter } from './helper';

describe('Helper Functions', () => {
    describe('getOptionalFields', () => {
        it('should return object with only optional fields that exist in input', () => {
            const input = { lk: 'value1', other: 'value2', mk: 'value3' };
            const result = getOptionalFields(input);

            expect(result).toEqual({ lk: 'value1', mk: 'value3' });
            expect(result).not.toHaveProperty('other');
        });
    });

    describe('getRandomColor', () => {
        it('should return a color from the predefined list', () => {
            const result = getRandomColor();

            // Kiểm tra xem kết quả có phải là một chuỗi hex color hợp lệ
            expect(result).toMatch(/^#[0-9A-F]{6}$/i);
        });
    });

    describe('random', () => {
        it('should return an item from the array', () => {
            const array = [1, 2, 3, 4, 5];
            const result = random(array);

            expect(array).toContain(result);
        });

        it('should return undefined for empty array', () => {
            const array: number[] = [];
            const result = random(array);

            expect(result).toBeUndefined();
        });
    });

    describe('showIf', () => {
        it('should return value when condition is true', () => {
            expect(showIf(true, 'test')).toBe('test');
            expect(showIf(true, 123)).toBe(123);
            expect(showIf(true, { key: 'value' })).toEqual({ key: 'value' });
        });

        it('should return empty string when condition is false and value is string', () => {
            expect(showIf(false, 'test')).toBe('');
        });

        it('should return undefined when condition is false and value is not string', () => {
            expect(showIf(false, 123)).toBeUndefined();
            expect(showIf(false, { key: 'value' })).toBeUndefined();
        });
    });

    describe('capitalizeFirstLetter', () => {
        it('should capitalize first letter of a string', () => {
            expect(capitalizeFirstLetter('hello')).toBe('Hello');
            expect(capitalizeFirstLetter('world')).toBe('World');
        });

        it('should return same string if first letter is already capitalized', () => {
            expect(capitalizeFirstLetter('Hello')).toBe('Hello');
        });

        it('should handle empty string', () => {
            expect(capitalizeFirstLetter('')).toBe('');
        });
    });
});