// ======================================================
// FRESHMART - VEGETABLES DATA
// ======================================================

const vegetablesData = [
  // ====================================================
  // 🥔 POTATO
  // ====================================================

  {
    id: "veg-001",
    name: "Fresh Potato",
    searchNames: ["potato", "potatoes", "alu", "aloo", "batata", "आलू"],
    category: "Root Vegetables",
    subcategory: "Potato",
    price: 45,
    oldPrice: 60,
    rating: 4.7,
    stock: 80,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
  },

  {
    id: "veg-002",
    name: "Baby Potato",
    searchNames: ["baby potato", "baby potatoes", "baby alu", "baby aloo"],
    category: "Root Vegetables",
    subcategory: "Potato",
    price: 65,
    oldPrice: 80,
    rating: 4.6,
    stock: 40,
    image: "https://images.unsplash.com/photo-1590165482129-1b8b27698780",
  },

  // ====================================================
  // 🧅 ONION
  // ====================================================

  {
    id: "veg-003",
    name: "Fresh Red Onion",
    searchNames: [
      "onion",
      "onions",
      "red onion",
      "pyaz",
      "pyaaz",
      "kanda",
      "प्याज",
    ],
    category: "Root Vegetables",
    subcategory: "Onion",
    price: 50,
    oldPrice: 65,
    rating: 4.7,
    stock: 75,
    image: "https://images.unsplash.com/photo-1508747703725-719777637510",
  },

  {
    id: "veg-004",
    name: "White Onion",
    searchNames: ["white onion", "white onions", "safed pyaz", "safed pyaaz"],
    category: "Root Vegetables",
    subcategory: "Onion",
    price: 65,
    oldPrice: 80,
    rating: 4.6,
    stock: 35,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb",
  },

  // ====================================================
  // 🍅 TOMATO
  // ====================================================

  {
    id: "veg-005",
    name: "Fresh Red Tomato",
    searchNames: [
      "tomato",
      "tomatoes",
      "red tomato",
      "tamatar",
      "tamaatar",
      "टमाटर",
    ],
    category: "Fresh Vegetables",
    subcategory: "Tomato",
    price: 55,
    oldPrice: 70,
    rating: 4.8,
    stock: 70,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337",
  },

  {
    id: "veg-006",
    name: "Cherry Tomato",
    searchNames: ["cherry tomato", "cherry tomatoes", "small tomato"],
    category: "Fresh Vegetables",
    subcategory: "Tomato",
    price: 120,
    oldPrice: 150,
    rating: 4.8,
    stock: 30,
    image: "https://images.unsplash.com/photo-1561136594-7f68413baa99",
  },

  // ====================================================
  // 🥕 CARROT
  // ====================================================

  {
    id: "veg-007",
    name: "Fresh Carrot",
    searchNames: ["carrot", "carrots", "gajar", "gazar", "गाजर"],
    category: "Root Vegetables",
    subcategory: "Carrot",
    price: 70,
    oldPrice: 90,
    rating: 4.7,
    stock: 55,
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a",
  },

  // ====================================================
  // 🥬 SPINACH
  // ====================================================

  {
    id: "veg-008",
    name: "Fresh Spinach",
    searchNames: ["spinach", "palak", "fresh palak", "पालक"],
    category: "Leafy Greens",
    subcategory: "Spinach",
    price: 35,
    oldPrice: 50,
    rating: 4.7,
    stock: 45,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
  },

  // ====================================================
  // 🥦 BROCCOLI
  // ====================================================

  {
    id: "veg-009",
    name: "Fresh Broccoli",
    searchNames: ["broccoli", "broccolis", "hari broccoli"],
    category: "Cruciferous",
    subcategory: "Broccoli",
    price: 110,
    oldPrice: 140,
    rating: 4.8,
    stock: 25,
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc",
  },

  // ====================================================
  // 🥬 CABBAGE
  // ====================================================

  {
    id: "veg-010",
    name: "Fresh Cabbage",
    searchNames: [
      "cabbage",
      "cabbages",
      "patta gobhi",
      "patta gobi",
      "band gobhi",
      "band gobi",
      "पत्ता गोभी",
    ],
    category: "Cruciferous",
    subcategory: "Cabbage",
    price: 45,
    oldPrice: 60,
    rating: 4.6,
    stock: 50,
    image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f",
  },

  // ====================================================
  // 🥦 CAULIFLOWER
  // ====================================================

  {
    id: "veg-011",
    name: "Fresh Cauliflower",
    searchNames: [
      "cauliflower",
      "cauliflowers",
      "gobhi",
      "gobi",
      "phool gobhi",
      "phoolgobhi",
      "फूल गोभी",
    ],
    category: "Cruciferous",
    subcategory: "Cauliflower",
    price: 55,
    oldPrice: 70,
    rating: 4.7,
    stock: 45,
    image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3",
  },

  // ====================================================
  // 🫑 CAPSICUM
  // ====================================================

  {
    id: "veg-012",
    name: "Fresh Green Capsicum",
    searchNames: [
      "capsicum",
      "bell pepper",
      "green capsicum",
      "shimla mirch",
      "hari shimla mirch",
      "शिमला मिर्च",
    ],
    category: "Fresh Vegetables",
    subcategory: "Capsicum",
    price: 90,
    oldPrice: 120,
    rating: 4.7,
    stock: 35,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83",
  },

  // ====================================================
  // 🌶️ CHILLI
  // ====================================================

  {
    id: "veg-013",
    name: "Fresh Green Chilli",
    searchNames: [
      "green chilli",
      "green chili",
      "chilli",
      "chili",
      "hari mirch",
      "mirchi",
      "हरी मिर्च",
    ],
    category: "Fresh Vegetables",
    subcategory: "Chilli",
    price: 80,
    oldPrice: 100,
    rating: 4.6,
    stock: 40,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d",
  },

  // ====================================================
  // 🥒 CUCUMBER
  // ====================================================

  {
    id: "veg-014",
    name: "Fresh Cucumber",
    searchNames: [
      "cucumber",
      "cucumbers",
      "kheera",
      "khira",
      "kakdi",
      "खीरा",
      "ककड़ी",
    ],
    category: "Fresh Vegetables",
    subcategory: "Cucumber",
    price: 45,
    oldPrice: 60,
    rating: 4.7,
    stock: 55,
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6",
  },

  // ====================================================
  // 🥒 LADY FINGER
  // ====================================================

  {
    id: "veg-015",
    name: "Fresh Lady Finger",
    searchNames: ["lady finger", "ladies finger", "okra", "bhindi", "भिंडी"],
    category: "Fresh Vegetables",
    subcategory: "Lady Finger",
    price: 70,
    oldPrice: 90,
    rating: 4.7,
    stock: 40,
    image: "https://images.unsplash.com/photo-1425543103986-22abb7d7ea0d",
  },

  // ====================================================
  // 🍆 BRINJAL
  // ====================================================

  {
    id: "veg-016",
    name: "Fresh Brinjal",
    searchNames: [
      "brinjal",
      "eggplant",
      "eggplants",
      "baingan",
      "begun",
      "बैंगन",
    ],
    category: "Fresh Vegetables",
    subcategory: "Brinjal",
    price: 65,
    oldPrice: 85,
    rating: 4.6,
    stock: 45,
    image: "https://images.unsplash.com/photo-1528826007177-f38517ce9a8b",
  },

  // ====================================================
  // 🫛 GREEN PEAS
  // ====================================================

  {
    id: "veg-017",
    name: "Fresh Green Peas",
    searchNames: ["peas", "green peas", "pea", "matar", "mattar", "मटर"],
    category: "Fresh Vegetables",
    subcategory: "Peas",
    price: 100,
    oldPrice: 130,
    rating: 4.8,
    stock: 30,
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15",
  },

  // ====================================================
  // 🧄 GARLIC
  // ====================================================

  {
    id: "veg-018",
    name: "Fresh Garlic",
    searchNames: ["garlic", "lahsun", "lehsun", "lasun", "लहसुन"],
    category: "Root Vegetables",
    subcategory: "Garlic",
    price: 140,
    oldPrice: 170,
    rating: 4.8,
    stock: 35,
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383",
  },

  // ====================================================
  // 🫚 GINGER
  // ====================================================

  {
    id: "veg-019",
    name: "Fresh Ginger",
    searchNames: ["ginger", "adrak", "adarak", "अदरक"],
    category: "Root Vegetables",
    subcategory: "Ginger",
    price: 120,
    oldPrice: 150,
    rating: 4.7,
    stock: 35,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
  },

  // ====================================================
  // 🎃 PUMPKIN
  // ====================================================

  {
    id: "veg-020",
    name: "Fresh Pumpkin",
    searchNames: ["pumpkin", "kaddu", "kadu", "कद्दू"],
    category: "Fresh Vegetables",
    subcategory: "Pumpkin",
    price: 50,
    oldPrice: 70,
    rating: 4.5,
    stock: 30,
    image: "https://images.unsplash.com/photo-1506911278844-a3c6c8b3a1f6",
  },

  // ====================================================
  // 🥒 BOTTLE GOURD
  // ====================================================

  {
    id: "veg-021",
    name: "Fresh Bottle Gourd",
    searchNames: ["bottle gourd", "lauki", "ghiya", "dudhi", "लौकी"],
    category: "Fresh Vegetables",
    subcategory: "Bottle Gourd",
    price: 50,
    oldPrice: 65,
    rating: 4.6,
    stock: 35,
    image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7",
  },

  // ====================================================
  // 🥒 RIDGE GOURD
  // ====================================================

  {
    id: "veg-022",
    name: "Fresh Ridge Gourd",
    searchNames: ["ridge gourd", "tori", "turai", "torai", "तुरई"],
    category: "Fresh Vegetables",
    subcategory: "Ridge Gourd",
    price: 65,
    oldPrice: 80,
    rating: 4.5,
    stock: 30,
    image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e",
  },

  // ====================================================
  // 🥒 BITTER GOURD
  // ====================================================

  {
    id: "veg-023",
    name: "Fresh Bitter Gourd",
    searchNames: ["bitter gourd", "bitter melon", "karela", "करैला", "करेला"],
    category: "Fresh Vegetables",
    subcategory: "Bitter Gourd",
    price: 80,
    oldPrice: 100,
    rating: 4.5,
    stock: 30,
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716",
  },

  // ====================================================
  // 🥕 RADISH
  // ====================================================

  {
    id: "veg-024",
    name: "Fresh Radish",
    searchNames: ["radish", "radishes", "mooli", "muli", "मूली"],
    category: "Root Vegetables",
    subcategory: "Radish",
    price: 45,
    oldPrice: 60,
    rating: 4.6,
    stock: 40,
    image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8",
  },

  // ====================================================
  // 🥬 CORIANDER
  // ====================================================

  {
    id: "veg-025",
    name: "Fresh Coriander",
    searchNames: [
      "coriander",
      "coriander leaves",
      "dhaniya",
      "dhania",
      "धनिया",
    ],
    category: "Leafy Greens",
    subcategory: "Coriander",
    price: 25,
    oldPrice: 35,
    rating: 4.7,
    stock: 50,
    image: "https://images.unsplash.com/photo-1588879460618-9247e0d9b0c0",
  },

  // ====================================================
  // 🌿 MINT
  // ====================================================

  {
    id: "veg-026",
    name: "Fresh Mint",
    searchNames: ["mint", "mint leaves", "pudina", "पुदीना"],
    category: "Leafy Greens",
    subcategory: "Mint",
    price: 25,
    oldPrice: 35,
    rating: 4.7,
    stock: 45,
    image: "https://images.unsplash.com/photo-1628557044797-f21a177c37ec",
  },

  // ====================================================
  // 🌿 METHI
  // ====================================================

  {
    id: "veg-027",
    name: "Fresh Fenugreek Leaves",
    searchNames: ["fenugreek", "fenugreek leaves", "methi", "मेथी"],
    category: "Leafy Greens",
    subcategory: "Fenugreek",
    price: 30,
    oldPrice: 45,
    rating: 4.6,
    stock: 35,
    image: "https://images.unsplash.com/photo-1603046891744-76e6300a0c5e",
  },

  // ====================================================
  // 🟣 BEETROOT
  // ====================================================

  {
    id: "veg-028",
    name: "Fresh Beetroot",
    searchNames: ["beetroot", "beet", "chukandar", "चुकंदर"],
    category: "Root Vegetables",
    subcategory: "Beetroot",
    price: 70,
    oldPrice: 90,
    rating: 4.7,
    stock: 35,
    image: "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82",
  },

  // ====================================================
  // 🌽 CORN
  // ====================================================

  {
    id: "veg-029",
    name: "Fresh Sweet Corn",
    searchNames: [
      "corn",
      "sweet corn",
      "corn cob",
      "makka",
      "makkai",
      "भुट्टा",
      "मक्का",
    ],
    category: "Fresh Vegetables",
    subcategory: "Corn",
    price: 45,
    oldPrice: 60,
    rating: 4.7,
    stock: 35,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076",
  },

  // ====================================================
  // 🥦 ZUCCHINI
  // ====================================================

  {
    id: "veg-030",
    name: "Fresh Zucchini",
    searchNames: ["zucchini", "courgette", "green zucchini"],
    category: "Fresh Vegetables",
    subcategory: "Zucchini",
    price: 100,
    oldPrice: 130,
    rating: 4.5,
    stock: 20,
    image: "https://images.unsplash.com/photo-1563252722-6434563a985d",
  },

  // ====================================================
  // 🥬 LETTUCE
  // ====================================================

  {
    id: "veg-031",
    name: "Fresh Lettuce",
    searchNames: ["lettuce", "lettuce leaves", "salad leaves"],
    category: "Leafy Greens",
    subcategory: "Lettuce",
    price: 80,
    oldPrice: 100,
    rating: 4.6,
    stock: 25,
    image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9",
  },

  // ====================================================
  // 🟢 SPRING ONION
  // ====================================================

  {
    id: "veg-032",
    name: "Fresh Spring Onion",
    searchNames: [
      "spring onion",
      "green onion",
      "scallion",
      "hara pyaz",
      "हरा प्याज",
    ],
    category: "Leafy Greens",
    subcategory: "Spring Onion",
    price: 55,
    oldPrice: 70,
    rating: 4.6,
    stock: 30,
    image: "https://images.unsplash.com/photo-1585849834908-3481231155e8",
  },
];

export default vegetablesData;
