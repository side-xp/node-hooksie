// This script runs on "prepack" lifecycle hook when running "npm public" or "npm pack" command.
// https://docs.npmjs.com/cli/v8/using-npm/scripts#npm-publish

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distFolderPath = path.resolve(__dirname, '../dist');
const rootFolderPath = path.resolve(__dirname, '..');

/**
 * Copies all the files from dist/ folder into the root foldedr.
 * The goal is to flatten the files hierarchy to avoid subfolders in the package output.
 */
export function copyDistToRootFolder() {
  const distFilePaths = fs.readdirSync(distFolderPath, { recursive: true });

  for (const filePath of distFilePaths) {
    fs.copyFileSync(
      path.join(distFolderPath, filePath),
      path.join(rootFolderPath, filePath),
    );
  }
}

/**
 * Deletes all the files from the root folder that have the same relative path as in dist/ folder.
 * This function is intended to be called after {@link copyDistToRootFolder} in order to delete the files that have been copied just to
 * flatten the output files hierarchy.
 */
export function deleteOutputFilesFromRootFolder() {
  const distFilePaths = fs.readdirSync(distFolderPath, { recursive: true });

  for (const filePath of distFilePaths) {
    const filePathFromRoot = path.join(rootFolderPath, filePath);
    if (fs.existsSync(filePathFromRoot)) {
      fs.rmSync(filePathFromRoot);
    }
  }
}