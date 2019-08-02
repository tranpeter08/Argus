let authState = {
  loading: false,
  authToken: '',
  username: ''
};

let registerState = {userData: ''};

let employeesState = {employees: ''};

let employeeFormDefaults = {
  employeeName: {
    firstName: '',
    middleInit: '',
    lastName: ''
  },
  contact: {
    phone: '',
    email: ''
  },
  certifications: [], 
  equipment: [],
  notes: '',
  id: ''
}

let employeeFormState = {
  employeeName: {
    firstName: '',
    middleInit: '',
    lastName: ''
  },
  contact: {
    phone: '',
    email: ''
  },
  certifications: [], 
  equipment: [],
  notes: '',
  id: ''
};

let pageState = {
  current: 1,
  pages: ''
};

let employeeId;