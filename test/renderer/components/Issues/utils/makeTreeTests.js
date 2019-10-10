import assert from 'assert';
import makeTree from '~/renderer/components/Issues/utils/makeTree';

describe('makeTree()', function() {
    it('should return empty list when the input list is empty', function() {
        const input = [];

        const result = makeTree(input);

        assert.deepStrictEqual(result, []);
    });

    it('should make tree structure with levels', function() {
        const input = [
            { id: '1' },
            { id: '2' },
            { id: '3', parentId: '1' },
        ];

        const result = makeTree(input);

        assert.deepStrictEqual(result, [
            { level: 0, issue: { id: '1' } },
                // Visualize tree structure by indent
                { level: 1, issue: { id: '3', parentId: '1' } },
            { level: 0, issue: { id: '2' } }
        ]);
    });

    it('should return flat list when the input list is flat', function() {
        const input = [
            { id: '1' },
            { id: '2' }
        ];

        const result = makeTree(input);

        assert.deepStrictEqual(result, [
            { level: 0, issue: { id: '1' } },
            { level: 0, issue: { id: '2' } }
        ]);
    });

    it('should lift the parent up', function() {
        const input = [
            { id: '2', parentId: '1' },
            { id: '1' },
            { id: '3' }
        ];

        const result = makeTree(input);

        assert.deepStrictEqual(result, [
            { level: 0, issue: { id: '1' } },
                { level: 1, issue: { id: '2', parentId: '1' } },
            { level: 0, issue: { id: '3' } }
        ]);
    });

    it('should keep the order of children', function() {
        const input = [
            { id: '1' },
            { id: '3', parentId: '1' },
            { id: '2', parentId: '1' }
        ];

        const result = makeTree(input);

        assert.deepStrictEqual(result, [
            { level: 0, issue: { id: '1' } },
                { level: 1, issue: { id: '3', parentId: '1' } },
                { level: 1, issue: { id: '2', parentId: '1' } }
        ]);
    });

    it('should ignore parent id that is not in the list', function() {
        const input = [
            { id: '1' },
            { id: '2', parentId: '1' },
            { id: '3', parentId: '4' }
        ];

        const result = makeTree(input);

        assert.deepStrictEqual(result, [
            { level: 0, issue: { id: '1' } },
                { level: 1, issue: { id: '2', parentId: '1' } },
            { level: 0, issue: { id: '3', parentId: '4' } }
        ]);
    });

    it('should collect child items regardless of their position in the list', function() {
        const input = [
            { id: '1', parentId: '2' },
            { id: '2' },
            { id: '3', parentId: '2' }
        ];

        const result = makeTree(input);

        assert.deepStrictEqual(result, [
            { level: 0, issue: { id: '2' } },
                { level: 1, issue: { id: '1', parentId: '2' } },
                { level: 1, issue: { id: '3', parentId: '2' } }
        ]);
    });

    it('should make multi-level tree', function() {
        const input = [
            { id: '1', parentId: '2' },
            { id: '2', parentId: '3'},
            { id: '3', parentId: '4' },
            { id: '4', parentId: '5' },
            { id: '5', parentId: '6' },
            { id: '6' }
        ];

        const result = makeTree(input);

        assert.deepStrictEqual(result, [
            { level: 0, issue: { id: '6' } },
                { level: 1, issue: { id: '5', parentId: '6' } },
                    { level: 2, issue: { id: '4', parentId: '5' } },
                        { level: 3, issue: { id: '3', parentId: '4' } },
                            { level: 4, issue: { id: '2', parentId: '3' } },
                                { level: 5, issue: { id: '1', parentId: '2' } }
        ]);
    });

    it('should make complex tree structure', function() {
        const input = [
            { id: '1', parentId: '3' },
            { id: '2', parentId: '_' },
            { id: '3', parentId: '2' },
            { id: '4', parentId: '6' },
            { id: '5', parentId: '3' },
            { id: '6' },
            { id: '7', parentId: '3' }
        ];

        const result = makeTree(input);

        assert.deepStrictEqual(result, [
            { level: 0, issue: { id: '2', parentId: '_' } },
                { level: 1, issue: { id: '3', parentId: '2' } },
                    { level: 2, issue: { id: '1', parentId: '3' } },
                    { level: 2, issue: { id: '5', parentId: '3' } },
                    { level: 2, issue: { id: '7', parentId: '3' } },
            { level: 0, issue: { id: '6' } },
                { level: 1, issue: { id: '4', parentId: '6' } },
        ]);
    });
});
