const weekdays = [
  document.getElementById('DATE_SUN'),
  document.getElementById('DATE_MON'),
  document.getElementById('DATE_TUE'),
  document.getElementById('DATE_WED'),
  document.getElementById('DATE_THU'),
  document.getElementById('DATE_FRI'),
  document.getElementById('DATE_SAT'),
];

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const d = new Date();

const day = d.getDay();
const date = d.getDate();
const month = d.getMonth();

let c = 0;
let c2 = 1;

for (let i = day; i <= 6; i += 1) {
  if (date + c > daysInMonth[month]) {
    weekdays[i].innerText = c2;
    c2 += 1;
  } else {
    weekdays[i].innerText = date + c;
    c += 1;
  }
}

c = 0;
c2 = 0;

for (let i = day - 1; i >= 0; i -= 1) {
  if (date - c <= 0) {
    weekdays[i].innerText = daysInMonth[month - 1] - c2;
    c2 += 1;
  } else {
    weekdays[i].innerText = date - c;
    c += 1;
  }
}
