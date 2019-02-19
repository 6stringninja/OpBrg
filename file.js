var fs = require('fs');

const path = __dirname + '\\src\\';

if (fs.existsSync(path)) {

    const deleteProc = !!process.argv.find(f => f === '--del');


    if (process.argv.length >= 3) {
        const newfilepath = process.argv[2];
        const dirs = newfilepath.split('\\').reverse();
        let file = dirs.shift().trim();
        const exts = file.split('.');

        let ext = (exts.length === 1 ? 'ts' : exts[1]);

        if (!ext.endsWith('.' + ext) && !file.endsWith('.' + ext)) {
            file = file + '.' + ext;
        }
        let suppliedExt = process.argv.find(f => f.startsWith('--ext='));
        if (suppliedExt && suppliedExt.length > 6) {
            ext = suppliedExt.split('=')[1];
        }
        if (!file.endsWith(ext)) {
            console.log('bad file ext ' + ext + ' only');
        } else {
            //  console.log(file);
            //   console.log(dirs);
            let pathtofile = path;
            dirs.reverse().forEach(f => {
                pathtofile = pathtofile + '\\' + f;
                const pathexists = fs.existsSync(pathtofile);
                //    console.log(pathtofile);
                //    console.log(pathexists);
                if (!pathexists) {
                    fs.mkdirSync(pathtofile);
                    console.log(`created dir: ${pathtofile}`);
                }
            });
            pathtofile = pathtofile + '\\' + file;
            if (!process.argv.find(f => f === '--nofile'))
                if (!fs.existsSync(pathtofile) && !deleteProc) {
                    fs.writeFileSync(pathtofile, '');
                    console.log(`created file: ${pathtofile}`);
                } else {
                    if (deleteProc && fs.existsSync(pathtofile)) {
                        fs.unlinkSync(pathtofile);
                        console.log(`deleted file: ${pathtofile}`);
                    } else console.warn(`file: ${file} already ${(deleteProc ? 'deleted' : 'exists')} `);
                }

            const pathToFileSpec = pathtofile.replace('.ts', '.spec.ts');
            if (!process.argv.find(f => f === '--nospec') && ext === 'ts')
                if (!fs.existsSync(pathToFileSpec) && !deleteProc) {
                    fs.writeFileSync(pathToFileSpec, '');
                    console.log(`created file: ${pathToFileSpec}`);
                } else {
                    if (deleteProc && fs.existsSync(pathToFileSpec)) {
                        fs.unlinkSync(pathToFileSpec);
                        console.log(`deleted file: ${pathToFileSpec}`);
                    } else console.warn(`file: ${file.replace('.ts', '.spec.ts')} already ${(deleteProc ? 'deleted' : 'exists')} `);
                }


        }
        //  const createpath = `${path}\\`
    }
}