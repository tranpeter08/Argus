function getEmployees(success, fail) {
  return ajaxReq(
    '/employees',
    'GET', 
    null,
    success,
    fail
  );
}

function employeesSuccess(data) {
  storeEmployees(data);
  handlePaging();
  employeesRender();
}

function employeesRender() {
  renderEmployeesSect();
  renderPageNum();
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
          <div class="start-box inline js-empty">${startBtn()}</div>
          <div class="prev-box inline js-empty">${prevBtn()}</div>
          <div class="next-box inline js-empty">${nextBtn()}</div>
          <div class="last-box inline js-empty">${lastBtn()}</div>
        </div>
      </div>
    </section>
  `);
}

function employeesList() {
  const {employees} = employeesState;
  const {current} = pageState;
  const index = current - 1;

  const items = [];

  for (let n = index * 9; n < index * 9 + 9; n++) {
    if (employees[n]) {
      items.push(`${employeeCard(employees[n], n)}`);
    }
  }

  return items.join('');
}

function renderEmployees() {
  $('.employee-list').html(employeesList());
}

function employeesError({responseJSON}) {
  const errMsg = `<p>${responseJSON.message}</p>`;
  $('.js-employee-list-ctnr').html(errMsg);
  resetFormState();
}