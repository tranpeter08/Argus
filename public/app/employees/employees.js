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
  pageStorage.start = 0;
  storeEmployees(data);
  employeesRender();
}

function employeesRender() {
  renderEmployeesSect();
  handlePaging();
}

function storeEmployees(employees) {
  employeesState = {employees};
}

function renderEmployeesSect() {
  $('#root').html(`
    <section>
      <h2 class='employees-heading'>Employees</h2>
      <ul class='js-employee-list-ctnr employee-list flex-container'>
        ${employeesList()}
      </ul>
      <div class="row">
        <div class="col-12 page-number">
          <span class="js-page-num js-empty"></span>
        </div>
      </div>
      <div class="row bottom">
      <div class="col-12 js-page-box page-box">
        <div class="start-box inline js-empty"></div>
        <div class="prev-box inline js-empty"></div>
        <div class="next-box inline js-empty"></div>
        <div class="last-box inline js-empty"></div>
      </div>
    </div>
    </section>
  `);
}

function employeesList() {
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

function renderEmployees() {
  $('.employee-list').html(employeesList());
}

function employeeError({responseJSON}) {
  const errMsg = `<p>${responseJSON.message}</p>`;
  $('.js-employee-list-ctnr').html(errMsg);
}