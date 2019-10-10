import assert from 'assert';
import parseIssue from '~/main/services/parseIssue';

describe('parseIssue()', function() {
    it('should parse json issue correctly', function() {
        const jsonIssue = {
            project: {
                shortName: 'TP',
                name: 'Test Project'
            },
            links: [
                {
                    direction: 'INWARD',
                    linkType: {
                        name: 'Subtask'
                    },
                    issues: [
                        { id: 'parentId' }
                    ]
                }
            ],
            customFields: [
                {
                    projectCustomField: {
                        field: {
                            name: 'Spent time'
                        }
                    },
                    value: {
                        minutes: 100,
                        presentation: '1h 40m'
                    }
                }
            ],
            idReadable: 'IDR-1',
            summary: 'Summary',
            id: 'ID'
        };
        
        const result = parseIssue(jsonIssue);
        
        assert.deepStrictEqual(result, {
            id: 'ID',
            idReadable: 'IDR-1',
            summary: 'Summary',
            project: {
                id: 'TP',
                name: 'Test Project'
            },
            spentTime: {
                minutes: 100,
                presentation: '1h 40m'
            },
            parentId: 'parentId'
        });
    });
});
