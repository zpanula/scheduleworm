function updateNewShiftModalValues(username: string) {
  (document.getElementById('newShiftUsername')! as HTMLInputElement).value = username;

  const date = new Date();
  (document.getElementById('shiftDate')! as HTMLInputElement).value = date
    .toISOString()
    .substring(0, 10);
}
