const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");
const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
} = require("./utils/contacts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const app = express();
const port = 3000;

// Konfigurasi flash mesasages
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
// End Konfigurasi flash mesasages

// Gunakan EJS
app.set("view engine", "ejs");

// Third party middelware
app.use(expressLayouts);
// End Third party middelware

// built-in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// End built-in middleware

app.get("/", (req, res) => {
  const mahasiswas = [
    {
      namaMahasiswa: "Dimas",
      emailMahasiswa: "dimas@gmail.com",
    },
    {
      namaMahasiswa: "Erik",
      emailMahasiswa: "Erik@gmail.com",
    },
    {
      namaMahasiswa: "Surya",
      emailMahasiswa: "Surya@gmail.com",
    },
  ];
  res.render("index", {
    nama: "dimas",
    title: "Halaman Home",
    mahasiswas,
    layout: "layouts/main-layout",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layout",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
    contacts: contacts,
    msg: req.flash("msg"),
  });
});

app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);

      if (duplikat) {
        throw new Error("Nama Kontak sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("noHP", "Nomor Handphone tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Halaman Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      // Kirim flash message
      req.flash("msg", "Data kontak berhasi ditambahkan!");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
  });
});

app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data kontak berhasil dihapus!");
    res.redirect("/contact");
  }
});

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("edit-contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);

      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama Kontak sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("noHP", "Nomor Handphone tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Halaman Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      // Kirim flash message
      req.flash("msg", "Data kontak berhasi diubah!");
      res.redirect("/contact");
    }
  }
);

app.use((req, res) => {
  res.status(404);
  res.render("index", { nama: "dimas" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
