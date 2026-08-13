// ======================================================
// FRESHMART - GROCERIES DATA
// ======================================================

const groceriesData = [
  // ====================================================
  // 🌾 RICE
  // ====================================================

  {
    id: "grocery-001",
    name: "Premium Basmati Rice",
    searchNames: [
      "rice",
      "basmati rice",
      "chawal",
      "basmati chawal",
      "basmati",
      "चावल",
    ],
    category: "Rice & Grains",
    price: 180,
    oldPrice: 220,
    rating: 4.8,
    stock: 40,
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",
  },

  {
    id: "grocery-002",
    name: "Brown Rice",
    searchNames: ["brown rice", "brown chawal", "rice", "chawal"],
    category: "Rice & Grains",
    price: 150,
    oldPrice: 180,
    rating: 4.6,
    stock: 30,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
  },

  {
    id: "grocery-003",
    name: "Sona Masoori Rice",
    searchNames: [
      "sona masoori",
      "sona masuri",
      "rice",
      "chawal",
      "sona masoori rice",
    ],
    category: "Rice & Grains",
    price: 120,
    oldPrice: 145,
    rating: 4.7,
    stock: 35,
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99",
  },

  // ====================================================
  // 🌾 FLOUR / ATTA
  // ====================================================

  {
    id: "grocery-004",
    name: "Whole Wheat Atta",
    searchNames: [
      "atta",
      "wheat flour",
      "flour",
      "gehun ka atta",
      "gehun",
      "aata",
      "आटा",
      "गेहूं",
    ],
    category: "Flour & Grains",
    price: 260,
    oldPrice: 300,
    rating: 4.8,
    stock: 45,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
  },

  {
    id: "grocery-005",
    name: "Multigrain Atta",
    searchNames: ["multigrain atta", "multigrain flour", "atta", "aata"],
    category: "Flour & Grains",
    price: 320,
    oldPrice: 370,
    rating: 4.7,
    stock: 30,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
  },

  {
    id: "grocery-006",
    name: "Besan",
    searchNames: [
      "besan",
      "gram flour",
      "chickpea flour",
      "besan flour",
      "बेसन",
    ],
    category: "Flour & Grains",
    price: 110,
    oldPrice: 135,
    rating: 4.7,
    stock: 35,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
  },

  // ====================================================
  // 🌾 DAL / PULSES
  // ====================================================

  {
    id: "grocery-007",
    name: "Toor Dal",
    searchNames: [
      "toor dal",
      "tuvar dal",
      "arhar dal",
      "dal",
      "tur dal",
      "तूर दाल",
      "अरहर दाल",
    ],
    category: "Dal & Pulses",
    price: 160,
    oldPrice: 190,
    rating: 4.8,
    stock: 40,
    image: "https://images.unsplash.com/photo-1585997868439-88eba7e6a4a2",
  },

  {
    id: "grocery-008",
    name: "Moong Dal",
    searchNames: ["moong dal", "mung dal", "dal", "moong", "मूंग दाल"],
    category: "Dal & Pulses",
    price: 145,
    oldPrice: 175,
    rating: 4.8,
    stock: 35,
    image: "https://images.unsplash.com/photo-1599909533730-f9d0d7c9d9b3",
  },

  {
    id: "grocery-009",
    name: "Masoor Dal",
    searchNames: ["masoor dal", "red lentils", "dal", "masoor", "मसूर दाल"],
    category: "Dal & Pulses",
    price: 130,
    oldPrice: 160,
    rating: 4.7,
    stock: 40,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
  },

  {
    id: "grocery-010",
    name: "Chana Dal",
    searchNames: ["chana dal", "gram dal", "dal", "chana", "चना दाल"],
    category: "Dal & Pulses",
    price: 120,
    oldPrice: 145,
    rating: 4.7,
    stock: 40,
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e3",
  },

  // ====================================================
  // 🍬 SUGAR
  // ====================================================

  {
    id: "grocery-011",
    name: "White Sugar",
    searchNames: ["sugar", "white sugar", "chini", "cheeni", "चीनी"],
    category: "Staples",
    price: 55,
    oldPrice: 65,
    rating: 4.6,
    stock: 60,
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635",
  },

  {
    id: "grocery-012",
    name: "Brown Sugar",
    searchNames: ["brown sugar", "brown chini", "brown cheeni", "sugar"],
    category: "Staples",
    price: 90,
    oldPrice: 110,
    rating: 4.6,
    stock: 30,
    image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7d",
  },

  // ====================================================
  // 🧂 SALT
  // ====================================================

  {
    id: "grocery-013",
    name: "Iodized Salt",
    searchNames: ["salt", "iodized salt", "namak", "salt packet", "नमक"],
    category: "Staples",
    price: 25,
    oldPrice: 30,
    rating: 4.7,
    stock: 70,
    image: "https://images.unsplash.com/photo-1518110925495-5fe2d47e7a0f",
  },

  {
    id: "grocery-014",
    name: "Rock Salt",
    searchNames: ["rock salt", "sendha namak", "sendha", "namak", "सेंधा नमक"],
    category: "Staples",
    price: 45,
    oldPrice: 60,
    rating: 4.8,
    stock: 35,
    image: "https://images.unsplash.com/photo-1606851094655-b2594f5e0f3a",
  },

  // ====================================================
  // 🫗 OIL
  // ====================================================

  {
    id: "grocery-015",
    name: "Sunflower Cooking Oil",
    searchNames: [
      "oil",
      "cooking oil",
      "sunflower oil",
      "surajmukhi tel",
      "tel",
      "तेल",
    ],
    category: "Cooking Essentials",
    price: 145,
    oldPrice: 170,
    rating: 4.7,
    stock: 45,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
  },

  {
    id: "grocery-016",
    name: "Mustard Oil",
    searchNames: [
      "mustard oil",
      "sarso oil",
      "sarson tel",
      "sarso ka tel",
      "tel",
      "सरसों तेल",
    ],
    category: "Cooking Essentials",
    price: 170,
    oldPrice: 200,
    rating: 4.8,
    stock: 40,
    image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1",
  },

  {
    id: "grocery-017",
    name: "Olive Oil",
    searchNames: ["olive oil", "extra virgin olive oil", "olive", "tel"],
    category: "Cooking Essentials",
    price: 450,
    oldPrice: 520,
    rating: 4.8,
    stock: 20,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
  },

  // ====================================================
  // 🧈 GHEE
  // ====================================================

  {
    id: "grocery-018",
    name: "Pure Cow Ghee",
    searchNames: [
      "ghee",
      "cow ghee",
      "desi ghee",
      "pure ghee",
      "घी",
      "देसी घी",
    ],
    category: "Dairy & Breakfast",
    price: 520,
    oldPrice: 600,
    rating: 4.9,
    stock: 25,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
  },

  // ====================================================
  // 🥛 MILK
  // ====================================================

  {
    id: "grocery-019",
    name: "Fresh Full Cream Milk",
    searchNames: ["milk", "full cream milk", "doodh", "dudh", "दूध"],
    category: "Dairy & Breakfast",
    price: 65,
    oldPrice: 70,
    rating: 4.8,
    stock: 50,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
  },

  // ====================================================
  // 🧈 BUTTER
  // ====================================================

  {
    id: "grocery-020",
    name: "Salted Butter",
    searchNames: ["butter", "salted butter", "makhan", "मक्खन"],
    category: "Dairy & Breakfast",
    price: 60,
    oldPrice: 75,
    rating: 4.8,
    stock: 35,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d",
  },

  // ====================================================
  // 🧀 CHEESE
  // ====================================================

  {
    id: "grocery-021",
    name: "Cheese Slices",
    searchNames: ["cheese", "cheese slices", "cheese slice", "paneer", "चीज"],
    category: "Dairy & Breakfast",
    price: 140,
    oldPrice: 170,
    rating: 4.7,
    stock: 25,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
  },

  // ====================================================
  // 🥣 OATS
  // ====================================================

  {
    id: "grocery-022",
    name: "Healthy Rolled Oats",
    searchNames: ["oats", "rolled oats", "oatmeal", "healthy oats", "ओट्स"],
    category: "Breakfast",
    price: 150,
    oldPrice: 180,
    rating: 4.8,
    stock: 30,
    image: "https://images.unsplash.com/photo-1517093728432-7c5a3f2f0f7c",
  },

  // ====================================================
  // ☕ TEA
  // ====================================================

  {
    id: "grocery-023",
    name: "Premium Tea",
    searchNames: [
      "tea",
      "chai",
      "chay",
      "tea leaves",
      "chai patti",
      "चाय",
      "चाय पत्ती",
    ],
    category: "Beverages",
    price: 180,
    oldPrice: 220,
    rating: 4.8,
    stock: 35,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9",
  },

  // ====================================================
  // ☕ COFFEE
  // ====================================================

  {
    id: "grocery-024",
    name: "Instant Coffee",
    searchNames: ["coffee", "instant coffee", "coffee powder", "kapi", "कॉफी"],
    category: "Beverages",
    price: 250,
    oldPrice: 300,
    rating: 4.8,
    stock: 25,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
  },

  // ====================================================
  // 🍝 PASTA
  // ====================================================

  {
    id: "grocery-025",
    name: "Durum Wheat Pasta",
    searchNames: [
      "pasta",
      "pasta noodles",
      "macaroni",
      "pasta packet",
      "पास्ता",
    ],
    category: "Packaged Food",
    price: 95,
    oldPrice: 120,
    rating: 4.7,
    stock: 30,
    image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0",
  },

  // ====================================================
  // 🍜 NOODLES
  // ====================================================

  {
    id: "grocery-026",
    name: "Instant Noodles",
    searchNames: [
      "noodles",
      "instant noodles",
      "maggi",
      "noodle",
      "noodles packet",
      "नूडल्स",
    ],
    category: "Packaged Food",
    price: 60,
    oldPrice: 75,
    rating: 4.7,
    stock: 45,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
  },

  // ====================================================
  // 🍪 BISCUITS
  // ====================================================

  {
    id: "grocery-027",
    name: "Chocolate Biscuits",
    searchNames: [
      "biscuits",
      "biscuit",
      "cookies",
      "chocolate biscuits",
      "chocolate cookies",
      "बिस्किट",
    ],
    category: "Snacks",
    price: 45,
    oldPrice: 55,
    rating: 4.7,
    stock: 50,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
  },

  // ====================================================
  // 🍫 CHOCOLATE
  // ====================================================

  {
    id: "grocery-028",
    name: "Milk Chocolate",
    searchNames: [
      "chocolate",
      "milk chocolate",
      "choco",
      "chocolate bar",
      "चॉकलेट",
    ],
    category: "Snacks",
    price: 100,
    oldPrice: 120,
    rating: 4.9,
    stock: 35,
    image: "https://images.unsplash.com/photo-1548907040-4d42c2b5e2b1",
  },

  // ====================================================
  // 🥜 ALMONDS
  // ====================================================

  {
    id: "grocery-029",
    name: "Premium Almonds",
    searchNames: ["almonds", "almond", "badam", "badaam", "बादाम"],
    category: "Dry Fruits",
    price: 650,
    oldPrice: 750,
    rating: 4.9,
    stock: 20,
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46",
  },

  // ====================================================
  // 🥜 CASHEW
  // ====================================================

  {
    id: "grocery-030",
    name: "Premium Cashews",
    searchNames: ["cashew", "cashews", "kaju", "kaaju", "काजू"],
    category: "Dry Fruits",
    price: 720,
    oldPrice: 850,
    rating: 4.9,
    stock: 18,
    image: "https://images.unsplash.com/photo-1551620513-006d2c1f9e99",
  },

  // ====================================================
  // 🍇 RAISINS
  // ====================================================

  {
    id: "grocery-031",
    name: "Premium Raisins",
    searchNames: ["raisins", "raisin", "kishmish", "kismis", "किशमिश"],
    category: "Dry Fruits",
    price: 350,
    oldPrice: 420,
    rating: 4.8,
    stock: 25,
    image: "https://images.unsplash.com/photo-1599599810694-57a6f5f0a8c2",
  },

  // ====================================================
  // 🌰 WALNUT
  // ====================================================

  {
    id: "grocery-032",
    name: "Premium Walnuts",
    searchNames: ["walnut", "walnuts", "akhrot", "akhrot giri", "अखरोट"],
    category: "Dry Fruits",
    price: 780,
    oldPrice: 900,
    rating: 4.8,
    stock: 15,
    image: "https://images.unsplash.com/photo-1508747703725-719777637510",
  },

  // ====================================================
  // 🍯 HONEY
  // ====================================================

  {
    id: "grocery-033",
    name: "Pure Natural Honey",
    searchNames: [
      "honey",
      "natural honey",
      "pure honey",
      "shahad",
      "shehad",
      "शहद",
    ],
    category: "Staples",
    price: 280,
    oldPrice: 340,
    rating: 4.8,
    stock: 25,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38",
  },

  // ====================================================
  // 🥫 TOMATO KETCHUP
  // ====================================================

  {
    id: "grocery-034",
    name: "Tomato Ketchup",
    searchNames: [
      "ketchup",
      "tomato ketchup",
      "tomato sauce",
      "sauce",
      "tamatar sauce",
      "केचप",
    ],
    category: "Packaged Food",
    price: 120,
    oldPrice: 145,
    rating: 4.7,
    stock: 30,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7",
  },

  // ====================================================
  // 🍿 POPCORN
  // ====================================================

  {
    id: "grocery-035",
    name: "Popcorn Kernels",
    searchNames: [
      "popcorn",
      "popcorn kernels",
      "corn kernels",
      "makai",
      "मकई",
      "पॉपकॉर्न",
    ],
    category: "Snacks",
    price: 80,
    oldPrice: 100,
    rating: 4.6,
    stock: 30,
    image: "https://images.unsplash.com/photo-1578849278619-8e2820c1e5f6",
  },
];

export default groceriesData;
