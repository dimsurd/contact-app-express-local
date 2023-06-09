const fs = require("fs");

// validasi cek folder dan file

// buat folder jika belum ada
const dirPath = "./data";

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}
// end buat folder jika belum ada

// buat file jika belum ada
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}
// End buat file jika belum ada

// End validasi cek folder dan file

// Membuat Readline

const loadContact = () => {
  const file = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(file);

  return contacts;
};

const findContact = (nama) => {
  const contacts = loadContact();

  const dataDetail = contacts.find((contact) => {
    return contact.nama.toLowerCase() === nama.toLowerCase();
  });

  return dataDetail;
};

// rewrite data json

const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2));
};

// Add new Data
const addContact = (contact) => {
  const contacts = loadContact();

  contacts.push(contact);
  saveContacts(contacts);
};
// End Add new Data

// Hapus kontak
const deleteContact = (nama) => {
  const contacts = loadContact();

  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);

  saveContacts(filteredContacts);
};
// End Hapus kontak

const updateContacts = (contactBaru) => {
  const contacts = loadContact();

  const indexContact = contacts.findIndex((contact) => {
    return contact.nama === contactBaru.oldNama;
  });

  delete contactBaru.oldNama;

  contacts[indexContact] = contactBaru;

  saveContacts(contacts);
};

// End rewrite data json

// Check duplicate by name
const cekDuplikat = (nama) => {
  const contacts = loadContact();

  return contacts.find((contact) => contact.nama === nama);
};
// End Check duplicate by name

module.exports = {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
};
