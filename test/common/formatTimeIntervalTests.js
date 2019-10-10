import assert from 'assert';
import formatTimeInterval from '~/common/formatTimeInterval';

describe('formatTimeInterval()', function() {
    it('should return 0 minutes when `seconds` equals 0', function() {
        const seconds = 0;

        const result = formatTimeInterval(seconds);

        assert.strictEqual(result, '0 мин');
    });

    it('should return 0 minutes when `seconds` less than 1 minute', function() {
        const seconds = 59;

        const result = formatTimeInterval(seconds);

        assert.strictEqual(result, '0 мин');
    });

    it('should return only minutes when `seconds` less than 1 hour', function() {
        const seconds = 42 * 60; // 42 m

        const result = formatTimeInterval(seconds);

        assert.strictEqual(result, '42 мин');
    });

    it('should return hours and minutes when `seconds` greater than 1 hour', function() {
        const seconds = 162 * 60; // 2 h 42 m

        const result = formatTimeInterval(seconds);

        assert.strictEqual(result, '2 ч 42 мин');
    });

    it('should return only hours when `seconds` is divisible by 1 hour without remainder', function() {
        const seconds = 2 * 60 * 60; // 2 h

        const result = formatTimeInterval(seconds);

        assert.strictEqual(result, '2 ч');
    });
});
