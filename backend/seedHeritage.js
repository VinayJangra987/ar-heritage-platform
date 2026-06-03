// backend/seedHeritage.js
// Run: node seedHeritage.js
// Yeh script local heritage.js ka saara data MongoDB mein insert karega

const mongoose = require("mongoose");
const Heritage = require("./models/Heritage");
require("dotenv").config();

// ── Saara data — heritage.js se exactly liya ──────────────────────────────
const SITES = [

  // ════════ RAJASTHAN ════════
  {
    name:        "Amber Fort",
    state:       "Rajasthan",
    district:    "Jaipur",
    type:        "Architectural",
    era:         "16th Century",
    unesco:      false,
    location:    { type: "Point", coordinates: [75.8513, 26.9855] },
    description: "A magnificent hill fort built by Raja Man Singh I in 1592, blending Rajput and Mughal architecture. The fort's Sheesh Mahal (Mirror Palace) is adorned with thousands of tiny mirrors creating a mesmerizing starlit effect.",
    shortDesc:   "Magnificent Rajput-Mughal hill fort with the famous Mirror Palace.",
    highlights:  ["Sheesh Mahal (Mirror Palace)", "Built in 1592 by Raja Man Singh I", "Blend of Rajput & Mughal architecture", "Panoramic views of Jaipur"],
    tags:        ["fort", "rajput", "mughal", "mirror-palace"],
    images:      [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
    ],
    thumbnail:    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400",
    visitingHours: "8:00 AM – 5:30 PM",
    entryFee:    "₹100 (Indian), ₹500 (Foreign)",
    bestSeason:  "October – March",
    hasTour:     false,
  },

  {
    name:        "City Palace Jaipur",
    state:       "Rajasthan",
    district:    "Jaipur",
    type:        "Architectural",
    era:         "18th Century",
    unesco:      false,
    location:    { type: "Point", coordinates: [75.8237, 26.9258] },
    description: "The royal residence of the Jaipur royal family, a blend of Rajasthani, Mughal, and European architectural styles. Houses the Chandra Mahal and Mubarak Mahal.",
    shortDesc:   "Royal residence blending Rajasthani, Mughal and European styles.",
    highlights:  ["Chandra Mahal", "Mubarak Mahal", "Museum of royal artifacts", "Cultural heart of Jaipur"],
    tags:        ["palace", "royalty", "museum", "rajput"],
    images:      [
      "https://images.unsplash.com/photo-1624461563697-e6b0f38ee0c6?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1624461563697-e6b0f38ee0c6?w=400",
    visitingHours: "9:30 AM – 5:00 PM",
    entryFee:    "₹150 (Indian), ₹700 (Foreign)",
    bestSeason:  "October – February",
    hasTour:     false,
  },

  {
    name:        "Mehrangarh Fort",
    state:       "Rajasthan",
    district:    "Jodhpur",
    type:        "Architectural",
    era:         "15th Century",
    unesco:      false,
    location:    { type: "Point", coordinates: [73.0188, 26.2979] },
    description: "Perched 400 feet above the Blue City, Mehrangarh is one of the largest forts in India. Built by Rao Jodha in 1459, its massive walls bear no scars of any successful military conquest.",
    shortDesc:   "Enormous fort towering 400 feet above Jodhpur's Blue City.",
    highlights:  ["400 feet above city", "Built by Rao Jodha in 1459", "Never conquered", "Finest museum in Rajasthan"],
    tags:        ["fort", "rajput", "blue-city", "museum"],
    images:      [
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400",
    visitingHours: "9:00 AM – 5:00 PM",
    entryFee:    "₹100 (Indian), ₹600 (Foreign)",
    bestSeason:  "October – March",
    hasTour:     false,
  },

  // ════════ UTTAR PRADESH ════════
  {
    name:        "Taj Mahal",
    state:       "Uttar Pradesh",
    district:    "Agra",
    type:        "Architectural",
    era:         "17th Century",
    dynasty:     "Mughal",
    unesco:      true,
    unescoYear:  1983,
    location:    { type: "Point", coordinates: [78.0421, 27.1751] },
    description: "An ivory-white marble mausoleum commissioned by Mughal Emperor Shah Jahan in 1632 as a tribute to his wife Mumtaz Mahal. A UNESCO World Heritage Site and one of the Seven Wonders of the World.",
    shortDesc:   "Iconic white marble mausoleum — one of the Seven Wonders of the World.",
    highlights:  ["Built in 1632 by Shah Jahan", "One of Seven Wonders", "Pure white Makrana marble", "UNESCO World Heritage 1983"],
    tags:        ["mughal", "world-wonder", "marble", "unesco", "love"],
    images:      [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
    visitingHours: "Sunrise to Sunset (Closed Fridays)",
    entryFee:    "₹50 (Indian), ₹1300 (Foreign)",
    bestSeason:  "November – February",
    hasTour:     true,
    tourId:      "taj-mahal",
  },

  {
    name:        "Agra Fort",
    state:       "Uttar Pradesh",
    district:    "Agra",
    type:        "Architectural",
    era:         "16th Century",
    dynasty:     "Mughal",
    unesco:      true,
    unescoYear:  1983,
    location:    { type: "Point", coordinates: [78.0218, 27.1796] },
    description: "A massive red sandstone fort on the banks of the Yamuna, built by Akbar in 1565. It served as the main residence of the Mughal emperors before they moved to Delhi.",
    shortDesc:   "Red sandstone Mughal fort where Shah Jahan was imprisoned.",
    highlights:  ["Built by Akbar in 1565", "Shah Jahan imprisoned here", "Views of Taj Mahal", "UNESCO World Heritage"],
    tags:        ["mughal", "fort", "akbar", "unesco", "sandstone"],
    images:      [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    visitingHours: "6:00 AM – 6:00 PM",
    entryFee:    "₹40 (Indian), ₹550 (Foreign)",
    bestSeason:  "October – March",
    hasTour:     false,
  },

  {
    name:        "Kashi Vishwanath Temple",
    state:       "Uttar Pradesh",
    district:    "Varanasi",
    type:        "Religious",
    era:         "18th Century (rebuilt)",
    unesco:      false,
    location:    { type: "Point", coordinates: [83.0107, 25.3109] },
    description: "One of the most famous Hindu temples dedicated to Lord Shiva, situated on the western bank of the sacred Ganga. The temple's gold-plated spire is an iconic symbol of Varanasi.",
    shortDesc:   "Most sacred Shiva temple in the world's oldest living city.",
    highlights:  ["Gold-plated spire", "On banks of sacred Ganga", "One of 12 Jyotirlingas", "World's oldest living city"],
    tags:        ["temple", "shiva", "ganga", "spiritual", "sacred"],
    images:      [
      "https://images.unsplash.com/photo-1561361058-c24e01238a46?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1561361058-c24e01238a46?w=400",
    visitingHours: "4:00 AM – 11:00 PM",
    entryFee:    "Free",
    bestSeason:  "October – March",
    hasTour:     false,
  },

  // ════════ MAHARASHTRA ════════
  {
    name:        "Ajanta Caves",
    state:       "Maharashtra",
    district:    "Aurangabad",
    type:        "Archaeological",
    era:         "2nd Century BCE – 6th Century CE",
    unesco:      true,
    unescoYear:  1983,
    location:    { type: "Point", coordinates: [75.7033, 20.5519] },
    description: "30 rock-cut Buddhist cave monuments containing some of the finest surviving examples of ancient Indian art, including paintings and sculptures. Declared a UNESCO World Heritage Site in 1983.",
    shortDesc:   "30 rock-cut caves with India's finest ancient Buddhist murals.",
    highlights:  ["30 rock-cut caves", "Finest Asian murals", "UNESCO World Heritage 1983", "2,000 year old paintings"],
    tags:        ["buddhist", "cave", "paintings", "unesco", "ancient"],
    images:      [
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400",
    visitingHours: "9:00 AM – 5:30 PM (Closed Mondays)",
    entryFee:    "₹40 (Indian), ₹600 (Foreign)",
    bestSeason:  "November – March",
    hasTour:     true,
    tourId:      "ajanta",
  },

  {
    name:        "Ellora Caves",
    state:       "Maharashtra",
    district:    "Aurangabad",
    type:        "Archaeological",
    era:         "6th – 11th Century CE",
    unesco:      true,
    unescoYear:  1983,
    location:    { type: "Point", coordinates: [75.1779, 20.0258] },
    description: "34 monasteries and temples extending over 2 km, belonging to Buddhist, Hindu, and Jain faiths. The Kailasa Temple (Cave 16) is the world's largest monolithic rock excavation.",
    shortDesc:   "34 caves of 3 faiths — home to the world's largest monolithic temple.",
    highlights:  ["Kailasa Temple — world's largest monolith", "3 religions side by side", "UNESCO World Heritage", "Ancient engineering marvel"],
    tags:        ["caves", "buddhist", "hindu", "jain", "unesco", "kailasa"],
    images:      [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400",
    visitingHours: "6:00 AM – 6:00 PM (Closed Tuesdays)",
    entryFee:    "₹40 (Indian), ₹600 (Foreign)",
    bestSeason:  "November – February",
    hasTour:     false,
  },

  {
    name:        "Gateway of India",
    state:       "Maharashtra",
    district:    "Mumbai",
    type:        "Architectural",
    era:         "20th Century",
    unesco:      false,
    location:    { type: "Point", coordinates: [72.8347, 18.9218] },
    description: "A basalt arch monument built to commemorate the landing of King George V and Queen Mary in 1911. Completed in 1924, it stands as Mumbai's most iconic landmark.",
    shortDesc:   "Iconic basalt arch — Mumbai's most recognizable landmark.",
    highlights:  ["Built in 1924", "Last British troops departed here 1948", "Mumbai harbor views", "Free entry"],
    tags:        ["colonial", "arch", "landmark", "mumbai", "harbor"],
    images:      [
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400",
    visitingHours: "Open 24 hours",
    entryFee:    "Free",
    bestSeason:  "November – February",
    hasTour:     false,
  },

  // ════════ KARNATAKA ════════
  {
    name:        "Virupaksha Temple",
    state:       "Karnataka",
    district:    "Hampi",
    type:        "Religious",
    era:         "7th Century CE",
    unesco:      true,
    unescoYear:  1986,
    location:    { type: "Point", coordinates: [76.4607, 15.335] },
    description: "One of the oldest functioning temples in India, dedicated to Lord Shiva as Virupaksha. Set against the dramatic boulder landscape of Hampi, it remains an active pilgrimage centre.",
    shortDesc:   "One of India's oldest functioning temples in the Hampi UNESCO site.",
    highlights:  ["7th century CE", "Active pilgrimage centre", "Vijayanagara Empire royal chapel", "UNESCO World Heritage 1986"],
    tags:        ["temple", "vijayanagara", "shiva", "unesco", "ancient"],
    images:      [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400",
    visitingHours: "6:00 AM – 1:00 PM, 5:00 PM – 8:30 PM",
    entryFee:    "Free",
    bestSeason:  "October – February",
    hasTour:     true,
    tourId:      "hampi",
  },

  {
    name:        "Mysore Palace",
    state:       "Karnataka",
    district:    "Mysuru",
    type:        "Architectural",
    era:         "Early 20th Century",
    unesco:      false,
    location:    { type: "Point", coordinates: [76.6551, 12.3051] },
    description: "The official residence of the Wadiyar dynasty and the seat of the Kingdom of Mysore. The current palace was built between 1897 and 1912 in the Indo-Saracenic style.",
    shortDesc:   "Second most visited monument in India, illuminated with 100,000 bulbs.",
    highlights:  ["100,000 light bulbs during Dasara", "Indo-Saracenic architecture", "Wadiyar dynasty seat", "Second most visited in India"],
    tags:        ["palace", "wadiyar", "indo-saracenic", "dasara", "illuminated"],
    images:      [
      "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=400",
    visitingHours: "10:00 AM – 5:30 PM",
    entryFee:    "₹100 (Indian), ₹200 (Foreign)",
    bestSeason:  "October – February",
    hasTour:     false,
  },

  // ════════ DELHI ════════
  {
    name:        "Red Fort",
    state:       "Delhi",
    district:    "Central Delhi",
    type:        "Architectural",
    era:         "17th Century",
    dynasty:     "Mughal",
    unesco:      true,
    unescoYear:  2007,
    location:    { type: "Point", coordinates: [77.2411, 28.6562] },
    description: "The historic fort that served as the main residence of Mughal emperors for nearly 200 years. Built by Shah Jahan in 1639 when he shifted his capital from Agra to Delhi.",
    shortDesc:   "Symbol of Indian independence — PM hoists flag here every Independence Day.",
    highlights:  ["Built by Shah Jahan in 1639", "PM hoists flag on Independence Day", "UNESCO World Heritage 2007", "200 years of Mughal rule"],
    tags:        ["mughal", "fort", "independence", "shahjahan", "unesco"],
    images:      [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400",
    visitingHours: "9:30 AM – 4:30 PM (Closed Mondays)",
    entryFee:    "₹35 (Indian), ₹500 (Foreign)",
    bestSeason:  "October – March",
    hasTour:     false,
  },

  {
    name:        "Qutub Minar",
    state:       "Delhi",
    district:    "Central Delhi",
    type:        "Architectural",
    era:         "12th – 13th Century",
    dynasty:     "Delhi Sultanate",
    unesco:      true,
    unescoYear:  1993,
    location:    { type: "Point", coordinates: [77.1855, 28.5245] },
    description: "A 73-metre tall minaret of red sandstone and marble, begun by Qutb ud-Din Aibak in 1193. It is the tallest brick minaret in the world and a UNESCO World Heritage Site.",
    shortDesc:   "World's tallest brick minaret — marks the beginning of Muslim rule in India.",
    highlights:  ["73 metres tall", "World's tallest brick minaret", "Begun in 1193", "UNESCO World Heritage 1993"],
    tags:        ["minaret", "sultanate", "sandstone", "tallest", "unesco"],
    images:      [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
    ],
    thumbnail:   "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    visitingHours: "Sunrise to Sunset",
    entryFee:    "₹40 (Indian), ₹600 (Foreign)",
    bestSeason:  "October – March",
    hasTour:     false,
  },
];

// ── Seed Function ─────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    let inserted = 0;
    let skipped  = 0;

    for (const site of SITES) {
      const exists = await Heritage.findOne({ name: site.name });

      if (exists) {
        console.log(`⏭  Already exists: ${site.name}`);
        skipped++;
      } else {
        const created = await Heritage.create(site);
        console.log(`✅ Seeded: ${site.name}  →  _id: ${created._id}`);
        inserted++;
      }
    }

    console.log(`\n🎉 Done! Inserted: ${inserted} | Skipped: ${skipped}`);
    console.log("\n📋 All sites in DB:\n");

    const all = await Heritage.find({}, "name state _id");
    all.forEach(s => console.log(`   ${s._id}  |  ${s.name}  (${s.state})`));

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected.");
  }
}

seed();