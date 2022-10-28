import { Parser } from 'json2csv';
import fs from 'fs';

// Convert JSON to CSV
function json2csv(obj: any, fields: any) {

    let opts: any = { fields };
    let parser = new Parser(opts)
    let csv = parser.parse(obj)

    return csv;
}

// Export to local drive
function exportCsv(csv: any, path: string) {
    fs.writeFile(path, csv, err => {
        if (err) {
            console.log(err);
        }
    })    
}

export { json2csv, exportCsv };