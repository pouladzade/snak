var Project = require('./project');
var Mocha = require("mocha");

var project = new Project();

module.exports = class Test {

    constructor() {
        
    }

    testAll() {
        try{
            var mocha = new Mocha();
            project.listTestFiles()
            .then(function(files){
                for(var i=0; i< files.length; i++) {
                    // There's an idiosyncracy in Mocha where the same file can't be run twice
                    // unless we delete the `require` cache.
                    // https://github.com/mochajs/mocha/issues/995
                    delete require.cache[files[i]];
                    mocha.addFile(files[i]);
                }
                mocha.run(function(failures) {
                    process.exitCode = failures ? -1 : 0;

                });
            });
        }
        catch(ex) {
            console.log(ex);
        }
    }

}