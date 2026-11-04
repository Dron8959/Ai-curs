/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Cloud sessions can't download Remotion's own Chrome (remotion.media is blocked),
// so use the Chromium headless shell that is preinstalled there. On a local machine
// this path doesn't exist, and Remotion falls back to its own browser download.
import fs from "node:fs";
const CLOUD_HEADLESS_SHELL =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const browserExecutable =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  (fs.existsSync(CLOUD_HEADLESS_SHELL) ? CLOUD_HEADLESS_SHELL : null);
if (browserExecutable) {
  Config.setBrowserExecutable(browserExecutable);
}
