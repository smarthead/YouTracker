import assert from 'assert';
import satisfies from '~/renderer/components/Issues/utils/satisfies';

describe('satisfies()', function() {
    it('should return true when the search query is empty', function() {
        const issue = { idReadable: 'A-1', summary: 'Summary' };
        const search = '';

        const result = satisfies(issue, search);

        assert.strictEqual(result, true);
    });

    it('should search in summary', function() {
        const issue = { idReadable: 'A-1', summary: 'Summary' };
        const search = 'umma';

        const result = satisfies(issue, search);

        assert.strictEqual(result, true);
    });

    it('should search in id', function() {
        const issue = { idReadable: 'A-1', summary: 'Summary' };
        const search = '-1';

        const result = satisfies(issue, search);

        assert.strictEqual(result, true);
    });

    it('should return false when the search query does not match id and summary', function() {
        const issue = { idReadable: 'A-1', summary: 'Summary' };
        const search = 'abc';

        const result = satisfies(issue, search);

        assert.strictEqual(result, false);
    });

    it('should return false when the search query does not match empty id and summary', function() {
        const issue = { idReadable: '', summary: '' };
        const search = 'abc';

        const result = satisfies(issue, search);

        assert.strictEqual(result, false);
    });

    it('should be case insensitive when searching in summary', function() {
        const issue = { idReadable: 'A-1', summary: 'SumMary' };
        const search = 'summary';

        const result = satisfies(issue, search);

        assert.strictEqual(result, true);
    });

    it('should be case insensitive when searching in id', function() {
        const issue = { idReadable: 'A-1', summary: 'Summary' };
        const search = 'a-1';

        const result = satisfies(issue, search);

        assert.strictEqual(result, true);
    });
});
