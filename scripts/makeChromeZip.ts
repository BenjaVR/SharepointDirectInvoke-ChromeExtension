import fs from "fs";
import path from "path";
import archiver from "archiver";

const zipPath = path.join(__dirname, "../dist/extension.zip");
const zipDirPath = path.dirname(zipPath);

if (!fs.existsSync(zipDirPath)) {
    fs.mkdirSync(zipDirPath);
}

if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
}

fs.closeSync(fs.openSync(zipPath, "w"));
const output = fs.createWriteStream(zipPath);

const archive = archiver("zip");

archive.on("warning", (error: archiver.ArchiverError) => {
    if (error.code === "ENOENT") {
        console.log(error);
    } else {
        throw error;
    }
});

archive.on("error", (error: archiver.ArchiverError) => {
    throw error;
});

console.log("Creating archive...");
archive.pipe(output);
archive.directory(path.join(__dirname, "../build"), false);
archive.finalize();
console.log(`Archiving is done! Zip file can be found on '${zipPath}'`);
