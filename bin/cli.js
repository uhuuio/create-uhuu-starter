#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

async function cloneExampleOnly(targetDir, example) {
    return new Promise((resolve, reject) => {
        const commands = [
            `git init "${targetDir}"`,  // Initialize a git repository in the target directory
            `cd "${targetDir}"`,
            `git remote add origin https://github.com/uhuuio/uhuu-starter`,  // Add the repository as a remote
            `git config core.sparseCheckout true`,  // Enable sparse checkout
            `echo "examples/${example}/*" >> .git/info/sparse-checkout`,  // Only include the specified example folder
            `git pull origin main`,  // Pull the contents of the example folder
            `mv examples/${example}/* .`,  // Move the contents of the example to the root of the target directory
            `rm -rf examples`,  // Remove the empty "examples" folder
            `rm -rf .git`  // Clean up the .git folder
        ].join(" && ");

        exec(commands, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${stderr}`);
                reject(error);
                return;
            }
            console.log(stdout);
            resolve();
        });
    });
}

async function installDependencies(targetDir) {
    return new Promise((resolve, reject) => {
        console.log("Installing dependencies...");
        exec(`npm install`, { cwd: targetDir, stdio: "inherit" }, (installError) => {
            if (installError) {
                console.error("Failed to install dependencies:", installError.message);
                reject(installError);
                return;
            }
            resolve();
        });
    });
}

async function main() {
    const args = process.argv.slice(2);
    const exampleIndex = args.indexOf("--example");
    const example = exampleIndex > -1 && args[exampleIndex + 1] ? args[exampleIndex + 1] : "basic-alone";
    const targetDir = path.join(process.cwd(), example);

    console.log(`Creating a new Uhuu starter app in: ${targetDir}`);
    try {
        await cloneExampleOnly(targetDir, example);
        await installDependencies(targetDir);
        console.log("Setup complete! Dependencies installed.");
    } catch (error) {
        console.error("Failed to create Uhuu starter app:", error.message);
        process.exit(1);
    }
}

main();