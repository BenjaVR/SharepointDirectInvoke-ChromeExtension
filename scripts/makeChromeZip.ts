import fs from "fs";
import path from "path";
import archiver from "archiver";

const extensionManifestPath = path.join(__dirname, "../build/manifest.json");
if (!fs.existsSync(extensionManifestPath)) {
    throw "No manifest.json found in the build directory.";
}
let extensionVersion: string;
try {
    extensionVersion = JSON.parse(fs.readFileSync(extensionManifestPath, { encoding: "utf-8" })).version;
} catch {
    throw "Could not get the version from the manifest.json in the build directory.";
}
if (extensionVersion === undefined || extensionVersion === null || extensionVersion === "") {
    throw "Version from the manifest.json in the build directory should not be empty.";
}

const zipPath = path.join(__dirname, `../dist/SharepointDirectInvoke_v${extensionVersion}.zip`);
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
