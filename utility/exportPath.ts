import path from 'path';
import { time, fullDate, timestamp } from './time';

const exportsFolderPath: string = path.resolve("exports");

// Add your local directory path here
const exportPath = {
    userBalances: `${exportsFolderPath}/${timestamp()}_${fullDate()}_UserBalances.csv`,
}

export {exportPath};