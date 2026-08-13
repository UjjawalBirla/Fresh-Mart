const searchAliases = {
  // =====================================================
  // 🍎 FRUITS
  // =====================================================

  apple: ["apple", "apples", "seb", "seba"],
  apples: ["apple", "apples", "seb", "seba"],
  seb: ["apple", "apples", "seb", "seba"],
  seba: ["apple", "apples", "seb", "seba"],

  banana: ["banana", "bananas", "kela", "kele"],
  bananas: ["banana", "bananas", "kela", "kele"],
  kela: ["banana", "bananas", "kela", "kele"],
  kele: ["banana", "bananas", "kela", "kele"],

  mango: ["mango", "mangoes", "aam", "amba"],
  mangoes: ["mango", "mangoes", "aam", "amba"],
  aam: ["mango", "mangoes", "aam", "amba"],
  amba: ["mango", "mangoes", "aam", "amba"],

  orange: ["orange", "oranges", "santra", "santara", "narangi"],
  oranges: ["orange", "oranges", "santra", "santara", "narangi"],
  santra: ["orange", "oranges", "santra", "santara", "narangi"],
  santara: ["orange", "oranges", "santra", "santara", "narangi"],
  narangi: ["orange", "oranges", "santra", "santara", "narangi"],

  grapes: ["grapes", "grape", "angoor", "angur"],
  grape: ["grapes", "grape", "angoor", "angur"],
  angoor: ["grapes", "grape", "angoor", "angur"],
  angur: ["grapes", "grape", "angoor", "angur"],

  watermelon: ["watermelon", "watermelons", "tarbooz", "tarbuj"],
  watermelons: ["watermelon", "watermelons", "tarbooz", "tarbuj"],
  tarbooz: ["watermelon", "watermelons", "tarbooz", "tarbuj"],
  tarbuj: ["watermelon", "watermelons", "tarbooz", "tarbuj"],

  papaya: ["papaya", "papayas", "papita", "papite"],
  papayas: ["papaya", "papayas", "papita", "papite"],
  papita: ["papaya", "papayas", "papita", "papite"],
  papite: ["papaya", "papayas", "papita", "papite"],

  pomegranate: ["pomegranate", "pomegranates", "anar", "anaar"],
  pomegranates: ["pomegranate", "pomegranates", "anar", "anaar"],
  anar: ["pomegranate", "pomegranates", "anar", "anaar"],
  anaar: ["pomegranate", "pomegranates", "anar", "anaar"],

  guava: ["guava", "guavas", "amrood", "amrud"],
  guavas: ["guava", "guavas", "amrood", "amrud"],
  amrood: ["guava", "guavas", "amrood", "amrud"],
  amrud: ["guava", "guavas", "amrood", "amrud"],

  pineapple: ["pineapple", "pineapples", "ananas"],
  pineapples: ["pineapple", "pineapples", "ananas"],
  ananas: ["pineapple", "pineapples", "ananas"],

  coconut: ["coconut", "coconuts", "nariyal", "nariyal"],
  coconuts: ["coconut", "coconuts", "nariyal"],
  nariyal: ["coconut", "coconuts", "nariyal"],

  lemon: ["lemon", "lemons", "nimbu", "neembu", "limbu"],
  lemons: ["lemon", "lemons", "nimbu", "neembu", "limbu"],
  nimbu: ["lemon", "lemons", "nimbu", "neembu", "limbu"],
  neembu: ["lemon", "lemons", "nimbu", "neembu", "limbu"],
  limbu: ["lemon", "lemons", "nimbu", "neembu", "limbu"],

  strawberry: ["strawberry", "strawberries", "strawberry fruit"],
  strawberries: ["strawberry", "strawberries", "strawberry fruit"],

  kiwi: ["kiwi", "kiwis", "kiwifruit"],
  kiwis: ["kiwi", "kiwis", "kiwifruit"],

  peach: ["peach", "peaches", "aadu", "adu"],
  peaches: ["peach", "peaches", "aadu", "adu"],
  aadu: ["peach", "peaches", "aadu", "adu"],
  adu: ["peach", "peaches", "aadu", "adu"],

  pear: ["pear", "pears", "nashpati", "naspati"],
  pears: ["pear", "pears", "nashpati", "nas-pati"],
  nashpati: ["pear", "pears", "nashpati", "nas-pati"],
  naspati: ["pear", "pears", "nashpati"],

  cherry: ["cherry", "cherries", "cherry fruit"],
  cherries: ["cherry", "cherries", "cherry fruit"],

  plum: ["plum", "plums", "aloo bukhara", "alubukhara"],
  plums: ["plum", "plums", "aloo bukhara", "alubukhara"],
  "aloo bukhara": ["plum", "plums", "aloo bukhara"],
  alubukhara: ["plum", "plums", "aloo bukhara"],

  apricot: ["apricot", "apricots", "khubani", "khumani"],
  apricots: ["apricot", "apricots", "khubani", "khumani"],
  khubani: ["apricot", "apricots", "khubani", "khumani"],
  khumani: ["apricot", "apricots", "khubani", "khumani"],

  melon: ["melon", "melons", "kharbooja", "kharbuja"],
  muskmelon: ["muskmelon", "melon", "kharbooja", "kharbuja"],
  kharbooja: ["muskmelon", "melon", "kharbooja", "kharbuja"],
  kharbuja: ["muskmelon", "melon", "kharbooja", "kharbuja"],

  litchi: ["litchi", "lychee", "lichi"],
  lychee: ["litchi", "lychee", "lichi"],
  lichi: ["litchi", "lychee", "lichi"],

  jamun: ["jamun", "black plum", "java plum"],
  "black plum": ["jamun", "black plum", "java plum"],

  fig: ["fig", "figs", "anjeer", "anjir"],
  figs: ["fig", "figs", "anjeer", "anjir"],
  anjeer: ["fig", "figs", "anjeer", "anjir"],
  anjir: ["fig", "figs", "anjeer", "anjir"],

  dates: ["dates", "date fruit", "khajoor", "khajur"],
  date: ["dates", "date fruit", "khajoor", "khajur"],
  khajoor: ["dates", "date fruit", "khajoor", "khajur"],
  khajur: ["dates", "date fruit", "khajoor", "khajur"],

  // =====================================================
  // 🥔 VEGETABLES
  // =====================================================

  potato: ["potato", "potatoes", "alu", "aloo", "batata"],
  potatoes: ["potato", "potatoes", "alu", "aloo", "batata"],
  alu: ["potato", "potatoes", "alu", "aloo", "batata"],
  aloo: ["potato", "potatoes", "alu", "aloo", "batata"],
  batata: ["potato", "potatoes", "alu", "aloo", "batata"],

  onion: ["onion", "onions", "pyaz", "pyaaz", "kanda"],
  onions: ["onion", "onions", "pyaz", "pyaaz", "kanda"],
  pyaz: ["onion", "onions", "pyaz", "pyaaz", "kanda"],
  pyaaz: ["onion", "onions", "pyaz", "pyaaz", "kanda"],
  kanda: ["onion", "onions", "pyaz", "pyaaz", "kanda"],

  tomato: ["tomato", "tomatoes", "tamatar", "tamaatar"],
  tomatoes: ["tomato", "tomatoes", "tamatar", "tamaatar"],
  tamatar: ["tomato", "tomatoes", "tamatar", "tamaatar"],
  tamaatar: ["tomato", "tomatoes", "tamatar", "tamaatar"],

  carrot: ["carrot", "carrots", "gajar", "gazar"],
  carrots: ["carrot", "carrots", "gajar", "gazar"],
  gajar: ["carrot", "carrots", "gajar", "gazar"],
  gazar: ["carrot", "carrots", "gajar", "gazar"],

  radish: ["radish", "radishes", "mooli", "muli"],
  radishes: ["radish", "radishes", "mooli", "muli"],
  mooli: ["radish", "radishes", "mooli", "muli"],
  muli: ["radish", "radishes", "mooli", "muli"],

  spinach: ["spinach", "palak"],
  palak: ["spinach", "palak"],

  cabbage: [
    "cabbage",
    "cabbages",
    "patta gobhi",
    "patta gobi",
    "band gobhi",
    "band gobi",
  ],
  cabbages: [
    "cabbage",
    "cabbages",
    "patta gobhi",
    "patta gobi",
    "band gobhi",
    "band gobi",
  ],
  "patta gobhi": ["cabbage", "cabbages", "patta gobhi", "band gobhi"],
  "patta gobi": ["cabbage", "cabbages", "patta gobhi", "band gobhi"],
  "band gobhi": ["cabbage", "cabbages", "patta gobhi"],

  cauliflower: [
    "cauliflower",
    "cauliflowers",
    "gobhi",
    "gobi",
    "phool gobhi",
    "phoolgobhi",
  ],
  cauliflowers: ["cauliflower", "gobhi", "gobi", "phool gobhi"],
  gobhi: ["cauliflower", "cauliflowers", "gobhi", "gobi", "phool gobhi"],
  gobi: ["cauliflower", "cauliflowers", "gobhi", "gobi", "phool gobhi"],
  "phool gobhi": ["cauliflower", "cauliflowers", "gobhi", "gobi"],
  phoolgobhi: ["cauliflower", "cauliflowers", "gobhi", "gobi"],

  brinjal: ["brinjal", "eggplant", "eggplants", "baingan", "begun"],
  eggplant: ["brinjal", "eggplant", "eggplants", "baingan"],
  eggplants: ["brinjal", "eggplant", "eggplants", "baingan"],
  baingan: ["brinjal", "eggplant", "eggplants", "baingan"],
  begun: ["brinjal", "eggplant", "eggplants", "baingan"],

  okra: ["okra", "bhindi", "lady finger", "ladies finger"],
  bhindi: ["okra", "bhindi", "lady finger", "ladies finger"],
  "lady finger": ["okra", "bhindi", "lady finger", "ladies finger"],
  "ladies finger": ["okra", "bhindi", "lady finger"],

  peas: ["peas", "pea", "green peas", "matar", "mattar"],
  pea: ["peas", "green peas", "matar", "mattar"],
  "green peas": ["peas", "pea", "matar", "mattar"],
  matar: ["peas", "pea", "green peas", "mattar"],
  mattar: ["peas", "pea", "green peas", "matar"],

  capsicum: ["capsicum", "bell pepper", "bell peppers", "shimla mirch"],
  "bell pepper": ["capsicum", "bell pepper", "bell peppers", "shimla mirch"],
  "bell peppers": ["capsicum", "bell pepper", "shimla mirch"],
  "shimla mirch": ["capsicum", "bell pepper", "bell peppers"],

  chilli: [
    "chilli",
    "chili",
    "green chilli",
    "green chili",
    "hari mirch",
    "mirchi",
  ],
  chili: [
    "chilli",
    "chili",
    "green chilli",
    "green chili",
    "hari mirch",
    "mirchi",
  ],
  "green chilli": ["chilli", "chili", "green chili", "hari mirch", "mirchi"],
  "green chili": ["chilli", "chili", "green chilli", "hari mirch", "mirchi"],
  "hari mirch": ["chilli", "chili", "green chilli", "green chili", "mirchi"],
  mirchi: ["chilli", "chili", "green chilli", "green chili", "hari mirch"],

  cucumber: ["cucumber", "cucumbers", "kheera", "khira", "kakdi"],
  cucumbers: ["cucumber", "kheera", "khira", "kakdi"],
  kheera: ["cucumber", "cucumbers", "kheera", "khira", "kakdi"],
  khira: ["cucumber", "cucumbers", "kheera", "kakdi"],
  kakdi: ["cucumber", "cucumbers", "kheera", "khira"],

  garlic: ["garlic", "lahsun", "lehsun", "lasun"],
  lahsun: ["garlic", "lahsun", "lehsun", "lasun"],
  lehsun: ["garlic", "lahsun", "lehsun", "lasun"],
  lasun: ["garlic", "lahsun", "lehsun"],

  ginger: ["ginger", "adrak", "adarak"],
  adrak: ["ginger", "adrak", "adarak"],
  adarak: ["ginger", "adrak", "adarak"],

  pumpkin: ["pumpkin", "kaddu", "kadu"],
  kaddu: ["pumpkin", "kaddu", "kadu"],
  kadu: ["pumpkin", "kaddu", "kadu"],

  bottle_gourd: ["bottle gourd", "lauki", "ghiya", "dudhi"],
  "bottle gourd": ["bottle gourd", "lauki", "ghiya", "dudhi"],
  lauki: ["bottle gourd", "lauki", "ghiya", "dudhi"],
  ghiya: ["bottle gourd", "lauki", "dudhi"],
  dudhi: ["bottle gourd", "lauki", "ghiya"],

  bitter_gourd: ["bitter gourd", "bitter melon", "karela"],
  "bitter gourd": ["bitter gourd", "bitter melon", "karela"],
  karela: ["bitter gourd", "bitter melon", "karela"],

  ridge_gourd: ["ridge gourd", "tori", "turai", "torai"],
  "ridge gourd": ["ridge gourd", "tori", "turai", "torai"],
  tori: ["ridge gourd", "tori", "turai", "torai"],
  turai: ["ridge gourd", "tori", "torai"],
  torai: ["ridge gourd", "tori", "turai"],

  beetroot: ["beetroot", "beet", "chukandar"],
  beet: ["beetroot", "beet", "chukandar"],
  chukandar: ["beetroot", "beet", "chukandar"],

  turnip: ["turnip", "shalgam", "shaljam"],
  shalgam: ["turnip", "shalgam", "shaljam"],
  shaljam: ["turnip", "shalgam", "shalgam"],

  sweet_potato: ["sweet potato", "sweet potatoes", "shakarkand", "shakarkandi"],
  "sweet potato": [
    "sweet potato",
    "sweet potatoes",
    "shakarkand",
    "shakarkandi",
  ],
  shakarkand: ["sweet potato", "sweet potatoes", "shakarkand", "shakarkandi"],
  shakarkandi: ["sweet potato", "sweet potatoes", "shakarkand"],

  arbi: ["arbi", "taro", "colocasia"],
  taro: ["arbi", "taro", "colocasia"],

  // =====================================================
  // 🥬 COMMON GREENS
  // =====================================================

  lettuce: ["lettuce", "salad leaves"],
  methi: ["fenugreek leaves", "fenugreek", "methi"],
  fenugreek: ["fenugreek", "methi"],
  coriander: ["coriander", "coriander leaves", "dhaniya", "dhania"],
  dhaniya: ["coriander", "coriander leaves", "dhaniya", "dhania"],
  dhania: ["coriander", "coriander leaves", "dhaniya"],
  mint: ["mint", "pudina"],
  pudina: ["mint", "pudina"],

  // =====================================================
  // 🥛 DAIRY
  // =====================================================

  milk: ["milk", "doodh", "dudh"],
  doodh: ["milk", "doodh", "dudh"],
  dudh: ["milk", "doodh", "dudh"],

  curd: ["curd", "dahi", "yogurt", "yoghurt"],
  dahi: ["curd", "dahi", "yogurt", "yoghurt"],
  yogurt: ["curd", "dahi", "yogurt", "yoghurt"],
  yoghurt: ["curd", "dahi", "yogurt", "yoghurt"],

  paneer: ["paneer", "cottage cheese"],
  "cottage cheese": ["paneer", "cottage cheese"],

  cheese: ["cheese", "cheeses"],
  butter: ["butter", "makhan"],
  makhan: ["butter", "makhan"],

  ghee: ["ghee", "clarified butter"],

  cream: ["cream", "fresh cream"],

  // =====================================================
  // 🌾 GRAINS / FLOUR
  // =====================================================

  rice: ["rice", "chawal", "chaval"],
  chawal: ["rice", "chawal", "chaval"],
  chaval: ["rice", "chawal"],

  wheat: ["wheat", "gehun", "gehu"],
  gehun: ["wheat", "gehun", "gehu"],
  gehu: ["wheat", "gehun", "gehu"],

  flour: ["flour", "atta", "wheat flour"],
  atta: ["flour", "atta", "wheat flour"],
  "wheat flour": ["flour", "atta", "wheat flour"],

  maida: ["maida", "refined flour", "all purpose flour"],
  "refined flour": ["maida", "refined flour", "all purpose flour"],

  sooji: ["sooji", "suji", "semolina"],
  suji: ["sooji", "suji", "semolina"],
  semolina: ["sooji", "suji", "semolina"],

  besan: ["besan", "gram flour", "chickpea flour"],
  "gram flour": ["besan", "gram flour", "chickpea flour"],

  oats: ["oats", "oatmeal", "jai"],
  oatmeal: ["oats", "oatmeal"],

  // =====================================================
  // 🫘 DAL / PULSES
  // =====================================================

  dal: ["dal", "dhal", "lentils", "pulses"],
  dhal: ["dal", "dhal", "lentils", "pulses"],
  lentils: ["lentils", "dal", "dhal"],

  moong: ["moong dal", "green gram", "mung beans"],
  "moong dal": ["moong dal", "green gram", "mung beans"],

  masoor: ["masoor dal", "red lentils"],
  "masoor dal": ["masoor dal", "red lentils"],

  chana: ["chana", "chickpeas", "chickpea", "kabuli chana"],
  chickpeas: ["chana", "chickpeas", "chickpea"],
  chickpea: ["chana", "chickpeas", "chickpea"],

  rajma: ["rajma", "kidney beans", "kidney bean"],
  "kidney beans": ["rajma", "kidney beans", "kidney bean"],

  // =====================================================
  // 🧂 BASIC GROCERY
  // =====================================================

  salt: ["salt", "namak", "lavan"],
  namak: ["salt", "namak", "lavan"],

  sugar: ["sugar", "chini", "cheeni", "shakkar"],
  chini: ["sugar", "chini", "cheeni", "shakkar"],
  cheeni: ["sugar", "chini", "cheeni", "shakkar"],
  shakkar: ["sugar", "chini", "cheeni", "shakkar"],

  jaggery: ["jaggery", "gur", "gud"],
  gur: ["jaggery", "gur", "gud"],
  gud: ["jaggery", "gur", "gud"],

  oil: ["oil", "cooking oil", "tel"],
  "cooking oil": ["oil", "cooking oil", "tel"],
  tel: ["oil", "cooking oil", "tel"],

  mustard_oil: ["mustard oil", "sarso oil", "sarson oil"],
  "mustard oil": ["mustard oil", "sarso oil", "sarson oil"],

  honey: ["honey", "shahad", "madhu"],
  shahad: ["honey", "shahad", "madhu"],

  // =====================================================
  // ☕ TEA / COFFEE
  // =====================================================

  tea: ["tea", "chai", "chaay"],
  chai: ["tea", "chai", "chaay"],
  chaay: ["tea", "chai", "chaay"],

  coffee: ["coffee", "cofee"],

  // =====================================================
  // 🍪 SNACKS
  // =====================================================

  biscuit: ["biscuit", "biscuits", "cookie", "cookies"],
  biscuits: ["biscuit", "biscuits", "cookie", "cookies"],
  cookie: ["biscuit", "biscuits", "cookie", "cookies"],
  cookies: ["biscuit", "biscuits", "cookie", "cookies"],

  chips: ["chips", "potato chips", "namkeen"],
  namkeen: ["namkeen", "snacks", "chips"],

  // =====================================================
  // 🍝 PACKAGED FOOD
  // =====================================================

  noodles: ["noodles", "instant noodles"],
  pasta: ["pasta", "macaroni", "spaghetti"],
  macaroni: ["macaroni", "pasta"],
  spaghetti: ["spaghetti", "pasta"],

  sauce: ["sauce", "tomato sauce", "ketchup"],
  ketchup: ["ketchup", "tomato ketchup", "tomato sauce"],

  // =====================================================
  // 🥜 DRY FRUITS / NUTS
  // =====================================================

  almond: ["almond", "almonds", "badam"],
  almonds: ["almond", "almonds", "badam"],
  badam: ["almond", "almonds", "badam"],

  cashew: ["cashew", "cashews", "kaju"],
  cashews: ["cashew", "cashews", "kaju"],
  kaju: ["cashew", "cashews", "kaju"],

  raisin: ["raisin", "raisins", "kishmish"],
  raisins: ["raisin", "raisins", "kishmish"],
  kishmish: ["raisin", "raisins", "kishmish"],

  walnut: ["walnut", "walnuts", "akhrot"],
  walnuts: ["walnut", "walnuts", "akhrot"],
  akhrot: ["walnut", "walnuts", "akhrot"],

  pistachio: ["pistachio", "pistachios", "pista"],
  pistachios: ["pistachio", "pistachios", "pista"],
  pista: ["pistachio", "pistachios", "pista"],

  // =====================================================
  // 🥥 COMMON SEARCH CATEGORIES
  // =====================================================

  fruit: ["fruit", "fruits", "fresh fruit", "fresh fruits", "phal", "fal"],

  fruits: ["fruit", "fruits", "fresh fruit", "fresh fruits", "phal", "fal"],

  phal: ["fruit", "fruits", "fresh fruit", "fresh fruits"],

  fal: ["fruit", "fruits", "fresh fruit", "fresh fruits"],

  vegetable: [
    "vegetable",
    "vegetables",
    "fresh vegetable",
    "fresh vegetables",
    "sabzi",
    "sabji",
    "sabjiya",
  ],

  vegetables: [
    "vegetable",
    "vegetables",
    "fresh vegetable",
    "fresh vegetables",
    "sabzi",
    "sabji",
    "sabjiya",
  ],

  sabzi: ["vegetable", "vegetables", "fresh vegetables", "sabzi", "sabji"],

  sabji: ["vegetable", "vegetables", "fresh vegetables", "sabzi", "sabji"],

  grocery: ["grocery", "groceries", "grocery items", "kirana", "rashan"],

  groceries: ["grocery", "groceries", "grocery items", "kirana", "rashan"],

  kirana: ["grocery", "groceries", "grocery items", "kirana", "rashan"],

  rashan: ["grocery", "groceries", "grocery items", "kirana", "rashan"],

  // =====================================================
  // 🌱 FRESH / FARM SEARCH
  // =====================================================

  fresh: ["fresh", "fresh fruits", "fresh vegetables", "farm fresh"],

  farming: ["farming", "farm", "agriculture", "fresh"],

  farm: ["farm", "farm fresh", "fresh", "agriculture"],

  organic: ["organic", "organic food", "organic vegetables", "organic fruits"],

  healthy: ["healthy", "healthy food", "fresh food", "organic"],

  food: ["food", "fresh food", "healthy food", "groceries"],
};

export default searchAliases;
