export default (issues, grouper) => {
    const groups = new Map();

    issues.forEach(issue => {
        const { id, name } = grouper(issue);
        const group = groups.has(id) ? groups.get(id) : { name, issues: [] };
        group.issues.push(issue);
        groups.set(id, group);
    });

    return [...groups.keys()].map(key => (
        { id: key, ...groups.get(key) }
    ));
};
