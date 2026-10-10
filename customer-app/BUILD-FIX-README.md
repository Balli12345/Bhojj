# BHOJJ Customer build / deploy notes

1. Open this project root (the folder containing package.json).
2. `npm ci`
3. `npm run build`
4. Confirm `dist/index.html` exists and test locally with `npm run preview`.
5. To sync the customer HTML into Capacitor: `npm run sync:android:customer`.

The earlier AI Studio blank screen was consistent with missing generated `dist` assets. This workflow is intended to generate and sync them, but the current package has not been claimed as successfully built in this environment: dependency installation timed out here. Please run the commands and review any errors.

Hostinger and Termux steps are in `HOSTINGER-TERMUX-SETUP-HI.md`.
