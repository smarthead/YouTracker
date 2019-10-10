export default (issue, search) => {
    const idReadable = issue.idReadable.toLowerCase();
    const summary = issue.summary.toLowerCase();
    return idReadable.includes(search) || summary.includes(search);
};
