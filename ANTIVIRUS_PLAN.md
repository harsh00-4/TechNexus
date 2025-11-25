# Antivirus Integration Plan 🛡️

**Goal:** Add basic antivirus scanning to the TechNexus backend to protect against malicious file uploads.

## Proposed Steps
1. **Install ClamAV wrapper**
   ```bash
   npm install node-clam --save
   ```
2. **Create utility** `server/utils/antivirus.js` with a `scanFile(filePath)` function that:
   - Connects to the local ClamAV daemon.
   - Scans the file and returns a promise.
   - Throws an error if the file is infected.
3. **Add startup check** in `server/index.js` to verify the ClamAV daemon is running; log a warning if not.
4. **Update any file‑upload routes** (e.g., `/api/upload`) to call `scanFile` before processing the upload. If the scan fails, respond with `400 Bad Request` and a safe message.
5. **Document** the new steps in `MAINTENANCE.md` under a new **Antivirus** section.

## Why This Helps
- Prevents malicious binaries or scripts from being stored on the server.
- Adds a layer of defense against ransomware, trojans, and other malware.
- Uses the widely‑deployed open‑source ClamAV engine.

## Open Questions
- Do you have ClamAV installed on the server machine? If not, we can add instructions to install it.
- Will you have any file‑upload endpoints now, or should we create a placeholder `/api/upload` route for future use?

**Next:** Await your approval to proceed with installing the package and adding the utility.
