// seedNewMonuments.js
//
// Adds the 28 monuments that were only in the hardcoded NearbySites.jsx
// ALL_MONUMENTS array into MongoDB, so they show up everywhere /api/heritage
// and /api/nearby are used (Discover tab, Nearby tab, etc).
//
// USAGE:
//   1. Place this file in your backend project (same level as server.js / where you import models from)
//   2. Adjust the import path below to point to your actual Heritage model
//   3. Make sure your .env has MONGO_URI (or MONGODB_URI) set
//   4. Run:  node seedNewMonuments.js
//
// Safe to re-run: it checks existing slugs before inserting, so it will
// never create duplicates.

import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Heritage from "./models/Heritage.js"; // 👈 adjust this path if needed

dotenv.config();

// Fix for Windows "querySrv ECONNREFUSED" errors when resolving
// mongodb+srv:// SRV records — force Node to use Google/Cloudflare DNS
// instead of the OS default resolver.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

// type map: lowercase (old jsx) -> schema enum (capitalized)
const typeMap = {
  architectural: "Architectural",
  archaeological: "Archaeological",
  religious: "Religious",
  natural: "Natural",
  intangible: "Intangible",
};

const newMonuments = [
  {
    name: "Hampi Ruins",
    state: "Karnataka",
    district: "Hampi",
    coordinates: [76.46, 15.335],
    type: "archaeological",
    era: "14th–16th Century CE",
    unesco: true,
    unescoYear: 1986,
    tags: ["ruins", "vijayanagara", "empire", "unesco"],
    description:
      "A vast complex of ruined temples, palaces, and market streets that once formed the capital of the Vijayanagara Empire, one of the richest cities in the medieval world.",
    shortDesc: "Sprawling ruins of a once-glorious medieval empire capital.",
    highlights: [
      "Capital of Vijayanagara Empire",
      "UNESCO World Heritage Site",
      "Iconic Stone Chariot",
      "Dramatic boulder landscape",
    ],
    visitingHours: "6:00 AM – 6:00 PM",
    entryFee: "₹40 (Indian), ₹600 (Foreign)",
    bestSeason: "October – February",
  },
  {
    name: "Konark Sun Temple",
    state: "Odisha",
    district: "Konark",
    coordinates: [86.0946, 19.8876],
    type: "religious",
    era: "13th Century CE",
    unesco: true,
    unescoYear: 1984,
    tags: ["temple", "sun-god", "chariot", "unesco"],
    description:
      "A 13th-century temple built in the form of a colossal stone chariot dedicated to the Sun God, with intricately carved wheels and horses.",
    shortDesc: "Ancient temple shaped like a giant chariot of the Sun God.",
    highlights: [
      "Shaped like a giant stone chariot",
      "24 intricately carved stone wheels",
      "UNESCO World Heritage 1984",
      "Masterpiece of Kalinga architecture",
    ],
    visitingHours: "6:00 AM – 8:00 PM",
    entryFee: "₹40 (Indian), ₹600 (Foreign)",
    bestSeason: "October – February",
  },
  {
    name: "Fatehpur Sikri",
    state: "Uttar Pradesh",
    district: "Agra",
    coordinates: [77.661, 27.0945],
    type: "architectural",
    era: "16th Century CE",
    dynasty: "Mughal",
    unesco: true,
    unescoYear: 1986,
    tags: ["mughal", "akbar", "ghost-city", "unesco"],
    description:
      "A once-thriving Mughal capital built by Emperor Akbar in the 1570s, abandoned within 15 years due to water shortage, now preserved as a remarkably intact red sandstone city.",
    shortDesc: "Akbar's abandoned red-sandstone capital, frozen in time.",
    highlights: [
      "Built by Akbar in 1571",
      "Abandoned after 15 years",
      "Buland Darwaza — one of the tallest gateways",
      "UNESCO World Heritage 1986",
    ],
    visitingHours: "Sunrise to Sunset",
    entryFee: "₹35 (Indian), ₹550 (Foreign)",
    bestSeason: "October – March",
  },
  {
    name: "Khajuraho Temples",
    state: "Madhya Pradesh",
    district: "Khajuraho",
    coordinates: [79.9199, 24.8318],
    type: "religious",
    era: "10th–11th Century CE",
    unesco: true,
    unescoYear: 1986,
    tags: ["temple", "sculpture", "chandela", "unesco"],
    description:
      "A group of Hindu and Jain temples famous for their intricate nagara-style sculptures and carvings, built by the Chandela dynasty.",
    shortDesc: "Medieval temple group famed for exquisite stone carvings.",
    highlights: [
      "Built by the Chandela dynasty",
      "Renowned nagara-style architecture",
      "UNESCO World Heritage 1986",
      "One of India's most visited temple sites",
    ],
    visitingHours: "Sunrise to Sunset",
    entryFee: "₹40 (Indian), ₹600 (Foreign)",
    bestSeason: "October – March",
  },
  {
    name: "Mahabalipuram",
    state: "Tamil Nadu",
    district: "Chengalpattu",
    coordinates: [80.1927, 12.6269],
    type: "archaeological",
    era: "7th–8th Century CE",
    unesco: true,
    unescoYear: 1984,
    tags: ["rock-cut", "pallava", "shore-temple", "unesco"],
    description:
      "A collection of rock-cut temples and monuments carved by the Pallava dynasty along the Coromandel Coast, including the famous Shore Temple.",
    shortDesc: "Ancient Pallava rock-cut monuments overlooking the sea.",
    highlights: [
      "Shore Temple on the Bay of Bengal",
      "Pallava dynasty rock art",
      "Arjuna's Penance rock relief",
      "UNESCO World Heritage 1984",
    ],
    visitingHours: "6:00 AM – 6:00 PM",
    entryFee: "₹40 (Indian), ₹600 (Foreign)",
    bestSeason: "November – February",
  },
  {
    name: "Humayun's Tomb",
    state: "Delhi",
    district: "Central Delhi",
    coordinates: [77.2507, 28.5933],
    type: "architectural",
    era: "16th Century CE",
    dynasty: "Mughal",
    unesco: true,
    unescoYear: 1993,
    tags: ["mughal", "tomb", "garden", "unesco"],
    description:
      "The tomb of Mughal Emperor Humayun, commissioned by his widow in 1569–70. Its garden-tomb design directly inspired the Taj Mahal.",
    shortDesc: "Mughal garden-tomb that inspired the design of the Taj Mahal.",
    highlights: [
      "Built in 1569–70",
      "First garden-tomb in India",
      "Inspired the Taj Mahal",
      "UNESCO World Heritage 1993",
    ],
    visitingHours: "6:00 AM – 6:00 PM",
    entryFee: "₹30 (Indian), ₹500 (Foreign)",
    bestSeason: "October – March",
  },
  {
    name: "Golden Temple",
    state: "Punjab",
    district: "Amritsar",
    coordinates: [74.8765, 31.62],
    type: "religious",
    era: "16th Century CE",
    tags: ["sikh", "gurdwara", "golden", "sacred"],
    unesco: false,
    description:
      "The holiest Gurdwara of Sikhism, its upper floors covered in gold, set amid the sacred Amrit Sarovar pool. Famous for its free community kitchen (langar) serving thousands daily.",
    shortDesc: "Sikhism's holiest shrine, gleaming in gold above a sacred pool.",
    highlights: [
      "Gold-plated upper structure",
      "World's largest free community kitchen",
      "Amrit Sarovar sacred pool",
      "Open to all faiths, 24 hours",
    ],
    visitingHours: "Open 24 hours",
    entryFee: "Free",
    bestSeason: "October – March",
  },
  {
    name: "Charminar",
    state: "Telangana",
    district: "Hyderabad",
    coordinates: [78.4747, 17.3616],
    type: "architectural",
    era: "16th Century CE",
    tags: ["mosque", "minaret", "hyderabad", "landmark"],
    unesco: false,
    description:
      "A monument and mosque built in 1591 by Sultan Muhammad Quli Qutb Shah, marking the centre of the old city of Hyderabad with four grand arches and minarets.",
    shortDesc: "Iconic four-minaret monument at the heart of old Hyderabad.",
    highlights: [
      "Built in 1591",
      "Four 56-metre tall minarets",
      "Surrounded by the historic Laad Bazaar",
      "Symbol of Hyderabad",
    ],
    visitingHours: "9:00 AM – 5:30 PM",
    entryFee: "₹25 (Indian), ₹300 (Foreign)",
    bestSeason: "October – February",
  },
  {
    name: "Victoria Memorial",
    state: "West Bengal",
    district: "Kolkata",
    coordinates: [88.3426, 22.5448],
    type: "architectural",
    era: "20th Century CE",
    tags: ["colonial", "marble", "museum", "kolkata"],
    unesco: false,
    description:
      "A grand white marble building built in memory of Queen Victoria, now a museum housing an extensive collection of colonial-era artifacts and art.",
    shortDesc: "Marble colonial memorial and museum in the heart of Kolkata.",
    highlights: [
      "Built in memory of Queen Victoria",
      "Large museum and art gallery",
      "Set in sprawling gardens",
      "Iconic Kolkata landmark",
    ],
    visitingHours: "10:00 AM – 5:00 PM (Closed Mondays)",
    entryFee: "₹30 (Indian), ₹500 (Foreign)",
    bestSeason: "November – February",
  },
  {
    name: "Jaisalmer Fort",
    state: "Rajasthan",
    district: "Jaisalmer",
    coordinates: [70.9129, 26.9124],
    type: "architectural",
    era: "12th Century CE",
    tags: ["fort", "living-fort", "desert", "sandstone"],
    unesco: true,
    unescoYear: 2013,
    description:
      "A 'living fort' rising from the Thar Desert, still home to a quarter of the city's population, with intricately carved havelis and golden sandstone walls.",
    shortDesc: "Golden desert fort that's still a living, inhabited city.",
    highlights: [
      "Rare 'living fort' with residents inside",
      "Golden sandstone architecture",
      "UNESCO World Heritage 2013",
      "Set in the Thar Desert",
    ],
    visitingHours: "8:00 AM – 6:00 PM",
    entryFee: "₹50 (Indian), ₹250 (Foreign)",
    bestSeason: "October – March",
  },
  {
    name: "City Palace, Udaipur",
    state: "Rajasthan",
    district: "Udaipur",
    coordinates: [73.6833, 24.5764],
    type: "architectural",
    era: "16th Century CE",
    tags: ["palace", "mewar", "lake-view", "museum"],
    unesco: false,
    description:
      "A sprawling palace complex overlooking Lake Pichola, built over nearly 400 years by successive Mewar rulers, blending Rajasthani and Mughal styles.",
    shortDesc: "Grand lakeside palace complex of the Mewar dynasty.",
    highlights: [
      "Overlooks Lake Pichola",
      "Built over ~400 years",
      "Largest palace complex in Rajasthan",
      "Museum of Mewar royal heritage",
    ],
    visitingHours: "9:30 AM – 5:30 PM",
    entryFee: "₹300 (Indian), ₹700 (Foreign)",
    bestSeason: "September – March",
  },
  {
    name: "Sun Temple, Modhera",
    state: "Gujarat",
    district: "Mehsana",
    coordinates: [72.1327, 23.5809],
    type: "religious",
    era: "11th Century CE",
    tags: ["temple", "sun-god", "solanki", "stepwell"],
    unesco: false,
    description:
      "An 11th-century temple dedicated to the Sun God, built by the Solanki dynasty, with a stepped water tank (Surya Kund) and intricately carved pillars.",
    shortDesc: "Solanki-era sun temple with a striking stepped water tank.",
    highlights: [
      "Built by the Solanki dynasty",
      "Surya Kund stepped tank",
      "Aligned to catch the equinox sunrise",
      "Intricate stone carvings",
    ],
    visitingHours: "8:00 AM – 6:00 PM",
    entryFee: "₹25 (Indian), ₹300 (Foreign)",
    bestSeason: "October – February",
  },
  {
    name: "Rani ki Vav",
    state: "Gujarat",
    district: "Patan",
    coordinates: [72.101, 23.8595],
    type: "archaeological",
    era: "11th Century CE",
    tags: ["stepwell", "unesco", "carving", "queen"],
    unesco: true,
    unescoYear: 2014,
    description:
      "An elaborately constructed stepwell built as a memorial to a king, considered one of the finest and best-preserved examples of Gujarat's step-well architecture.",
    shortDesc: "India's most ornate stepwell, carved seven storeys deep.",
    highlights: [
      "Seven-storey inverted temple design",
      "Over 500 principal sculptures",
      "UNESCO World Heritage 2014",
      "Featured on the ₹100 currency note",
    ],
    visitingHours: "8:00 AM – 6:00 PM",
    entryFee: "₹25 (Indian), ₹300 (Foreign)",
    bestSeason: "October – February",
  },
  {
    name: "Elephanta Caves",
    state: "Maharashtra",
    district: "Mumbai",
    coordinates: [72.9315, 18.9633],
    type: "religious",
    era: "5th–8th Century CE",
    tags: ["caves", "shiva", "rock-cut", "unesco", "island"],
    unesco: true,
    unescoYear: 1987,
    description:
      "Rock-cut cave temples on an island near Mumbai, dedicated to Lord Shiva, famous for the monumental Trimurti sculpture depicting his three aspects.",
    shortDesc: "Island cave temples famous for the massive Shiva Trimurti.",
    highlights: [
      "Reached by boat from Mumbai",
      "Iconic Trimurti Shiva sculpture",
      "UNESCO World Heritage 1987",
      "Ancient rock-cut cave architecture",
    ],
    visitingHours: "9:00 AM – 5:30 PM (Closed Mondays)",
    entryFee: "₹40 (Indian), ₹600 (Foreign)",
    bestSeason: "November – February",
  },
  {
    name: "Brihadeeswarar Temple",
    state: "Tamil Nadu",
    district: "Thanjavur",
    coordinates: [79.1318, 10.7828],
    type: "religious",
    era: "11th Century CE",
    tags: ["temple", "chola", "shiva", "unesco"],
    unesco: true,
    unescoYear: 1987,
    description:
      "A magnificent Shiva temple built by the Chola king Rajaraja I, crowned by a 66-metre vimana tower carved from a single block of granite.",
    shortDesc: "Towering Chola-era temple with a giant granite dome.",
    highlights: [
      "Built by Rajaraja Chola I",
      "66-metre granite vimana tower",
      "UNESCO World Heritage 1987",
      "Masterpiece of Dravidian architecture",
    ],
    visitingHours: "6:00 AM – 12:30 PM, 4:00 PM – 8:30 PM",
    entryFee: "Free",
    bestSeason: "November – February",
  },
  {
    name: "Chittorgarh Fort",
    state: "Rajasthan",
    district: "Chittorgarh",
    coordinates: [74.6455, 24.8887],
    type: "architectural",
    era: "7th Century CE",
    tags: ["fort", "rajput", "largest-fort", "unesco"],
    unesco: true,
    unescoYear: 2013,
    description:
      "One of the largest forts in India, spread over 700 acres, steeped in tales of Rajput valour, sacrifice, and the legendary queen Padmini.",
    shortDesc: "India's largest fort, steeped in Rajput legend and valour.",
    highlights: [
      "One of India's largest forts",
      "Legend of Rani Padmini",
      "Vijay Stambh (Tower of Victory)",
      "UNESCO World Heritage 2013",
    ],
    visitingHours: "9:45 AM – 6:00 PM",
    entryFee: "₹40 (Indian), ₹600 (Foreign)",
    bestSeason: "October – March",
  },
  {
    name: "Golconda Fort",
    state: "Telangana",
    district: "Hyderabad",
    coordinates: [78.4011, 17.3833],
    type: "architectural",
    era: "13th Century CE",
    tags: ["fort", "qutb-shahi", "diamonds", "acoustics"],
    unesco: false,
    description:
      "A massive granite fort once famed as a global centre of diamond trade, known for its remarkable acoustic system and sound-and-light show.",
    shortDesc: "Historic diamond-trade fortress famed for its acoustics.",
    highlights: [
      "Former global diamond trading hub",
      "Ingenious acoustic clap system",
      "Evening sound-and-light show",
      "Qutb Shahi dynasty stronghold",
    ],
    visitingHours: "9:00 AM – 5:30 PM",
    entryFee: "₹25 (Indian), ₹300 (Foreign)",
    bestSeason: "October – February",
  },
  {
    name: "Lotus Temple",
    state: "Delhi",
    district: "South Delhi",
    coordinates: [77.2588, 28.5535],
    type: "religious",
    era: "20th Century CE",
    tags: ["bahai", "modern", "lotus-shape", "landmark"],
    unesco: false,
    description:
      "A Bahá'í House of Worship shaped like a blooming lotus flower, made of white marble, open to people of all religions for prayer and meditation.",
    shortDesc: "Lotus-shaped Bahá'í temple open to all faiths.",
    highlights: [
      "27 free-standing marble petals",
      "Completed in 1986",
      "Open to all religions",
      "One of the most visited buildings in the world",
    ],
    visitingHours: "9:00 AM – 5:30 PM (Closed Mondays)",
    entryFee: "Free",
    bestSeason: "October – March",
  },
  {
    name: "India Gate",
    state: "Delhi",
    district: "Central Delhi",
    coordinates: [77.2295, 28.6129],
    type: "architectural",
    era: "20th Century CE",
    tags: ["war-memorial", "colonial", "landmark", "delhi"],
    unesco: false,
    description:
      "A 42-metre war memorial arch built to honour Indian soldiers who died in World War I, now a beloved public space in the heart of Delhi.",
    shortDesc: "Delhi's iconic war memorial arch and public gathering space.",
    highlights: [
      "Honours 70,000+ WWI soldiers",
      "42 metres tall",
      "Amar Jawan Jyoti eternal flame nearby",
      "Popular evening gathering spot",
    ],
    visitingHours: "Open 24 hours",
    entryFee: "Free",
    bestSeason: "October – March",
  },
  {
    name: "Jama Masjid",
    state: "Delhi",
    district: "Central Delhi",
    coordinates: [77.2334, 28.6507],
    type: "religious",
    era: "17th Century CE",
    dynasty: "Mughal",
    tags: ["mosque", "mughal", "shahjahan", "largest-mosque"],
    unesco: false,
    description:
      "One of India's largest mosques, built by Shah Jahan between 1650 and 1656, capable of holding over 25,000 worshippers in its vast courtyard.",
    shortDesc: "One of India's largest mosques, built by Shah Jahan.",
    highlights: [
      "Built between 1650–1656",
      "Courtyard holds 25,000+ worshippers",
      "Red sandstone and white marble",
      "Panoramic views from the minaret",
    ],
    visitingHours: "7:00 AM – 12:00 PM, 1:30 PM – 6:30 PM",
    entryFee: "Free (camera fee applicable)",
    bestSeason: "October – March",
  },
  {
    name: "Ranakpur Jain Temple",
    state: "Rajasthan",
    district: "Pali",
    coordinates: [73.4884, 25.116],
    type: "religious",
    era: "15th Century CE",
    tags: ["temple", "jain", "marble", "pillars"],
    unesco: false,
    description:
      "A stunning marble Jain temple complex featuring over 1,400 intricately carved pillars, no two of which are exactly alike.",
    shortDesc: "Marble Jain temple famed for 1,400+ unique carved pillars.",
    highlights: [
      "1,444 uniquely carved marble pillars",
      "Dedicated to Tirthankara Adinatha",
      "Built in the 15th century",
      "Set in the Aravalli hills",
    ],
    visitingHours: "12:00 PM – 5:00 PM (non-Jains)",
    entryFee: "₹200 (camera fee included)",
    bestSeason: "October – March",
  },
  {
    name: "Somnath Temple",
    state: "Gujarat",
    district: "Gir Somnath",
    coordinates: [70.4013, 20.888],
    type: "religious",
    era: "Ancient (rebuilt 1951)",
    tags: ["temple", "shiva", "jyotirlinga", "coastal"],
    unesco: false,
    description:
      "The first among the twelve Jyotirlinga shrines of Shiva, repeatedly destroyed and rebuilt through history, standing today on the Arabian Sea coast.",
    shortDesc: "First Jyotirlinga shrine, rebuilt on the Arabian Sea coast.",
    highlights: [
      "First of the 12 Jyotirlingas",
      "Rebuilt multiple times through history",
      "Current structure completed in 1951",
      "Located on the Arabian Sea",
    ],
    visitingHours: "6:00 AM – 9:00 PM",
    entryFee: "Free",
    bestSeason: "October – March",
  },
  {
    name: "Dwarkadhish Temple",
    state: "Gujarat",
    district: "Dwarka",
    coordinates: [68.9678, 22.2394],
    type: "religious",
    era: "Ancient (rebuilt 16th CE)",
    tags: ["temple", "krishna", "char-dham", "sacred"],
    unesco: false,
    description:
      "A major Hindu temple dedicated to Lord Krishna, one of the Char Dham pilgrimage sites, believed to stand on the site of Krishna's ancient kingdom.",
    shortDesc: "Sacred Krishna temple and one of Hinduism's Char Dham sites.",
    highlights: [
      "One of the four Char Dham sites",
      "Dedicated to Lord Krishna",
      "5-storey structure on 72 pillars",
      "Ancient pilgrimage centre",
    ],
    visitingHours: "6:30 AM – 1:00 PM, 5:00 PM – 9:30 PM",
    entryFee: "Free",
    bestSeason: "October – March",
  },
  {
    name: "Nalanda Ruins",
    state: "Bihar",
    district: "Nalanda",
    coordinates: [85.4437, 25.136],
    type: "archaeological",
    era: "5th Century CE",
    tags: ["university", "buddhist", "ruins", "unesco"],
    unesco: true,
    unescoYear: 2016,
    description:
      "The ruins of an ancient centre of learning, one of the world's first residential universities, once home to thousands of scholars and monks.",
    shortDesc: "Ruins of one of the world's earliest great universities.",
    highlights: [
      "Ancient Buddhist university (5th–12th CE)",
      "Once housed thousands of scholars",
      "UNESCO World Heritage 2016",
      "Extensive brick monastery ruins",
    ],
    visitingHours: "9:00 AM – 5:00 PM (Closed Fridays)",
    entryFee: "₹25 (Indian), ₹300 (Foreign)",
    bestSeason: "October – March",
  },
  {
    name: "Mahabodhi Temple",
    state: "Bihar",
    district: "Bodh Gaya",
    coordinates: [84.9917, 24.6959],
    type: "religious",
    era: "3rd Century BCE",
    tags: ["buddhist", "enlightenment", "bodhi-tree", "unesco"],
    unesco: true,
    unescoYear: 2002,
    description:
      "The site where Buddha is believed to have attained enlightenment under the Bodhi Tree, marked by a soaring temple complex central to Buddhism worldwide.",
    shortDesc: "Site of Buddha's enlightenment beneath the sacred Bodhi Tree.",
    highlights: [
      "Site of Buddha's enlightenment",
      "Sacred Bodhi Tree",
      "UNESCO World Heritage 2002",
      "Major global Buddhist pilgrimage site",
    ],
    visitingHours: "5:00 AM – 9:00 PM",
    entryFee: "Free",
    bestSeason: "October – March",
  },
  {
    name: "Jantar Mantar",
    state: "Rajasthan",
    district: "Jaipur",
    coordinates: [75.8244, 26.9247],
    type: "architectural",
    era: "18th Century CE",
    tags: ["observatory", "astronomy", "unesco", "instruments"],
    unesco: true,
    unescoYear: 2010,
    description:
      "An 18th-century astronomical observatory built by Maharaja Jai Singh II, featuring the world's largest stone sundial and other masonry instruments.",
    shortDesc: "18th-century astronomical observatory with the world's largest sundial.",
    highlights: [
      "Built by Jai Singh II",
      "World's largest stone sundial",
      "19 masonry astronomical instruments",
      "UNESCO World Heritage 2010",
    ],
    visitingHours: "9:00 AM – 4:30 PM",
    entryFee: "₹50 (Indian), ₹200 (Foreign)",
    bestSeason: "October – March",
  },
  {
    name: "Hawa Mahal",
    state: "Rajasthan",
    district: "Jaipur",
    coordinates: [75.8267, 26.9239],
    type: "architectural",
    era: "18th Century CE",
    tags: ["palace", "pink-city", "honeycomb", "windows"],
    unesco: false,
    description:
      "A five-storey pink sandstone palace with 953 small windows (jharokhas), built so royal women could observe street life while remaining unseen.",
    shortDesc: "Iconic pink 'Palace of Winds' with 953 ornate windows.",
    highlights: [
      "953 intricately carved windows",
      "Built in 1799",
      "Honeycomb-like façade",
      "Symbol of Jaipur, the Pink City",
    ],
    visitingHours: "9:00 AM – 4:30 PM",
    entryFee: "₹50 (Indian), ₹200 (Foreign)",
    bestSeason: "October – March",
  },
  {
    name: "Vaishno Devi Temple",
    state: "Jammu & Kashmir",
    district: "Katra",
    coordinates: [74.9496, 33.0306],
    type: "religious",
    era: "Ancient",
    tags: ["temple", "pilgrimage", "cave-shrine", "mountain"],
    unesco: false,
    description:
      "One of the most revered Hindu pilgrimage sites, a cave shrine dedicated to the goddess Vaishno Devi, reached by a 12 km trek through the Trikuta hills.",
    shortDesc: "Revered cave shrine reached by a scenic Himalayan trek.",
    highlights: [
      "12 km pilgrimage trek",
      "One of India's most visited shrines",
      "Set in the Trikuta hills",
      "Millions of pilgrims annually",
    ],
    visitingHours: "Open 24 hours",
    entryFee: "Free (registration required)",
    bestSeason: "March – October",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Heritage.find({}, "slug").lean();
    const existingSlugs = new Set(existing.map((s) => s.slug));

    const docsToInsert = [];
    const skipped = [];

    for (const m of newMonuments) {
      const slug = slugify(m.name);

      if (existingSlugs.has(slug)) {
        skipped.push(m.name);
        continue;
      }

      docsToInsert.push({
        name: m.name,
        slug,
        state: m.state,
        district: m.district,
        location: {
          type: "Point",
          coordinates: m.coordinates, // [lng, lat]
        },
        type: typeMap[m.type] || m.type,
        era: m.era,
        dynasty: m.dynasty,
        tags: m.tags || [],
        unesco: m.unesco || false,
        unescoYear: m.unescoYear,
        images: [`https://picsum.photos/seed/${slug}/800/600`],
        thumbnail: `https://picsum.photos/seed/${slug}/400/300`,
        description: m.description,
        shortDesc: m.shortDesc,
        highlights: m.highlights || [],
        visitingHours: m.visitingHours,
        entryFee: m.entryFee,
        bestSeason: m.bestSeason,
        avgRating: 0,
        totalReviews: 0,
        hasTour: false,
        relatedSites: [],
      });
    }

    if (docsToInsert.length === 0) {
      console.log("ℹ️  Nothing to insert — all monuments already exist in DB.");
    } else {
      const result = await Heritage.insertMany(docsToInsert, { ordered: false });
      console.log(`✅ Inserted ${result.length} new monuments:`);
      result.forEach((d) => console.log(`   - ${d.name}`));
    }

    if (skipped.length > 0) {
      console.log(`\n⏭️  Skipped ${skipped.length} (already in DB):`);
      skipped.forEach((n) => console.log(`   - ${n}`));
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

seed();