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
const clearBTN = document.getElementById("clear-btn");
const ul = document.getElementById("root");

let editableItem;
let currentFilter = "all";

let TODOS = JSON.parse(localStorage.getItem("todos")) || [
  { id: 1, title: "Send Email", isdone: false },
  { id: 2, title: "Running", isdone: false }
];

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(TODOS));
}

function handleAddTodo() {
  const inputval = input.value.trim();
  if (!inputval) return;

  const newTodo = {
    id: Math.floor(Math.random() * 100000),
    title: inputval,
    isdone: false
  };

  TODOS.push(newTodo);
  input.value = "";
  saveToLocalStorage();
  renderTodos();
}

function handleDeleteTodo(id) {
  TODOS = TODOS.filter(todo => todo.id !== id);
  saveToLocalStorage();
  renderTodos();
}

function handleEditTodo(id) {
  editableItem = id;
  renderTodos();
}

function handleSaveEdit(id) {
  const inputEdit = document.getElementById("inputvaledit");
  const foundIndex = TODOS.findIndex(todo => todo.id === id);
  if (foundIndex !== -1) {
    TODOS[foundIndex].title = inputEdit.value;
    editableItem = null;
    saveToLocalStorage();
    renderTodos();
  }
}

function toggleDone(id) {
  const todo = TODOS.find(todo => todo.id === id);
  if (todo) {
    todo.isdone = !todo.isdone;
    saveToLocalStorage();
    renderTodos();
  }
}

function renderTodos() {
  let filteredTodos = TODOS;

  if (currentFilter === "done") {
    filteredTodos = TODOS.filter(todo => todo.isdone);
  } else if (currentFilter === "undone") {
    filteredTodos = TODOS.filter(todo => !todo.isdone);
  }

  const template = filteredTodos.map(todo => {
    const titleHTML = todo.id === editableItem
      ? `<input id="inputvaledit" value="${todo.title}" />`
      : `<span style="text-decoration: ${todo.isdone ? 'line-through' : 'none'};">${todo.title}</span>`;

    const editOrSaveButton = todo.id === editableItem
      ? `<img onclick="handleSaveEdit(${todo.id})" src="./img/save-svgrepo-com.svg" width="20px" alt="" class="btnonli">`
      : `<img onclick="handleEditTodo(${todo.id})" src="./img/edit-svgrepo-com.svg" width="20px" alt="" class="btnonli">`;

    return `
      <li class="li">
        ${titleHTML}
        <div class="btninput">
          ${editOrSaveButton}
          <img onclick="handleDeleteTodo(${todo.id})" src="./img/delete2-svgrepo-com.svg" width="20px" alt="" class="btnonli">
          <img onclick="toggleDone(${todo.id})" src="./img/done.svg" width="20px" alt="" class="btnonli">
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

function clearAllTodos() {
  TODOS = [];
  localStorage.removeItem("todos");
  renderTodos();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    handleAddTodo();
  }
}

input.addEventListener("keypress", handleKeyPress);
addBTN.addEventListener("click", handleAddTodo);
clearBTN.addEventListener("click", clearAllTodos);

// Accordion toggle logic
const accordionHeader = document.querySelector(".accordion-header");
const accordionContent = document.querySelector(".accordion-content");

accordionHeader.addEventListener("click", () => {
  accordionContent.style.display = accordionContent.style.display === "block" ? "none" : "block";
});

// Filter radio buttons
const filterRadios = document.querySelectorAll("input[name='filter']");
filterRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    currentFilter = radio.value;
    renderTodos();
  });
});

renderTodos();
