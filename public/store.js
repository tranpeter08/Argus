const employeeDefaults = {
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
  notes: ''
}

let employeeState = {...employeeDefaults}

const pageStorage = {
  start: 0,
  pages: 1
}

const userState = {
  authToken : ''
}

const authState = {
  loading: false,
  authToken: ''
}