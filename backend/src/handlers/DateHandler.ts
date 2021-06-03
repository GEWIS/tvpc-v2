/**
 * Function that returns true if we are in the month December
 */
export function shouldShowSnow() {
  const today = new Date();
  if (today.getMonth() === 11) {
    return true;
  }
}
