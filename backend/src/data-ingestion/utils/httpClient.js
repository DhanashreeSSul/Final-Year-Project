/**
 * HTTP Client for official data source API calls.
 * Includes timeout, user-agent, and error handling.
 */
const https = require('https');
const http = require('http');
const { URL } = require('url');

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const USER_AGENT = 'ShaktiPlatform/1.0 (Rural Women Empowerment; +https://github.com/shakti-platform)';

/**
 * Make an HTTP GET request and return parsed JSON.
 * @param {string} url - Full URL to fetch
 * @param {object} [options] - Optional overrides
 * @returns {Promise<object>} - Parsed JSON response
 */
function fetchJSON(url, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;

        const reqOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            timeout: options.timeout || DEFAULT_TIMEOUT,
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json',
                ...options.headers,
            },
        };

        const req = client.request(reqOptions, (res) => {
            let data = '';

            // Limit response size to 50MB
            const maxSize = options.maxSize || 50 * 1024 * 1024;
            let totalSize = 0;

            res.on('data', (chunk) => {
                totalSize += chunk.length;
                if (totalSize > maxSize) {
                    req.destroy();
                    reject(new Error(`Response exceeds maximum size of ${maxSize} bytes`));
                    return;
                }
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error(`Failed to parse JSON response: ${e.message}`));
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
                }
            });
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error(`Request timed out after ${reqOptions.timeout}ms`));
        });

        req.on('error', (err) => {
            reject(new Error(`HTTP request failed: ${err.message}`));
        });

        req.end();
    });
}

module.exports = { fetchJSON, USER_AGENT, DEFAULT_TIMEOUT };
