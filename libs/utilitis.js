
/* this module will copy all the files of 
a directory to another directory*/

var copy = function(srcDir, dstDir) {
	let fs = require('fs');

	if (!fs.existsSync(dstDir))
		fs.mkdirSync(dstDir);	

    let results = [];
    let list = fs.readdirSync(srcDir);
	let src, dst;
    list.forEach(function(file) {
        src = srcDir + '/' + file;
		dst = dstDir + '/' + file;
		console.log(src);
        let stat = fs.statSync(src);
        if (stat && stat.isDirectory()) {
			try {
				console.log('creating dir: ' + dst);
				fs.mkdirSync(dst);
			} catch(e) {
				console.log('directory already exists: ' + dst);
			}
			results = results.concat(copy(src, dst));
		} else {
			try {
				console.log('copying file: ' + dst);
				fs.writeFileSync(dst, fs.readFileSync(src));
			} catch(e) {
				console.log('couldn\'t copy file: ' + dst);
			}
			results.push(src);
		}
    });
    return results;
}
module.exports = copy;