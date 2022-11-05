const addContactForm = document.getElementById('addContactForm');
const contactsForm = document.getElementById('contactsForm');
const nameInput = document.getElementById('nameInput');
const telInput = document.getElementById('telInput');
const submitBT = document.getElementById('submitBT');
const contactsContainer = document.getElementById('contactsContainer');

let formMode;
let editingContactID;

function setStoredData(value, key = 'data') {
    localStorage.setItem(key, JSON.stringify(value));
};

function getStoredData(key = 'data') {
    return JSON.parse(localStorage.getItem(key));
};

function getHighestID(contacts = []) {
    let highestID = 0;
    contacts.forEach((c) => {
       if (c.ID > highestID) { highestID = c.ID; }
    });

    return highestID;
};

function setFormToEdit(contact) {
    telInput.value = contact.tel ?? '';
    nameInput.value = contact.name ?? '';
    
    formMode = 'edit';
    submitBT.textContent = 'Editar';

    nameInput.focus();
};

function setFormToAdd() {
    telInput.value = '';
    nameInput.value = '';

    formMode = 'add';
    submitBT.textContent = 'Agregar';

    nameInput.focus();
};

function addContact({ name, tel }) {
    const storedData = getStoredData() ?? [];

    const ID = getHighestID(storedData) + 1;

    const newContact = {
        name,
        tel,
        ID
    };
    
    storedData.push(newContact);

    setStoredData(storedData);

    return storedData;
};

function editContact(ID, contact) {
    const storedData = getStoredData() ?? [];

    const updatedData = storedData.map((c) => {
        if (c.ID === ID)
            return {
                ...c,
                ...contact
            }
        else return c;
    });

    return updatedData;
};

function deleteContact(ID) {
    const storedData = getStoredData() ?? [];

    const filteredData = storedData.filter((e) => e.ID !== ID);

    setStoredData(filteredData);

    return filteredData;
};

function handleClickDeleteBT(contact) {
    const contacts = deleteContact(contact.ID);
    paintContacts(contacts);
};

function handleClickEditBT(contact) {
    editingContactID = contact.ID;
    setFormToEdit(contact);
};

function paintContacts(contacts = [], containerElement) {
    const storedData = getStoredData() ?? [];
    const fragment = document.createDocumentFragment();

    contactsContainer.innerHTML = null;

    contacts.forEach((c) => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        const span = document.createElement('span');
        const div = document.createElement('div');
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');
        const buttonsDelimiter = document.createElement('span');

        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => handleClickDeleteBT(c));

        editButton.textContent = 'editar';
        editButton.addEventListener('click', () => handleClickEditBT(c));

        li.classList.add('contact-list_item');

        span.textContent = c.name;
        strong.textContent = c.tel;
        buttonsDelimiter.textContent = '|';

        deleteButton.classList.add('delete-contact_bt');
        editButton.classList.add('edit-contact_bt');

        div.append(editButton);
        div.append(buttonsDelimiter);
        div.append(deleteButton);

        li.append(span);
        li.append(strong);
        li.append(div);

        fragment.append(li);
    });

    contactsContainer.append(fragment);
}


let prevInputValue = '';
function handleTelInput(event) {
    if (!(prevInputValue.length > event.target.value.length && [...prevInputValue].pop() === '-')) {
        const valueToArr = [...event.target.value];
        const lastCh = valueToArr.pop();
        const valueSplitted = event.target.value.split('-');

        if (lastCh === ' ' || isNaN(Number(lastCh)) || event.target.value.length > 11) {
            event.target.value = valueToArr.slice(0, valueToArr.length).join('');

            return;
        }

        let valueFormatted = [];
        let valueWithoutDash = valueSplitted.join('');

        for (let index = 0; index < valueWithoutDash.length; index++) {
            const currCh = valueWithoutDash[index];
            valueFormatted.push(((index + 1) % 3 !== 0) || (index + 1 === 9) ? currCh : `${currCh}-`);
        }

        event.target.value = valueFormatted.join('');
    }
    prevInputValue = event.target.value;
};

function handleSubmit(event) {
    event.preventDefault();

    let contacts = [];

    if (formMode === 'edit') {
        contacts = editContact(
            editingContactID,
            {
                name: nameInput.value,
                tel: telInput.value
            });
    } else {
        contacts = addContact({
            name: nameInput.value,
            tel: telInput.value
        });
    }

    setFormToAdd();
    paintContacts(contacts);
};

telInput.addEventListener('input', handleTelInput);
addContactForm.addEventListener('submit', handleSubmit);

(() => {
    // localStorage.clear();
    const storedData = getStoredData();
    if (storedData) paintContacts(storedData)
    else setStoredData([]);
    setFormToAdd();
})();
