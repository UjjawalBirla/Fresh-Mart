// ======================================================
// FRESHMART - FRUITS DATA
// ======================================================

const fruitsData = [
  // ====================================================
  // APPLES
  // ====================================================

  {
    id: "fruit-001",
    name: "Fresh Apple",
    searchNames: [
      "apple",
      "apples",
      "seb",
      "seब",
      "red apple",
      "lal seb",
      "kashmiri apple",
      "shimla apple",
    ],
    category: "Apples",
    subcategory: "Apples",
    price: 140,
    oldPrice: 180,
    rating: 4.8,
    stock: 40,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
  },

  {
    id: "fruit-002",
    name: "Green Apple",
    searchNames: [
      "green apple",
      "green apples",
      "hara seb",
      "green seb",
      "granny smith",
    ],
    category: "Apples",
    subcategory: "Apples",
    price: 160,
    oldPrice: 200,
    rating: 4.7,
    stock: 30,
    image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2",
  },

  {
    id: "fruit-003",
    name: "Red Delicious Apple",
    searchNames: ["red delicious", "red apple", "lal apple", "lal seb"],
    category: "Apples",
    subcategory: "Apples",
    price: 150,
    oldPrice: 190,
    rating: 4.8,
    stock: 35,
    image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a",
  },

  // ====================================================
  // BANANA
  // ====================================================

  {
    id: "fruit-004",
    name: "Fresh Banana",
    searchNames: [
      "banana",
      "bananas",
      "kela",
      "kele",
      "kela fruit",
      "yellow banana",
    ],
    category: "Banana",
    subcategory: "Banana",
    price: 55,
    oldPrice: 70,
    rating: 4.7,
    stock: 60,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
  },

  {
    id: "fruit-005",
    name: "Robusta Banana",
    searchNames: ["robusta banana", "robusta", "robusta kela", "kela"],
    category: "Banana",
    subcategory: "Banana",
    price: 60,
    oldPrice: 75,
    rating: 4.6,
    stock: 45,
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224",
  },

  // ====================================================
  // MANGO
  // ====================================================

  {
    id: "fruit-006",
    name: "Alphonso Mango",
    searchNames: [
      "mango",
      "mangoes",
      "aam",
      "aam fruit",
      "alphonso",
      "hapus",
      "hapus aam",
      "aamras",
    ],
    category: "Mango",
    subcategory: "Mango",
    price: 180,
    oldPrice: 230,
    rating: 4.9,
    stock: 25,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078",
  },

  {
    id: "fruit-007",
    name: "Kesar Mango",
    searchNames: ["kesar", "kesar mango", "kesar aam", "mango", "aam"],
    category: "Mango",
    subcategory: "Mango",
    price: 150,
    oldPrice: 200,
    rating: 4.8,
    stock: 28,
    image: "https://images.unsplash.com/photo-1605027990121-cbae9d4f7f95",
  },

  {
    id: "fruit-008",
    name: "Dasheri Mango",
    searchNames: ["dasheri", "dasheri mango", "dasheri aam", "mango", "aam"],
    category: "Mango",
    subcategory: "Mango",
    price: 120,
    oldPrice: 160,
    rating: 4.7,
    stock: 30,
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed",
  },

  // ====================================================
  // ORANGE / CITRUS
  // ====================================================

  {
    id: "fruit-009",
    name: "Fresh Orange",
    searchNames: [
      "orange",
      "oranges",
      "santra",
      "santara",
      "narangi",
      "orange fruit",
    ],
    category: "Citrus",
    subcategory: "Citrus",
    price: 90,
    oldPrice: 120,
    rating: 4.7,
    stock: 50,
    image: "https://images.unsplash.com/photo-1547514701-42782101795e",
  },

  {
    id: "fruit-010",
    name: "Sweet Lime",
    searchNames: [
      "sweet lime",
      "mosambi",
      "mosambi fruit",
      "mausambi",
      "mosambi juice",
    ],
    category: "Citrus",
    subcategory: "Citrus",
    price: 85,
    oldPrice: 110,
    rating: 4.6,
    stock: 35,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b",
  },

  {
    id: "fruit-011",
    name: "Fresh Lemon",
    searchNames: ["lemon", "lemons", "nimbu", "neembu", "limbu", "lemon fruit"],
    category: "Citrus",
    subcategory: "Citrus",
    price: 60,
    oldPrice: 80,
    rating: 4.7,
    stock: 70,
    image: "https://images.unsplash.com/photo-1590502593747-42a996133562",
  },

  // ====================================================
  // GRAPES
  // ====================================================

  {
    id: "fruit-012",
    name: "Green Grapes",
    searchNames: ["grapes", "grape", "green grapes", "hara angur", "angur"],
    category: "Grapes",
    subcategory: "Grapes",
    price: 100,
    oldPrice: 130,
    rating: 4.7,
    stock: 30,
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f",
  },

  {
    id: "fruit-013",
    name: "Black Grapes",
    searchNames: ["black grapes", "kale angur", "black grape", "angur"],
    category: "Grapes",
    subcategory: "Grapes",
    price: 120,
    oldPrice: 150,
    rating: 4.8,
    stock: 25,
    image: "https://images.unsplash.com/photo-1599819177626-b50d0f9f4e0e",
  },

  // ====================================================
  // MELONS
  // ====================================================

  {
    id: "fruit-014",
    name: "Fresh Watermelon",
    searchNames: [
      "watermelon",
      "watermelons",
      "tarbooz",
      "tarbooj",
      "tarbuj",
      "water melon",
    ],
    category: "Melons",
    subcategory: "Melons",
    price: 90,
    oldPrice: 120,
    rating: 4.6,
    stock: 25,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38",
  },

  {
    id: "fruit-015",
    name: "Sweet Muskmelon",
    searchNames: ["muskmelon", "kharbuja", "kharbooja", "kharbuze", "melon"],
    category: "Melons",
    subcategory: "Melons",
    price: 85,
    oldPrice: 110,
    rating: 4.6,
    stock: 30,
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50",
  },

  // ====================================================
  // TROPICAL
  // ====================================================

  {
    id: "fruit-016",
    name: "Fresh Papaya",
    searchNames: ["papaya", "papaya fruit", "papita", "papite"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 75,
    oldPrice: 100,
    rating: 4.5,
    stock: 25,
    image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305",
  },

  {
    id: "fruit-017",
    name: "Fresh Pineapple",
    searchNames: [
      "pineapple",
      "pine apples",
      "ananas",
      "annanas",
      "pineapple fruit",
    ],
    category: "Tropical",
    subcategory: "Tropical",
    price: 110,
    oldPrice: 140,
    rating: 4.8,
    stock: 20,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba",
  },

  {
    id: "fruit-018",
    name: "Fresh Guava",
    searchNames: ["guava", "guavas", "amrood", "amrud", "peru", "guava fruit"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 80,
    oldPrice: 105,
    rating: 4.6,
    stock: 35,
    image: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46",
  },

  {
    id: "fruit-019",
    name: "Fresh Kiwi",
    searchNames: ["kiwi", "kiwis", "kiwi fruit"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 180,
    oldPrice: 220,
    rating: 4.7,
    stock: 20,
    image: "https://images.unsplash.com/photo-1585059895524-72359e06133a",
  },

  {
    id: "fruit-020",
    name: "Fresh Dragon Fruit",
    searchNames: ["dragon fruit", "dragonfruit", "dragon fruit"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 220,
    oldPrice: 280,
    rating: 4.8,
    stock: 15,
    image: "https://images.unsplash.com/photo-1527325678964-54921661f888",
  },

  // ====================================================
  // POMEGRANATE
  // ====================================================

  {
    id: "fruit-021",
    name: "Fresh Pomegranate",
    searchNames: ["pomegranate", "pomegranates", "anar", "anaar", "anardana"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 160,
    oldPrice: 200,
    rating: 4.8,
    stock: 30,
    image: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc",
  },

  // ====================================================
  // PEAR
  // ====================================================

  {
    id: "fruit-022",
    name: "Fresh Pear",
    searchNames: ["pear", "pears", "nashpati", "nasapati", "nashpati fruit"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 130,
    oldPrice: 170,
    rating: 4.6,
    stock: 30,
    image: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a",
  },

  // ====================================================
  // PEACH
  // ====================================================

  {
    id: "fruit-023",
    name: "Fresh Peach",
    searchNames: ["peach", "peaches", "aadu", "aadoo", "peach fruit"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 180,
    oldPrice: 220,
    rating: 4.7,
    stock: 18,
    image: "https://images.unsplash.com/photo-1629828874514-7b5c7f1c1b5e",
  },

  // ====================================================
  // PLUM
  // ====================================================

  {
    id: "fruit-024",
    name: "Fresh Plum",
    searchNames: ["plum", "plums", "aloo bukhara", "alubukhara", "alu bukhara"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 190,
    oldPrice: 240,
    rating: 4.6,
    stock: 20,
    image: "https://images.unsplash.com/photo-1569870499705-504209102861",
  },

  // ====================================================
  // CHERRY
  // ====================================================

  {
    id: "fruit-025",
    name: "Fresh Cherries",
    searchNames: ["cherry", "cherries", "cherry fruit", "cherry fruit"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 350,
    oldPrice: 420,
    rating: 4.9,
    stock: 12,
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919",
  },

  // ====================================================
  // STRAWBERRY
  // ====================================================

  {
    id: "fruit-026",
    name: "Fresh Strawberry",
    searchNames: ["strawberry", "strawberries", "strawberry fruit"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 250,
    oldPrice: 320,
    rating: 4.8,
    stock: 15,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
  },

  // ====================================================
  // COCONUT
  // ====================================================

  {
    id: "fruit-027",
    name: "Fresh Coconut",
    searchNames: [
      "coconut",
      "coconuts",
      "nariyal",
      "nariyal pani",
      "coconut water",
    ],
    category: "Tropical",
    subcategory: "Tropical",
    price: 70,
    oldPrice: 90,
    rating: 4.7,
    stock: 30,
    image: "https://images.unsplash.com/photo-1580984969071-a8da8a2f4f89",
  },

  // ====================================================
  // FIG
  // ====================================================

  {
    id: "fruit-028",
    name: "Fresh Fig",
    searchNames: ["fig", "figs", "anjeer", "anjeer fruit"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 300,
    oldPrice: 380,
    rating: 4.7,
    stock: 12,
    image: "https://images.unsplash.com/photo-1601379760883-1bb497c558c4",
  },

  // ====================================================
  // DATES
  // ====================================================

  {
    id: "fruit-029",
    name: "Fresh Dates",
    searchNames: ["dates", "date fruit", "khajoor", "khajur", "kharek"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 220,
    oldPrice: 280,
    rating: 4.8,
    stock: 20,
    image: "https://images.unsplash.com/photo-1591084829001-7c1c8c8e7c7e",
  },

  // ====================================================
  // JACKFRUIT
  // ====================================================

  {
    id: "fruit-030",
    name: "Fresh Jackfruit",
    searchNames: ["jackfruit", "jack fruit", "kathal", "katahal"],
    category: "Tropical",
    subcategory: "Tropical",
    price: 100,
    oldPrice: 130,
    rating: 4.5,
    stock: 20,
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a",
  },
];

export default fruitsData;
