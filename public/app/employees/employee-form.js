const employeeForm = `
  <section class="js-form">
    <form id="js-employee-form" action="#" >
      <fieldset>
        <legend class="js-employee-form-legend main-legend"></legend>
        <div class="form-content">
          <div class="row">
            <div class="col-6">
              <h2>Employee Name</h2>
              <div>
              <label for="first-name" >First</label>
              <input
                class="name"
                type="text"
                name="first-name"
                id="first-name" required autofocus>
              </div>
              <div>
                <label for="middle-initial">Middle Initial</label>
                  <input 
                    class="name"
                    type="text" 
                    name="middle-initial" 
                    id="middle-initial" 
                    maxlength ="1">
              </div>
              <div>
                <label for="last-name">Last</label>
                <input 
                  class="name"
                  type="text" 
                  name="last-name" 
                  id="last-name" required>
              </div>
            </div>
            <div class="col-6">  
              <h2>Contact Information</h2>

              <label for="phone">Telephone</label>
              <input type="text" id="phone" name="phone"
                class="js-contact"
                placeholder="123-456-7890"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
              ><span class="validity"></span>
              <br>
              <label for="email">E-mail</label>
              <input type="email" id="email" name="email"
                class="js-contact"
                placeholder="name@domain.com"
                required
              ><span class="validity"></span>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <h2>Equipment</h2>

              <label for="equipment-name">Description/Name</label>
              <input 
                class="js-equip-clear" 
                type="text" 
                id="equipment-name">
                <br>
              <label for="equipment-number">Part Number</label>
              <input 
                class="js-equip-clear"  
                type="text" 
                id="equipment-number">
                <br>
              <button 
                class="js-add-equip form-button add-equip" 
                type="button"
              >
                add Equipment
              </button>

              <button 
                class="js-list-clear form-button" 
                type="button">Clear List</button>

              <div class="js-equip-list equip-list"></div>
            </div>
            <div class="col-6">
              <fieldset>
                <legend class="cert-legend">Certifications</legend>
                <label for="CWI" class="certs">
                  <input 
                  type= "checkbox" 
                  name="certs" 
                  id="CWI" 
                  value ="CWI">
                  Certified Welding Inspector (A.W.S.)</label>
                
                <label for="UT" class="certs">
                  <input 
                  type= "checkbox" 
                  name="certs" 
                  id="UT" 
                  value="UT">
                  Ultrasonic Testing</label>
                
                <label for="MT" class="certs">
                  <input 
                  type= "checkbox" 
                  name="certs" 
                  id="MT" 
                  value="MT">
                  Magnatic Particle Testing</label>
                
                <label for="GPR" class="certs">
                    <input 
                    type= "checkbox" 
                    name="certs" 
                    id="GPR" 
                    value="GPR">
                    Ground Penetrating Radar</label>
                
                <label for="soils" class="certs">
                    <input 
                    type= "checkbox" 
                    name="certs" 
                    id="soils" 
                    value="soils">
                    Soils Inspector</label>

                <label for="concrete" class="certs">
                    <input 
                    type= "checkbox" 
                    name="certs" 
                    id="concrete" 
                    value="concrete">
                    Concrete Inspector</label>
              </fieldset>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <h2>Notes</h2>

              <textarea 
                aria-label="textarea"
                class="js-add-notes" 
                name="" 
                id="" cols="30" rows="10"></textarea>
            </div>
          </div>
          <div class="row form-control">
            <div class="col-4">
              <button 
                class="js-employee-form-reset form-button" 
                type="reset">Clear Form
              </button>
            </div>
            <div class="col-4">
              <button 
                type="button" 
                class="js-cancel-form form-button ">Cancel
              </button>
            </div>
            <div class="col-4">
              <button 
                class="js-employee-form-submit-btn employee-form-submit-btn form-button" 
                type="submit"
              >
              </button>
            </div>
          </div>
          <div class='js-employee-form-error'></div>
        </div>
      </fieldset>
    </form>
  </section>
`;

function addFormClass(className) {
  $('#js-employee-form').addClass(className);
}

function formLegendText(text) {
  $('.js-employee-form-legend').text(text);
}
function formSubmitBtnText(text) {
  $('.js-employee-form-submit-btn').text(text);
}

function collectEmployeeName() {
  const firstName = $('#first-name').val();
  const middleInit = $('#middle-initial').val();
  const lastName = $('#last-name').val();

  employeeFormState.employeeName = {firstName, middleInit, lastName};
}

function collectEmployeeContact() {
  const phone = $('#phone').val();
  const email = $('#email').val();
  employeeFormState.contact = {phone, email};
}

function collectCerts() {
  $('input[name=certs]:checked').each(function() {
    employeeFormState.certifications.push($(this).val());
  });
}

function renderAddEquipList(equips) {
  $('.js-equip-list').html(`
    <h3>Equipment List</h3>            
    <ol>
      ${
        (equips.map((item, index) => generateEquipList(item, index))).join('')
      }
    </ol>
  `);
}

function generateEquipList(item, index) {
  return `
    <li class="js-equip-list" item-index="${index}">
      ${item} 
      <button 
        class="js-item-delete delete-equip form-button" 
        type="button"
      >
        Delete
      </button>
    </li>
  `;
}

function addEquipment() {
  $('#root').on('click', '.js-add-equip', () => {
    storeEquipment();
  });
}

function storeEquipment() {
  let equipName = $('#equipment-name').val();
  let equipNumber = $('#equipment-number').val();
  let equipDesc;

  if (!equipNumber) {
    equipNumber = 'N/A';
  }

  equipDesc = `${equipName} (${equipNumber})`;

  if (equipName) {
    employeeFormState.equipment.push(equipDesc);

    $('.js-equip-clear').val('');
    renderAddEquipList(employeeFormState.equipment);
  };
}

function clearEquipList() {
  $('#root').on('click', '.js-list-clear', () => {
    clearEquipListDOM();
    clearEquipmentStore();
  });
}

function deleteEquipItem() {
  $('#root').on('click', '.js-item-delete', function() {
    const itemIndex = $(this)
      .closest('.js-equip-list')
      .attr('item-index');

    employeeFormState.equipment.splice(itemIndex, 1);
    renderAddEquipList(employeeFormState.equipment);

    if (employeeFormState.equipment.length === 0) {
      clearEquipListDOM();
    }
  });
}

function clearEquipmentStore() {
  employeeFormState.equipment = [];
}

function clearEquipListDOM() {
  $('.js-equip-list').empty();
}

function collectNotes() {
  employeeFormState.notes = $('.js-add-notes').val();
}

function cancelForm() {
  $('#root').on('click', '.js-cancel-form', () => {
    resetFormState();
    renderEmployeesSect();
    scrollTop();
  });
}

function resetForm() {
  $('#root').on('click', '.js-employee-form-reset', () => {
    resetFormState();
    clearEquipListDOM();
    $('#js-employee-form').trigger('reset');
  });
}

function resetFormState() {
  employeeFormState.employeeName = {
    firstName: '',
    middleInit: '',
    lastName: ''
  }

  employeeFormState.contact = {
    phone: '',
    email: ''
  }

  employeeFormState.certifications = [];
  employeeFormState.equipment = [];
  employeeFormState.notes = '';
}

$(
  cancelForm(),
  resetForm(),
  deleteEquipItem(),
  clearEquipList(),
  addEquipment()
);