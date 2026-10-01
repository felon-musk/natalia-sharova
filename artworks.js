/*
  THE SHOP LIST
  -------------
  Each block between { } is one item in the shop.
  To add a painting, copy a block, paste it below, and change the details.

  type:     "original" or "print"
  status:   "available" or "sold"
  images:   the first photo is shown in the shop grid; the rest appear on the detail view
  room:     the mockup photo that fades in when someone hovers over the painting (leave "" if none yet)
  price, size, medium, year: leave "" if not known yet and they simply won't show
  buyLink:  paste the Stripe checkout link here (leave "" for now and the button becomes "Inquire")
  options:  for prints only: one line per size
*/

// SHOP LAYOUT: "staggered" (paintings sized to their real dimensions, loosely arranged)
//              or "grid" (the original even 3 × 3 grid). Change the word to switch.
const LAYOUT = "staggered";

const ARTWORKS = [
  {
    title: "Untitled No. 1",
    type: "original",
    status: "available",
    year: "",
    medium: "Acrylic",
    size: "40 × 40 in",
    price: "",
    images: ["images/painting-01.jpg"],
    room: "images/painting-01-room.jpg",
    description: "",
    buyLink: ""
  },
  {
    title: "Untitled No. 2",
    type: "original",
    status: "sold",
    year: "",
    medium: "Acrylic",
    size: "24 × 24 in",
    price: "",
    images: ["images/painting-02.jpg"],
    room: "images/painting-02-room.jpg",
    description: "",
    buyLink: ""
  },
  {
    title: "Untitled No. 3",
    type: "original",
    status: "sold",
    year: "",
    medium: "Acrylic",
    size: "30 × 30 in",
    price: "",
    images: ["images/painting-03.jpg"],
    room: "images/painting-03-room.jpg",
    description: "",
    buyLink: ""
  },
  {
    title: "Untitled No. 4",
    type: "original",
    status: "available",
    year: "",
    medium: "Acrylic",
    size: "24 × 24 in",
    price: "",
    images: ["images/painting-04.jpg"],
    room: "images/painting-04-room.jpg",
    description: "",
    buyLink: ""
  },
  {
    title: "Untitled No. 5",
    type: "original",
    status: "sold",
    year: "",
    medium: "Acrylic",
    size: "30 × 30 in",
    price: "",
    images: ["images/painting-05.jpg"],
    room: "images/painting-05-room.jpg",
    description: "",
    buyLink: ""
  },
  {
    title: "Untitled No. 6",
    type: "original",
    status: "available",
    year: "",
    medium: "Acrylic",
    size: "30 × 30 in",
    price: "",
    images: ["images/painting-06.jpg"],
    room: "images/painting-06-room.jpg",
    description: "",
    buyLink: ""
  },
  {
    title: "Untitled No. 7",
    type: "original",
    status: "sold",
    year: "",
    medium: "Acrylic",
    size: "36 × 36 in",
    price: "",
    images: ["images/painting-07.jpg"],
    room: "images/painting-07-room.jpg",
    description: "",
    buyLink: ""
  },
  {
    title: "Untitled No. 8",
    type: "original",
    status: "available",
    year: "",
    medium: "Acrylic",
    size: "30 × 30 in",
    price: "",
    images: ["images/painting-08.jpg"],
    room: "images/painting-08-room.jpg",
    description: "",
    buyLink: ""
  },
  {
    title: "Untitled No. 9",
    type: "original",
    status: "available",
    year: "",
    medium: "Acrylic",
    size: "24 × 24 in",
    price: "",
    images: ["images/painting-09.jpg"],
    room: "images/painting-09-room.jpg",
    description: "",
    buyLink: ""
  }
];

// Where "Inquire" buttons send people
const CONTACT_EMAIL = "hello@nataliasharova.com";
