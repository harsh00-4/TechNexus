const NodeClam = require('clamscan');
const path = require('path');

let clamScanner = null;
let clamAvailable = false;

// Initialize ClamAV scanner
async function initClamAV() {
    try {
        const clam = new NodeClam().init({
            removeInfected: false,
            quarantineInfected: false,
            scanLog: null,
            debugMode: false,
            fileList: null,
            scanRecursively: false,
            clamdscan: {
                socket: false,
                host: '127.0.0.1',
                port: 3310,
                timeout: 60000,
                localFallback: false,
                path: null,
                configFile: null,
            },
        });

        clamScanner = await clam;
        clamAvailable = true;
        console.log('✓ ClamAV antivirus scanner initialized');
        return true;
    } catch (error) {
        console.warn('⚠️  ClamAV not available:', error.message);
        console.warn('⚠️  File uploads will work but without antivirus scanning');
        console.warn('⚠️  To enable antivirus: Install ClamAV and start clamd daemon');
        clamAvailable = false;
        return false;
    }
}

// Initialize on module load (non-blocking)
initClamAV().catch(() => { });

/**
 * Scans a file for viruses using ClamAV.
 * @param {string} filePath Absolute path to the file to scan.
 * @returns {Promise<void>} Resolves if clean or ClamAV unavailable, rejects with an error if infected.
 */
async function scanFile(filePath) {
    if (!clamAvailable) {
        // ClamAV not available, skip scanning
        return;
    }

    try {
        const { isInfected, viruses } = await clamScanner.isInfected(filePath);
        if (isInfected) {
            throw new Error(`File infected: ${viruses.join(', ')}`);
        }
    } catch (error) {
        // If scanning fails, throw the error
        throw error;
    }
}

module.exports = { scanFile, initClamAV, isClamAvailable: () => clamAvailable };
