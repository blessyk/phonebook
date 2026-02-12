const API_URL = 'http://localhost:3000/contacts';
let currentPage = 1;
const limit = 5;
let totalPages = 1;

getAllContacts()

const nameInput = document.getElementById("name")
const phoneInput = document.getElementById("phone")
const id = document.getElementById("contact-id")
const search = document.getElementById("search")
const btnSubmit = document.getElementById("add-contact")

btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault()
    const contact = {
        name: nameInput.value,
        phone: phoneInput.value
    }

    const phonePattern = /^[0-9]{10}$/;
    const namePattern = /^[A-Za-z ]+$/;

    // Required validation
    if (nameInput.value == "") {
        alert("Name is required");
        return;
    }

    if (!namePattern.test(nameInput.value)) {
        alert("Name should contain only letters");
        return;
    }

    if (phoneInput.value == "") {
        alert("Phone number is required");
        return;
    }

    if (!phonePattern.test(phoneInput.value)) {
        alert("Phone number must be exactly 10 digits");
        return;
    }

    try {
        if (id.value) {
            await fetch(API_URL + '/' + id.value, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            })

        }
        else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            })
        }
    }
    catch (error) {
        alert(error)
    }

    getAllContacts()
})

async function getAllContacts() {
    try {
        const response = await fetch(`${API_URL}?_page=${currentPage}&_limit=${limit}`)
        const contacts = await response.json()

        const totalCount = response.headers.get("X-Total-Count");
        totalPages = Math.ceil(totalCount / limit);

        displayContacts(contacts)
        renderPagination();

    }
    catch (error) {
        alert(error)
    }
}

function displayContacts(contacts) {
   // console.log(contacts)
    const list = document.getElementById("contact-list")
    list.innerHTML = ''

    contacts.forEach(contact => {
        const tr = document.createElement("tr")
        tr.innerHTML = `<td>${contact.name}</td>
                        <td>${contact.phone}</td>
                        <td><button  class="btn btn-sm btn-success" onClick = "editContact(${contact.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onClick = "deleteContact(${contact.id})">Delete</button></td>`
        list.appendChild(tr)
    })
}

async function deleteContact(id) {
    if (!confirm('Delete this contact?')) return

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        getAllContacts()
    }
    catch (error) {
        alert(erorr)
    }
}

async function editContact(id) {
    const response = await fetch(`${API_URL}/${id}`)
    const contact = await response.json()

    nameInput.value = contact.name
    phoneInput.value = contact.phone
    id.value = contact.id
    btnSubmit.textContent = 'Update'

}

search.addEventListener('input', async () => {
  const response = await fetch(API_URL);
  const contacts = await response.json();

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.value.toLowerCase()) ||
    c.phone.includes(search.value)
  );

  displayContacts(filtered);
});

//for pagination
function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    pagination.innerHTML += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `;


    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${currentPage === i ? "active" : ""}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }

    
    pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;
}

function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    getAllContacts();
}
