const editClassName = 'js-employee-form-edit';

function renderEditForm() {
  $('#root').html(employeeForm);

  formClassName(editClassName);
  formSubmitBtnText('Edit Employee');
  scrollTop();
}

function fillEmployeeForm(data) {
  const {
    employeeName: {firstName, middleInit, lastName}, 
    contact: {phone, email}, 
    certifications, 
    equipment, 
    _id, 
    notes
  } = data;

  formLegendText(`Editing ${firstName} ${middleInit} ${lastName}`);

  employeeFormState.equipment = equipment;
  employeeFormState.id = _id;

  $('#first-name').val(firstName);
  $('#middle-initial').val(middleInit);
  $('#last-name').val(lastName);
  $('#phone').val(phone);
  $('#email').val(email);

  selectEmployeeCerts(certifications);
  renderAddEquipList(equipment);

  $('.js-add-notes').val(notes);
}