/**
 * CSV Parser for official downloaded datasets.
 * Uses the csv-parse package for robust parsing.
 * Falls back to simple line-based parsing if csv-parse is not available.
 */
const fs = require('fs');
const path = require('path');

/**
 * Parse a CSV file and return an array of objects.
 * @param {string} filePath - Absolute path to CSV file
 * @param {object} [options] - Parser options
 * @param {string} [options.delimiter] - Column delimiter (default: ',')
 * @param {boolean} [options.skipEmpty] - Skip empty lines (default: true)
 * @returns {Promise<object[]>} - Array of row objects keyed by header
 */
async function parseCSV(filePath, options = {}) {
    const delimiter = options.delimiter || ',';
    const skipEmpty = options.skipEmpty !== false;

    // Try using csv-parse first
    try {
        const { parse } = require('csv-parse/sync');
        const content = fs.readFileSync(filePath, 'utf-8');
        return parse(content, {
            columns: true,
            skip_empty_lines: skipEmpty,
            delimiter,
            trim: true,
            relax_column_count: true,
        });
    } catch (e) {
        // Fallback to simple parsing
        console.log('[CSV Parser] csv-parse not available, using simple parser');
        return simpleParseCSV(filePath, delimiter, skipEmpty);
    }
}

/**
 * Simple CSV parsing fallback (no external dependency)
 */
function simpleParseCSV(filePath, delimiter, skipEmpty) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(l => l.trim());
    const result = [];

    if (lines.length < 2) return result;

    const headers = parseCSVLine(lines[0], delimiter);

    for (let i = 1; i < lines.length; i++) {
        if (skipEmpty && !lines[i]) continue;
        const values = parseCSVLine(lines[i], delimiter);
        const row = {};
        headers.forEach((h, idx) => {
            row[h.trim()] = (values[idx] || '').trim();
        });
        result.push(row);
    }

    return result;
}

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === delimiter && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

/**
 * Read source metadata for a CSV file.
 * Looks for a companion _meta.json file.
 * @param {string} csvFilePath - Path to the CSV
 * @returns {object|null} - Metadata object or null
 */
function readSourceMeta(csvFilePath) {
    const metaPath = csvFilePath.replace(/\.csv$/i, '_meta.json');
    try {
        if (fs.existsSync(metaPath)) {
            return JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        }
    } catch (e) {
        console.warn(`[CSV Parser] Failed to read metadata: ${metaPath}`);
    }
    return null;
}

/**
 * List CSV files in a directory.
 * @param {string} dirPath - Directory path
 * @returns {string[]} - Array of absolute paths to CSV files
 */
function listCSVFiles(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) return [];
        return fs.readdirSync(dirPath)
            .filter(f => f.toLowerCase().endsWith('.csv'))
            .map(f => path.join(dirPath, f));
    } catch (e) {
        return [];
    }
}

module.exports = { parseCSV, readSourceMeta, listCSVFiles };
