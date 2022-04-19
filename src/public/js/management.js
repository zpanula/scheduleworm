const adminPanel = document.getElementById('admin-panel');

const actionMenu =
  '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" href="#">Action</a><a class="dropdown-item" href="#">Another action</a><a class="dropdown-item" href="#">Something else here</a></div></div>';

fetch('/user', {
  method: 'GET', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    adminPanel.innerHTML += '<tbody>';
    data.forEach((element) => {
      console.log(element.email);
      adminPanel.innerHTML += `<tr><td>${element.email}</td><td>${element.isAdmin}</td><td>${actionMenu}</td></tr>`;
      adminPanel.innerHTML += '</tbody>';
    });
  })
  .catch((error) => {
    throw new Error(error);
  });
