export default (issues) => {
    const map = new Map();
    issues.forEach(issue => 
        map.set(issue.id, { issue, isRoot: true, subtasks: [] })
    );

    map.forEach(container => {
        const { issue: { parentId } } = container;
        if (parentId && map.has(parentId)) {
            const parentContainer = map.get(parentId);
            parentContainer.subtasks.push(container);
            container.isRoot = false;
        }
    });

    let result = [];

    const append = (container, level) => {
        const { issue } = container;
        result.push({ issue, level });
        container.subtasks.forEach(subtask => append(subtask, level + 1));
    }

    map.forEach(container => {
        if (container.isRoot) {
            append(container, 0);
        }
    });

    return result;
};
