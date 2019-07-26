function getEmployees() {
  ajaxReq(
    '/employees', 
    'GET', 
    null,
    employeeSuccess,
    employeeError
  );
}

function employeeSuccess(data) {
  storeEmployees(data);
  renderEmployees();
}

function storeEmployees(employees) {
  employeesState = {employees};
}

function renderEmployees() {
  $('#root').html(`
    <section>
      <h2>Employees</h2>
      <ul class='employee-list flex-container'>
        ${listEmployees()}
      </ul>
    </section>
  `);
}

function listEmployees() {
  const {employees} = employeesState;
  const items = [];
  for (let n = pageStorage.start * 9; n < pageStorage.start * 9 + 9; n++) {
    if (employees[n]) {
      items.push(`${employeeCard(employees[n], n)}`);
    }
  }

  return items.join('');
}

function employeeCard(
  {
    certifications, 
    employeeName, 
    equipment, 
    notes, 
    id, 
    phone, 
    email
  }, 
  index
) {
  return `
    <li class="js-employee-list flex-item" employee-id="${id}">
      <div class="card">
        <div class= "content">
          <h3 class="js-employee-name name">#${index+1} ${employeeName}</h3>
          <hr>
          <h4>Contact Info:</h4>
          <p>Phone: ${phone}</p> 
          <p>E-mail: <a href="mailto:${email}">${email}</a></p>  
          <h4>Certifications:</h4>
          <ul class="form">
              ${listItems(certifications)}
          </ul>
          <h4>Equipment:</h4>
          <ul class="equip-list form">
              ${listItems(equipment)}
          </ul>
          <h4>Notes:</h4>
          <p>${notes}</p>
          <hr>
        </div>
        <div class="employee-button-box">
          <button 
            class='js-edit-employee-button employee-button employee-button-edit'
            type='button'
          >
            Edit
          </button>
          <button 
            class="js-delete-employee employee-button"
          >
            Delete
          </button>
        </div>
      </div>
    </li>        
  `
}

function listItems(items = []) {
  return items.map(item => `<li>${item}</li>`).join('');
}

function listEquip(equipment) {
  return equipment.map(item => `<li>${item}</li>`);
 }
 
function listCerts(certs) {
  return certs.map(cert => `<li>${cert}</li>`);
}

function viewEmployees() {

}

function employeeError(error) {

}