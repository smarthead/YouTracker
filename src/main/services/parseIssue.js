export default (jsonIssue) => {
    const spentTimeField = jsonIssue.customFields.find(
        item => item.projectCustomField.field.name === 'Spent time'
    );
    
    let spentTime = null;
    if (spentTimeField && spentTimeField.value) {
        const { value: { minutes, presentation }} = spentTimeField;
        spentTime = { minutes, presentation };
    }

    const parentLink = jsonIssue.links.find(
        link => link.direction === 'INWARD' && link.linkType.name === 'Subtask'
    );
    
    let parentId = null;
    if (parentLink && parentLink.issues.length > 0) {
        parentId = parentLink.issues[0].id;
    }
    
    return {
        id: jsonIssue.id,
        idReadable: jsonIssue.idReadable,
        summary: jsonIssue.summary,
        project: {
            id: jsonIssue.project.shortName,
            name: jsonIssue.project.name
        },
        spentTime,
        parentId
    }
};
