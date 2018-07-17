
 //get database reqeust
 function postDataAPI(){

 }

function getDataAPI(){
    const settings= {
        url: 'http://localhost:8080/employees',
        dataType: 'json',
        contentType: 'application/json',
    }
    $.ajax(settings)
    .done(renderHTML_GET)
    .fail(()=>{
        console.log('Failed GET response')
    });
}


//clear data
function clearResults(){

}

function listEquip(equipment){
   return equipment.map((item)=>`<li>${item}</li>`)
}

function listCerts(certs){
    return certs.map((aCert)=>`<li>${aCert}</li>`)
}

function handleData(anEmployee){
    return `
        <hr>
        <li>
            
            <h3>${anEmployee.employeeName}</h3>
            <h4>Certifications</h4>
            <ul>
                ${listCerts(anEmployee.certifications).join('')}
            </ul>
            <h4>Equipment</h4>
            <ul>
                ${listEquip(anEmployee.equipment).join('')}
            </ul>
            <h4>Notes:</h4>
            <p>${anEmployee.notes}</p>
        </li>
    `
}

//render data from GET to HTML
function renderHTML_GET(data){
    console.log('render ran');
    console.log(data);
    $('.js-results').html(`
        <ol>
            ${data.map((anEmployee)=> handleData(anEmployee)).join('')}
        </ol>
    `)
}

 //view employees in database
function viewEmployees(){
    $('.view').on('click',(event)=>{
        console.log('view button ran');
       getDataAPI();

    })
}

//collect equipment data
function collectEquipment(){
    $()
}

//add equipment and make list on html
function addEquipment(){

}

//collect certificatin data
function collectCerts(){
    const certifications = []
    $('input[name=certs]:checked').each(function(){certifications.push($(this).val())});
    console.log(certifications);
    return certifications
}

    //submits employee information to database
function createEmployee(){
    $('#employee-data').on('submit', (event)=>{
        console.log('form ran');
        event.preventDefault();
        let firstName = $('#first-name').val();
        let lastName = $('#last-name').val();
        collectCerts();
        
    })
}

function runThis(){
    createEmployee();
    viewEmployees();
}

$(runThis);