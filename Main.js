//clock

document.addEventListener('DOMContentLoaded', function () {


  function updateClock() {
    const clockElement = document.getElementById('digitalClock');
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedTime =
      `${String(hours).padStart(2, '0')}:` +
      `${String(minutes).padStart(2, '0')}:` +
      `${String(seconds).padStart(2, '0')}.` +
      `${String(Math.floor(milliseconds / 10)).padStart(2, '0')} ${ampm}`;

    clockElement.textContent = formattedTime;
  }

  setInterval(updateClock, 10);

  //calender
  const calendarBody = document.getElementById('calendarBody');
  const monthYear = document.getElementById('monthYear');

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function createCalendar(year, month) {
    calendarBody.innerHTML = "";
    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let row = document.createElement('tr');

    for (let i = 0; i < firstDay; i++) {
      let cell = document.createElement('td');
      row.appendChild(cell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      let cell = document.createElement('td');
      cell.textContent = day;

      if (day === currentDate && year === currentYear && month === currentMonth) {
        cell.classList.add('today');
      }

      row.appendChild(cell);

      if ((day + firstDay) % 7 === 0 || day === daysInMonth) {
        calendarBody.appendChild(row);
        row = document.createElement('tr');
      }
    }
  }

  createCalendar(currentYear, currentMonth);
});


//todolist

const input = document.querySelector("input[type='text']");
const addBTN = document.getElementById("add-btn");
const ul = document.getElementById("root");
let editableItem;

let TODOS = JSON.parse(localStorage.getItem("todos")) || [
  { id: 1, title: "Send Email", isdone: false },
  { id: 2, title: "Running", isdone: false }
];

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(TODOS));
}

function handleaddtodo() {
  const inputval = input.value.trim();
  if (!inputval) return;

  const NEWTODOS = {
    id: Math.floor(Math.random() * 100000),
    title: inputval,
    isdone: false,
  };

  TODOS.push(NEWTODOS);
  input.value = "";
  saveToLocalStorage();
  renderTodos();
}

function handleDeletetodo(targetId) {
  const targetIndex = TODOS.findIndex(item => item.id === targetId);
  TODOS.splice(targetIndex, 1);
  saveToLocalStorage();
  renderTodos();
}

function handleEdittodo(targetId) {
  editableItem = targetId;
  renderTodos();
}

function handleSaveEdit(id) {
  const inputEdit = document.getElementById("inputvaledit");
  const foundTodoIndex = TODOS.findIndex(item => item.id === id);
  if (foundTodoIndex !== -1) {
    TODOS[foundTodoIndex].title = inputEdit.value;
    editableItem = null;
    saveToLocalStorage();
    renderTodos();
  }
}

function doneTask(targetId) {
  const foundTodo = TODOS.find(item => item.id === targetId);
  if (foundTodo) {
    foundTodo.isdone = !foundTodo.isdone;
    saveToLocalStorage();
    renderTodos();
  }
}


function renderTodos() {
  const template = TODOS.map(item => {
    const titleHTML = item.id === editableItem
      ? `<input id="inputvaledit" value="${item.title}" />`
      : `<span style="text-decoration: ${item.isdone ? 'line-through' : 'none'};">${item.title}</span>`;

    const editOrSaveButton = item.id === editableItem
      ? `<img onclick="handleSaveEdit(${item.id})" src="./img/save-svgrepo-com.svg" width="20px" alt="" class="btnonli">`
      : `<img onclick="handleEdittodo(${item.id})" src="./img/edit-svgrepo-com.svg" width="20px" alt="" class="btnonli">`;

    return `
      <li class="li">
        ${titleHTML}
        <div class="btninput" >
            ${editOrSaveButton}
            <img onclick="handleDeletetodo(${item.id})" src="./img/delete2-svgrepo-com.svg" width="20px" alt="" class="btnonli">
            <img onclick="doneTask(${item.id})" src="./img/done.svg" width="20px" alt="" class="btnonli">
        </div>
      </li>
    `;
  }).join("");
  
  ul.innerHTML = template;

  if (editableItem !== null) {
    const inputEdit = document.getElementById("inputvaledit");
    if (inputEdit) {
      inputEdit.focus(); 
      inputEdit.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          handleSaveEdit(editableItem);
        }
      });
    }
  }
}

function handleKeyPress(evt) {
  if (evt.key === "Enter") {
    handleaddtodo();
  }
}

const clearBTN = document.getElementById("clear-btn");

function clearAllTodos() {
  TODOS = [];
  localStorage.removeItem("todos");
  renderTodos();
}

clearBTN.addEventListener("click", clearAllTodos);

renderTodos();
addBTN.addEventListener("click", handleaddtodo);
input.addEventListener("keypress", handleKeyPress);
