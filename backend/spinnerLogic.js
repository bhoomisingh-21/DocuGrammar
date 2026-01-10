// spinnerLogic.js
// Minimal spinner implementation — safe to call from server logs.
// If you previously used a fancier spinner, this keeps the same API.
export function showSpinner() {
  // return a simple spinner/log string — not blocking
  const spinners = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
  const i = Math.floor(Math.random() * spinners.length);
  return `${spinners[i]} checking…`;
}
