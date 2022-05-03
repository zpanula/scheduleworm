// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setNewShiftModalValues(username: string) {
  const newShiftUsername = document.getElementById(
    'newShiftUsername'
  ) as HTMLInputElement;
  if (newShiftUsername) {
    newShiftUsername.value = username;
  }

  const shiftDate = document.getElementById('shiftDate') as HTMLInputElement;
  if (shiftDate) {
    shiftDate.value = new Date().toISOString().substring(0, 10);
  }
}

setNewShiftModalValues('blank');
