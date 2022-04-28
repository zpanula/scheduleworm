let newShift = {
  username: '',
  startTime: '',
  endTime: '',
  date: '',
  clear() {
    this.username = '';
    this.startTime = '';
    this.endTime = '';
    this.date = '';
  },
  storeUser(username) {
    this.username = username;
  },
};

function updateNewShiftModalValues(username) {
  document.getElementById('newShiftUsername').value = username;

  const date = new Date();
  document.getElementById('shiftDate').value = date
    .toISOString()
    .substring(0, 10);
}

