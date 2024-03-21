const days = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
];

const months = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december',
];

// ****** SELECT ITEMS **********

const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submit = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-btn');
const editBtn = document.querySelector('.edit-btn');
const deleteBtn = document.querySelector('.delete-btn');
const list = document.querySelector('.grocery-list');
const alert = document.querySelector('.alert');
const container = document.querySelector('.grocery-container');
const sectionCenter = document.querySelector('.section-center');
const btn = document.querySelector('.button-container');
const quote = document.querySelector('.quote-container');

// *******DATE ITEMS********

const t = document.querySelector('.time');

// DATE ITEMS FUNCTIONALITY
let time = new Date();
let saal = time.getFullYear();
let maah = months[time.getMonth()];
let ruzHafta = days[time.getDay()];
let ruz = time.getDate();

const date = ruz;
const month = maah;
const weekday = ruzHafta;
const year = saal;

t.textContent = `${date} ${month}, ${weekday}, ${year}`;

// edit option

let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
// HIDE QUOTE AND BUTTON AND SHOW FORM
btn.addEventListener('click', function () {
	sectionSetup('add');
});
// SUBMIT FORM
form.addEventListener('submit', addItem);
// CLEAR ITEMS
clearBtn.addEventListener('click', clearItem);
// DOM CONTENT LOADED
window.addEventListener('DOMContentLoaded', setupItems);
// ****** FUNCTIONS **********

// AddItem Function
function addItem(e) {
	e.preventDefault();
	const value = grocery.value;
	const id = new Date().getTime().toString();

	if (value && !editFlag) {
		createListItem(id, value);
		// display Alert
		displayAlert('activity added successfully!', 'success');
		// show what is returned
		container.classList.add('show-container');
		// Add to local Storage
		addToLocalStorage(id, value);
		// set back to default
		setBackToDefault();
	} else if (value && editFlag) {
		editElement.innerHTML = value;
		displayAlert('activity edited!', 'success');
		editLocalStorage(editID, value);
		setBackToDefault();
	} else {
		displayAlert('Please enter an activity!', 'danger');
	}
}

// Display Alert
function displayAlert(text, action) {
	alert.textContent = text;
	alert.classList.add(`alert-${action}`);
	// remove the item
	setTimeout(function () {
		alert.textContent = '';
		alert.classList.remove(`alert-${action}`);
	}, 1000);
}

// SET BACK TO DEFAULT
function setBackToDefault() {
	grocery.value = '';
	editFlag = false;
	editID = '';
	submit.textContent = 'submit';
}

// CLEAR ITEMS
function clearItem() {
	const items = list.querySelectorAll('.grocery-item');
	if (items.length > 0) {
		items.forEach(function (item) {
			list.removeChild(item);
		});
	}
	container.classList.remove('show-container');
	displayAlert('activities deleted!', 'danger');
	setBackToDefault();
	localStorage.removeItem('list', 'value');
	setTimeout(function () {
		sectionCenter.classList.remove('show-section');
	}, 1000);
	setTimeout(function () {
		sectionSetup('remove');
	}, 1100);
}
// DELETE ITEM
function deleteItem(e) {
	const element = e.currentTarget.parentElement.parentElement;
	const id = element.dataset.id;
	list.removeChild(element);
	if (list.children.length === 0) {
		container.classList.remove('show-container');
	}
	displayAlert('Bravo, activity done!', 'success');
	removeFromLocalStorage(id);
	setBackToDefault();
}
// EDIT ITEM
function editItem(e) {
	const element = e.currentTarget.parentElement.parentElement;
	editElement = e.currentTarget.parentElement.previousElementSibling;
	grocery.value = editElement.innerHTML;
	submit.textContent = 'edit';
	editFlag = true;
	editID = element.dataset.id;
}

// ADD or REMOVE quote and the Section
function sectionSetup(action) {
	if (action === 'add') {
		quote.classList.add('hide-text');
		btn.classList.add('hide-btn');
		sectionCenter.classList.add('show-section');
	} else if (action === 'remove') {
		quote.classList.remove('hide-text');
		btn.classList.remove('hide-btn');
		sectionCenter.classList.remove('show-section');
	}
}

// ****** LOCAL STORAGE **********

function addToLocalStorage(id, value) {
	const objects = { id, value };
	let items = getLocalStorage();
	items.push(objects);
	localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
	let items = getLocalStorage();
	items = items.filter(function (item) {
		if (item.id !== id) {
			return item;
		}
	});
	localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
	let items = getLocalStorage();
	items = items.map(function (item) {
		if (item.id === id) {
			item.value = value;
		}
		return item;
	});
	localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
	return localStorage.getItem('list')
		? JSON.parse(localStorage.getItem('list'))
		: [];
}
// localStorage.setItem('value', JSON.stringify(['item1', 'item2']));
// const oranges = JSON.parse(localStorage.getItem('value'));
// console.log(oranges);

// ****** SETUP ITEMS **********
function setupItems() {
	let items = getLocalStorage();
	if (items.length > 0) {
		items.forEach(function (item) {
			createListItem(item.id, item.value);
		});
		container.classList.add('show-container');
	}
}

function createListItem(id, value) {
	const element = document.createElement('article');
	const attr = document.createAttribute('data-id');
	attr.value = id;
	element.setAttributeNode(attr);
	element.classList.add('grocery-item');
	// the html inside the element
	element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-check"></i>
              </button>
            </div>
          `;
	// add event listeners to both buttons;
	const deleteBtn = element.querySelector('.delete-btn');
	deleteBtn.addEventListener('click', deleteItem);
	const editBtn = element.querySelector('.edit-btn');
	editBtn.addEventListener('click', editItem);
	//stick the element to its parent
	list.appendChild(element);
	// list height
	const listHeight = list.getBoundingClientRect().height;
}

// *******Grocery-list Height*******
