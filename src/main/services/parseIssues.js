const parseIssues = (jsonIssues) => {
    return jsonIssues.map((issue) => {
        const spentTimeField = issue.customFields.find(
            item => item.projectCustomField.field.name === 'Spent time'
        );
        
        let spentTime = null;
        if (spentTimeField && spentTimeField.value) {
            const { value: { minutes, presentation }} = spentTimeField;
            spentTime = { minutes, presentation };
        }
        
        return {
            id: issue.id,
            idReadable: issue.idReadable,
            summary: issue.summary,
            project: { id: issue.project.shortName, name: issue.project.name },
            spentTime
        }
    });
};

export default parseIssues;
