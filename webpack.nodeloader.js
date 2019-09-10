module.exports = function(content) {    
    const url = 'build/keytar.node';

    this.emitFile('keytar.node', content);

    console.log('final path', url);


    return (
        "try { global.process.dlopen(module, '" +
        url +
        "'); } catch(e) {" +
        "throw new Error('Cannot open ' + '" +
        url +
        "' + ': ' + e);}"
    );
};

module.exports.raw = true;
