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
    <li class="js-employee flex-item" employee-id="${id}">
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
        <div class='js-employee-err'></div>
      </div>
    </li>        
  `
}

function listItems(items = []) {
  return items.map(item => `<li>${item}</li>`).join('');
}

function editEmployee() {
  $('#root').on('click', '.js-edit-employee-button', function() {
    const employee = $(this).closest('.js-employee');
    const id = employee.attr('employee-id');

    // renderEditForm();
    
    ajaxReq(
      `/employees/${id}`,
      'GET',
      null,
      employeeOK,
      employeeErr(employee)
    );
  });
}

function employeeOK(data) {
  renderEditForm();
  fillEmployeeForm(data);
}

function employeeErr(employee) {
  return function ({responseJSON: {message}}) {

    const errMsg = `<p class='error'>${message}</p>`;
    $(employee).find('.js-employee-err').html(errMsg);
  }
}

$(
  editEmployee(),
  // deleteEmployee(),
);