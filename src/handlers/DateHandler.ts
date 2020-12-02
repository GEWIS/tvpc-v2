/**
 * Function that returns true if we are in the month December
 */
export function shouldShowSnow() {
  let today = new Date();
  if (today.getMonth() === 11) {
    return true;
  }
}
