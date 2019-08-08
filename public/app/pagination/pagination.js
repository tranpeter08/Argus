function handlePaging() {
  const total = employeesState.employees.length;
  const pages = Math.ceil(total / 9);

  pageState.pages = pages;
}

function renderPageNum() {
  const {current, pages} = pageState;
  if (pages === 0) {
    $('.js-page-num').text(`Page 1 of 1`);
  } else {
    $('.js-page-num')
    .text(`Page ${current} of ${pages}`)
  }
}

function scrollTop() {
  window.scrollTo({
    top:0,
    behavior: 'auto'
  });
}
  
function firstPage() {
  $('#root').on('click', '.start', () => {
    pageState.current = 1;
    employeesRender();
    scrollTop()
  });
}
  
function nextPage() {
  $('#root').on('click', '.next', () => {
    pageState.current += 1;
    employeesRender();
    scrollTop();
  });
}
  
function prevPage() {
  $('#root').on('click', '.prev', () => {
    pageState.current -= 1;
    employeesRender();
    scrollTop();
  });
}

function lastPage() {
  $('#root').on('click', '.last', () => {
    pageState.current = pageState.pages;
    employeesRender();
    scrollTop();
  });
}
  
function startBtn() {
  const {current, pages} = pageState;
  if (pages > 2 && current > 1) {
    return `<button class="start">Start</button>`;
  }

  return '';
}

function nextBtn() {
  const {current, pages} = pageState;
  if (current !== pages) {
    return `<button class="next">Next</button>`;
  }

  return '';
}

function prevBtn() {
  if (pageState.current > 1) {
    return `<button class="prev">Prev</button>`;
  }

  return '';
}

function lastBtn() {
  const {current, pages} = pageState;

  if (pages > 2 && current !== pages) {
    return `<button class="last">Last</button>`;
  }

  return '';
}

$(
  firstPage(),
  prevPage(),
  nextPage(),
  lastPage()
);