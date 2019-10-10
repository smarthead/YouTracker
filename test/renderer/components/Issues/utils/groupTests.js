import assert from 'assert';
import group from '~/renderer/components/Issues/utils/group';

const testGrouper = (issue) => ({
    id: issue.project.id,
    name: issue.project.name
});

describe('group()', function() {
    it('should return true when the search query is empty', function() {
        const issues = [];

        const result = group(issues, testGrouper);

        assert.deepStrictEqual(result, []);
    });

    it('should group the issues by project', function() {
        const issues = [
            { id: '1', project: { id: '1', name: 'A' } },
            { id: '2', project: { id: '2', name: 'B' } },
            { id: '3', project: { id: '1', name: 'A' } },
            { id: '4', project: { id: '2', name: 'B' } }
        ];

        const result = group(issues, testGrouper);

        assert.deepStrictEqual(result, [
            {
                id: '1',
                name: 'A',
                issues: [
                    { id: '1', project: { id: '1', name: 'A' } },
                    { id: '3', project: { id: '1', name: 'A' } }
                ]
            },
            {
                id: '2',
                name: 'B',
                issues: [
                    { id: '2', project: { id: '2', name: 'B' } },
                    { id: '4', project: { id: '2', name: 'B' } }
                ]
            }
        ]);
    });

    it('should keep the order of the issues', function() {
        const issues = [
            { id: '1', project: { id: '1', name: 'A' } },
            { id: '3', project: { id: '1', name: 'A' } },
            { id: '2', project: { id: '1', name: 'A' } }
        ];

        const result = group(issues, testGrouper);

        assert.deepStrictEqual(result, [
            {
                id: '1',
                name: 'A',
                issues: [
                    { id: '1', project: { id: '1', name: 'A' } },
                    { id: '3', project: { id: '1', name: 'A' } },
                    { id: '2', project: { id: '1', name: 'A' } }
                ]
            }
        ]);
    });

    it('should make the order of the groups based on the order of the issues', function() {
        const issues = [
            { id: '1', project: { id: '2', name: 'B' } },
            { id: '2', project: { id: '1', name: 'A' } },
            { id: '3', project: { id: '1', name: 'A' } },
            { id: '4', project: { id: '2', name: 'B' } }
        ];

        const result = group(issues, testGrouper);

        assert.deepStrictEqual(result, [
            {
                id: '2',
                name: 'B',
                issues: [
                    { id: '1', project: { id: '2', name: 'B' } },
                    { id: '4', project: { id: '2', name: 'B' } }
                ]
            },
            {
                id: '1',
                name: 'A',
                issues: [
                    { id: '2', project: { id: '1', name: 'A' } },
                    { id: '3', project: { id: '1', name: 'A' } }
                ]
            }
        ]);
    });
});
