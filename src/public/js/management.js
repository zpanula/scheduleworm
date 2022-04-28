function updateNewShiftModalValues(username) {
  document.getElementById('newShiftUsername').value = username;

  const date = new Date();
  document.getElementById('shiftDate').value = date
    .toISOString()
    .substring(0, 10);
}

