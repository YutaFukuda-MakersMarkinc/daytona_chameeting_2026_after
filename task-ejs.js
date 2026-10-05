import fs from "fs";
import path from "path";
import ejs from "ejs";
import glob from "glob";
import makeDir from "make-dir";

const srcDir = `${process.cwd()}/src/ejs`;
const distDir = `${process.cwd()}/dist`;
const jsonDataPath = `${process.cwd()}/src/ejs/page-data.json`;

const json = JSON.parse(fs.readFileSync(jsonDataPath, 'utf-8'));

glob(
    `**/*.ejs`,
    {
        cwd: srcDir,
        ignore: `**/_*.ejs`,
    },
    (er, files) => {
        for (let fileName of files) {
            convert(fileName, srcDir, distDir);
        }
    }
);

const convert = (fileName, srcDir, distDir) => {
    ejs.renderFile(path.resolve(srcDir, fileName), { pageData: json }, (err, str) => {
        if (err) {
            console.log(err);
            return;
        }

        const distPath = path.resolve(distDir, fileName);
        makeDir(path.dirname(distPath)).then(() => {
            const htmlPath = path.format({
                dir: path.dirname(distPath),
                name: path.basename(distPath, ".ejs"),
                ext: ".html",
            });
            fs.writeFile(htmlPath, str, () => {});
        });
    });
};