import { normalizeRoute } from './routeUtils';

describe('normalizeRoute', () => {
    test('should return empty string if route is empty', () => {
        expect(normalizeRoute('')).toBe('');
    });

    test('should remove trailing slash', () => {
        expect(normalizeRoute('/test/')).toBe('/test');
    });

    test('should keep route as is if no trailing slash', () => {
        expect(normalizeRoute('/test')).toBe('/test');
    });

    test('should handle single slash', () => {
        expect(normalizeRoute('/')).toBe('/');
    });
});
