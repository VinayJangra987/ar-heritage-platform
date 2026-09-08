// seedMoreMonuments.js
//
// Adds monuments into MongoDB, matching your Heritage schema exactly.
//
// IMAGES — HOW THIS WORKS:
// Instead of guessing or hardcoding Unsplash photo IDs (which risks broken
// or mismatched images), this script calls Wikipedia's public REST API at
// runtime for each monument name and pulls the REAL image Wikipedia uses
// for that place (which is itself sourced from Wikimedia Commons). This
// guarantees an accurate, monument-specific photo whenever one exists.
//
//   API used: https://en.wikipedia.org/api/rest_v1/page/summary/<Title>
//   → returns `originalimage.source` — a real upload.wikimedia.org URL
//
// If Wikipedia has no article/image for a name (rare for these), the
// script logs it clearly and falls back to a placeholder — it does NOT
// silently guess a wrong photo.
//
// USAGE:
//   1. Place this file in your backend project (same level as server.js)
//   2. Adjust the import path below to point to your actual Heritage model
//   3. Make sure your .env has MONGO_URI (or MONGODB_URI) set
//   4. Node 18+ has fetch built in. If you're on an older Node version,
//      run:  npm install node-fetch
//      and uncomment the node-fetch import line below.
//   5. Run:  node seedMoreMonuments.js
//
// Safe to re-run: checks existing slugs before inserting, never duplicates.

import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Heritage from "./models/Heritage.js"; // 👈 adjust this path if needed

// import fetch from "node-fetch"; // 👈 uncomment if on Node < 18

dotenv.config();

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

const typeMap = {
  architectural: "Architectural",
  archaeological: "Archaeological",
  religious: "Religious",
  natural: "Natural",
  intangible: "Intangible",
};

// ── Fetch the real Wikipedia image for a monument name ─────────────────────
// wikiTitle lets you override the search term when the monument's common
// name differs from its exact Wikipedia article title (e.g. disambiguation).
async function fetchWikiImage(monumentName, wikiTitle) {
  const title = encodeURIComponent((wikiTitle || monumentName).replace(/ /g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "BharatiyaDharoharSeedScript/1.0" },
    });

    if (!res.ok) {
      console.warn(`   ⚠️  No Wikipedia page found for "${monumentName}" (HTTP ${res.status})`);
      return null;
    }

    const data = await res.json();
    const original = data.originalimage?.source;
    const thumb = data.thumbnail?.source;

    if (!original && !thumb) {
      console.warn(`   ⚠️  Wikipedia page found for "${monumentName}" but it has no image`);
      return null;
    }

    return {
      full: original || thumb,
      thumb: thumb || original,
    };
  } catch (err) {
    console.warn(`   ⚠️  Failed to fetch image for "${monumentName}": ${err.message}`);
    return null;
  }
}

// ── Monument list ────────────────────────────────────────────────────────
// `wikiTitle` is only set when the plain name would hit a disambiguation
// page or a differently-titled article on Wikipedia.
const newMonuments = [
  { name: "Meenakshi Amman Temple", wikiTitle: "Meenakshi_Amman_Temple", state: "Tamil Nadu", district: "Madurai", coordinates: [78.1198, 9.9195], type: "religious", era: "17th Century CE", tags: ["temple", "dravidian", "gopuram", "shiva-parvati"], unesco: false, description: "A historic Hindu temple dedicated to Meenakshi (Parvati) and Sundareswarar (Shiva), famous for its 14 towering, intricately painted gopurams covered in thousands of colourful sculptures.", shortDesc: "Iconic temple famous for its colourful, sculpture-covered towers.", highlights: ["14 ornate gopurams", "Thousands of painted sculptures", "Hall of a Thousand Pillars", "Major Dravidian architecture landmark"], visitingHours: "5:00 AM – 12:30 PM, 4:00 PM – 9:30 PM", entryFee: "Free (camera fee applicable)", bestSeason: "October – March" },
  { name: "Sanchi Stupa", wikiTitle: "Sanchi", state: "Madhya Pradesh", district: "Sanchi", coordinates: [77.7392, 23.4794], type: "archaeological", era: "3rd Century BCE", tags: ["buddhist", "stupa", "ashoka", "unesco"], unesco: true, unescoYear: 1989, description: "One of the oldest stone structures in India, commissioned by Emperor Ashoka in the 3rd century BCE, with elaborately carved gateways (toranas) depicting scenes from the Buddha's life.", shortDesc: "Ashoka-era Buddhist stupa with India's finest carved gateways.", highlights: ["Commissioned by Emperor Ashoka", "Intricately carved toranas (gateways)", "UNESCO World Heritage 1989", "One of India's oldest stone structures"], visitingHours: "Sunrise to Sunset", entryFee: "₹40 (Indian), ₹600 (Foreign)", bestSeason: "October – March" },
  { name: "Rock Garden", wikiTitle: "Rock_Garden_of_Chandigarh", state: "Chandigarh", district: "Chandigarh", coordinates: [76.8079, 30.7522], type: "architectural", era: "20th Century CE", tags: ["sculpture-garden", "recycled-art", "modern", "unique"], unesco: false, description: "A sprawling sculpture garden created by Nek Chand from industrial and urban waste, featuring thousands of figurines and interlinked courtyards and waterfalls.", shortDesc: "Unique sculpture garden built entirely from recycled waste.", highlights: ["Built secretly by Nek Chand from 1957", "Thousands of mosaic figurines", "Made from industrial & urban waste", "40 acres of interlinked courtyards"], visitingHours: "9:00 AM – 6:00 PM (Closed Mondays)", entryFee: "₹30 (Indian), ₹50 (Foreign)", bestSeason: "October – March" },
  { name: "Vittala Temple", wikiTitle: "Vittala_Temple,_Hampi", state: "Karnataka", district: "Hampi", coordinates: [76.4747, 15.3406], type: "religious", era: "15th Century CE", tags: ["temple", "vijayanagara", "stone-chariot", "unesco"], unesco: true, unescoYear: 1986, description: "The most ornate temple complex in Hampi, home to the iconic Stone Chariot and musical pillars that produce different musical notes when struck.", shortDesc: "Hampi's most ornate temple, home of the famous Stone Chariot.", highlights: ["Iconic Stone Chariot", "Musical pillars", "Vijayanagara Empire's finest architecture", "UNESCO World Heritage 1986"], visitingHours: "8:30 AM – 5:30 PM", entryFee: "₹40 (Indian), ₹600 (Foreign)", bestSeason: "October – February" },
  { name: "Lotus Mahal", wikiTitle: "Lotus_Mahal", state: "Karnataka", district: "Hampi", coordinates: [76.4739, 15.3378], type: "architectural", era: "15th Century CE", tags: ["palace", "vijayanagara", "indo-islamic", "unesco"], unesco: true, unescoYear: 1986, description: "An elegant two-storey pavilion in the royal enclosure of Hampi, blending Hindu and Islamic architectural styles, believed to have been used by the queens.", shortDesc: "Elegant Hindu-Islamic pavilion in Hampi's royal enclosure.", highlights: ["Blend of Hindu & Islamic styles", "Located in the royal Zenana enclosure", "Symmetrical lotus-like design", "UNESCO World Heritage 1986"], visitingHours: "8:30 AM – 5:30 PM", entryFee: "Included in Hampi group ticket", bestSeason: "October – February" },
  { name: "Dilwara Temples", wikiTitle: "Dilwara_Temples", state: "Rajasthan", district: "Mount Abu", coordinates: [72.7080, 24.6167], type: "religious", era: "11th–13th Century CE", tags: ["temple", "jain", "marble", "carving"], unesco: false, description: "A group of five Jain temples renowned for their extraordinarily intricate white marble carvings on ceilings, doorways, pillars and panels.", shortDesc: "Jain temple complex famed for breathtaking marble ceiling carvings.", highlights: ["Five separate Jain temples", "Extraordinarily detailed marble work", "Built between 11th–13th centuries", "Major Jain pilgrimage site"], visitingHours: "12:00 PM – 6:00 PM (non-Jains)", entryFee: "Free (no photography inside)", bestSeason: "October – March" },
  { name: "Kumbhalgarh Fort", wikiTitle: "Kumbhalgarh_Fort", state: "Rajasthan", district: "Rajsamand", coordinates: [73.5877, 25.1487], type: "architectural", era: "15th Century CE", tags: ["fort", "great-wall", "rajput", "unesco"], unesco: true, unescoYear: 2013, description: "A massive Mewar fort with the second-longest continuous wall in the world after the Great Wall of China, birthplace of the legendary Maharana Pratap.", shortDesc: "Rajput fort with the world's second-longest continuous wall.", highlights: ["36 km long fortification wall", "Birthplace of Maharana Pratap", "360 temples within the walls", "UNESCO World Heritage 2013"], visitingHours: "9:00 AM – 5:30 PM", entryFee: "₹40 (Indian), ₹600 (Foreign)", bestSeason: "October – March" },
  { name: "Ranthambore Fort", wikiTitle: "Ranthambore_Fort", state: "Rajasthan", district: "Sawai Madhopur", coordinates: [76.3966, 26.0173], type: "architectural", era: "10th Century CE", tags: ["fort", "rajput", "tiger-reserve", "unesco"], unesco: true, unescoYear: 2013, description: "An ancient hilltop fort surrounded by the Ranthambore Tiger Reserve, one of the oldest and most formidable forts of Rajasthan.", shortDesc: "Ancient hilltop fort overlooking a famous tiger reserve.", highlights: ["Set inside Ranthambore National Park", "One of Rajasthan's oldest forts", "UNESCO World Heritage 2013", "Panoramic reserve views from the ramparts"], visitingHours: "6:00 AM – 6:00 PM", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "October – April" },
  { name: "Jal Mahal", wikiTitle: "Jal_Mahal", state: "Rajasthan", district: "Jaipur", coordinates: [75.8467, 26.9538], type: "architectural", era: "18th Century CE", tags: ["palace", "lake", "rajput", "scenic"], unesco: false, description: "A five-storey palace that appears to float in the middle of Man Sagar Lake, with four floors submerged underwater when the lake is full.", shortDesc: "Elegant palace that appears to float on Man Sagar Lake.", highlights: ["Four of five floors underwater", "Set in Man Sagar Lake", "Built in 1750s Rajput style", "Popular photography spot"], visitingHours: "Viewable from shore (interior closed)", entryFee: "Free (viewing from shore)", bestSeason: "October – March" },
  { name: "Nahargarh Fort", wikiTitle: "Nahargarh_Fort", state: "Rajasthan", district: "Jaipur", coordinates: [75.8155, 26.9373], type: "architectural", era: "18th Century CE", tags: ["fort", "hilltop", "sunset-point", "rajput"], unesco: false, description: "A rugged fort built by Sawai Jai Singh II on the edge of the Aravalli Hills, offering panoramic views of Jaipur, especially spectacular at sunset.", shortDesc: "Hilltop fort with sweeping sunset views over Jaipur.", highlights: ["Panoramic views of the Pink City", "Built in 1734", "Part of Jaipur's defence ring with Amber and Jaigarh", "Popular sunset viewpoint"], visitingHours: "10:00 AM – 5:30 PM", entryFee: "₹50 (Indian), ₹200 (Foreign)", bestSeason: "October – March" },
  { name: "Junagarh Fort", wikiTitle: "Junagarh_Fort", state: "Rajasthan", district: "Bikaner", coordinates: [73.3119, 28.0181], type: "architectural", era: "16th Century CE", tags: ["fort", "rajput", "museum", "unconquered"], unesco: false, description: "One of the few major Rajasthan forts not built on a hilltop, remarkable for never having been conquered, with ornate palaces inside its 986-metre wall.", shortDesc: "Ground-level Rajput fort famous for never being conquered.", highlights: ["Never captured militarily", "986-metre fortified wall", "Built by Raja Rai Singh in 1589", "Houses a rich royal museum"], visitingHours: "10:00 AM – 4:30 PM (Closed Tuesdays)", entryFee: "₹50 (Indian), ₹300 (Foreign)", bestSeason: "October – March" },
  { name: "Akshardham Temple", wikiTitle: "Akshardham_(Delhi)", state: "Delhi", district: "East Delhi", coordinates: [77.2773, 28.6127], type: "religious", era: "21st Century CE", tags: ["temple", "modern", "swaminarayan", "landmark"], unesco: false, description: "A vast modern temple complex showcasing traditional Hindu architecture and culture, built entirely without steel, famous for its intricately carved sandstone and marble.", shortDesc: "Grand modern temple complex celebrating Hindu art and culture.", highlights: ["Built without any structural steel", "20,000 hand-carved statues", "Musical fountain show", "Guinness World Record for largest Hindu temple"], visitingHours: "9:30 AM – 6:30 PM (Closed Mondays)", entryFee: "Free (exhibition fees separate)", bestSeason: "October – March" },
  { name: "Safdarjung Tomb", wikiTitle: "Safdarjung's_Tomb", state: "Delhi", district: "South Delhi", coordinates: [77.2126, 28.5913], type: "architectural", era: "18th Century CE", dynasty: "Mughal", tags: ["mughal", "tomb", "garden", "late-mughal"], unesco: false, description: "One of the last significant Mughal garden-tombs, built for Safdarjung, a Nawab of Awadh, marking the decline of Mughal architectural grandeur.", shortDesc: "One of the last great Mughal-era garden tombs in Delhi.", highlights: ["Built in 1754", "Charbagh-style Mughal garden", "Marks late Mughal architecture", "Quieter alternative to Humayun's Tomb"], visitingHours: "6:00 AM – 6:00 PM", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "October – March" },
  { name: "Purana Qila", wikiTitle: "Purana_Qila", state: "Delhi", district: "Central Delhi", coordinates: [77.2436, 28.6089], type: "architectural", era: "16th Century CE", tags: ["fort", "sher-shah-suri", "ancient", "excavation"], unesco: false, description: "One of the oldest forts in Delhi, believed to stand on the site of the ancient city of Indraprastha, built by Sher Shah Suri and Humayun.", shortDesc: "One of Delhi's oldest forts, linked to ancient Indraprastha.", highlights: ["Believed site of ancient Indraprastha", "Built by Sher Shah Suri", "Boating lake and light show", "Ongoing archaeological excavations"], visitingHours: "7:00 AM – 5:00 PM", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "October – March" },
  { name: "Sarnath", wikiTitle: "Sarnath", state: "Uttar Pradesh", district: "Varanasi", coordinates: [83.0227, 25.3811], type: "archaeological", era: "3rd Century BCE", tags: ["buddhist", "ashoka", "deer-park", "first-sermon"], unesco: false, description: "The deer park where Buddha delivered his first sermon after attaining enlightenment, home to the Ashoka Pillar and the Dhamek Stupa.", shortDesc: "Sacred site where Buddha gave his first sermon.", highlights: ["Site of Buddha's first sermon", "Ashoka Pillar with four lions (India's emblem)", "Dhamek Stupa", "Major Buddhist pilgrimage centre"], visitingHours: "8:00 AM – 6:00 PM (Closed Fridays)", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "October – March" },
  { name: "Bibi Ka Maqbara", wikiTitle: "Bibi_Ka_Maqbara", state: "Maharashtra", district: "Aurangabad", coordinates: [75.3155, 19.9058], type: "architectural", era: "17th Century CE", dynasty: "Mughal", tags: ["mughal", "tomb", "mini-taj", "marble"], unesco: false, description: "A grand mausoleum built by Aurangzeb's son in memory of his mother, closely modelled on the Taj Mahal and popularly nicknamed the 'Mini Taj'.", shortDesc: "Aurangzeb-era tomb modelled after the Taj Mahal.", highlights: ["Nicknamed the 'Mini Taj Mahal'", "Built in 1660 for Aurangzeb's wife", "Marble dome over sandstone base", "Landscaped Mughal charbagh garden"], visitingHours: "8:00 AM – 8:00 PM", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "October – March" },
  { name: "Shaniwar Wada", wikiTitle: "Shaniwar_Wada", state: "Maharashtra", district: "Pune", coordinates: [73.8553, 18.5195], type: "architectural", era: "18th Century CE", tags: ["fort", "peshwa", "maratha", "ruins"], unesco: false, description: "The historic seat of the Peshwa rulers of the Maratha Empire, once a grand fortified palace, largely destroyed by fire in 1828 leaving evocative ruins.", shortDesc: "Ruined fortified palace, former seat of the Maratha Peshwas.", highlights: ["Former seat of the Peshwa rulers", "Built in 1732", "Destroyed by fire in 1828", "Evening sound-and-light show"], visitingHours: "8:00 AM – 6:30 PM", entryFee: "₹25 (Indian), ₹125 (Foreign)", bestSeason: "October – February" },
  { name: "Aga Khan Palace", wikiTitle: "Aga_Khan_Palace", state: "Maharashtra", district: "Pune", coordinates: [73.9012, 18.5514], type: "architectural", era: "20th Century CE", tags: ["palace", "gandhi", "freedom-struggle", "memorial"], unesco: false, description: "An Italianate-style palace built in 1892, notable as the site where Mahatma Gandhi was imprisoned and where Kasturba Gandhi is memorialised.", shortDesc: "Historic palace linked to Gandhi's imprisonment and legacy.", highlights: ["Gandhi's place of detention (1942–44)", "Kasturba Gandhi's memorial samadhi", "Italianate arched architecture", "Museum of Gandhian history"], visitingHours: "9:00 AM – 5:30 PM", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "October – February" },
  { name: "Chhatrapati Shivaji Maharaj Terminus", wikiTitle: "Chhatrapati_Shivaji_Maharaj_Terminus", state: "Maharashtra", district: "Mumbai", coordinates: [72.8353, 18.9398], type: "architectural", era: "19th Century CE", tags: ["railway-station", "victorian-gothic", "colonial", "unesco"], unesco: true, unescoYear: 2004, description: "A magnificent Victorian Gothic railway terminus, still a fully functioning station, blending Indian and Victorian architectural traditions.", shortDesc: "Ornate Victorian Gothic railway terminus, still in daily use.", highlights: ["Still a busy functioning station", "Victorian Gothic Revival architecture", "UNESCO World Heritage 2004", "Landmark of colonial-era Mumbai"], visitingHours: "Open 24 hours (station)", entryFee: "Free (platform ticket for non-travellers)", bestSeason: "November – February" },
  { name: "Raigad Fort", wikiTitle: "Raigad_Fort", state: "Maharashtra", district: "Raigad", coordinates: [73.4406, 18.2359], type: "architectural", era: "17th Century CE", tags: ["fort", "maratha", "shivaji", "hilltop"], unesco: false, description: "The former capital of the Maratha Empire under Chhatrapati Shivaji Maharaj, perched atop a hill and reachable via a scenic ropeway.", shortDesc: "Former Maratha capital fort, reachable by scenic ropeway.", highlights: ["Capital of the Maratha Empire", "Shivaji Maharaj's coronation site", "Ropeway access to the hilltop", "Panoramic Sahyadri views"], visitingHours: "8:00 AM – 5:30 PM", entryFee: "₹15 (Indian), ropeway extra", bestSeason: "October – March" },
  { name: "Belur Math", wikiTitle: "Belur_Math", state: "West Bengal", district: "Howrah", coordinates: [88.3483, 22.6318], type: "religious", era: "20th Century CE", tags: ["temple", "ramakrishna", "riverside", "modern"], unesco: false, description: "The headquarters of the Ramakrishna Mission, its main temple architecturally combining Hindu, Islamic, and Christian motifs to symbolise universal harmony.", shortDesc: "Ramakrishna Mission headquarters blending three faiths' architecture.", highlights: ["Combines Hindu, Islamic & Christian design", "Headquarters of Ramakrishna Mission", "Set on the banks of the Hooghly", "Founded by Swami Vivekananda's order"], visitingHours: "6:00 AM – 12:00 PM, 4:00 PM – 8:30 PM", entryFee: "Free", bestSeason: "October – February" },
  { name: "Dakshineswar Kali Temple", wikiTitle: "Dakshineswar_Kali_Temple", state: "West Bengal", district: "Kolkata", coordinates: [88.3574, 22.6547], type: "religious", era: "19th Century CE", tags: ["temple", "kali", "riverside", "ramakrishna"], unesco: false, description: "A large Kali temple on the banks of the Hooghly River, famous for its association with the 19th-century saint Ramakrishna Paramahamsa.", shortDesc: "Riverside Kali temple linked to saint Ramakrishna Paramahamsa.", highlights: ["Built in 1855", "Associated with Ramakrishna Paramahamsa", "Nine-spired Bengal temple architecture", "Located on the Hooghly riverbank"], visitingHours: "6:00 AM – 12:30 PM, 3:00 PM – 8:30 PM", entryFee: "Free", bestSeason: "October – February" },
  { name: "Hazarduari Palace", wikiTitle: "Hazarduari_Palace", state: "West Bengal", district: "Murshidabad", coordinates: [88.2711, 24.1833], type: "architectural", era: "19th Century CE", tags: ["palace", "nawab", "museum", "colonial-era"], unesco: false, description: "A grand palace of the Nawabs of Bengal, meaning 'Palace of a Thousand Doors', now a museum housing an extensive collection of royal artifacts and weapons.", shortDesc: "Nawabi palace with a thousand doors, now a royal museum.", highlights: ["Literally 'Palace of a Thousand Doors'", "Built in 1837 for the Nawabs of Bengal", "Museum of royal artifacts & weaponry", "Grand Italianate architecture"], visitingHours: "10:00 AM – 4:30 PM (Closed Fridays)", entryFee: "₹5 (Indian), ₹100 (Foreign)", bestSeason: "October – March" },
  { name: "Ramappa Temple", wikiTitle: "Ramappa_Temple", state: "Telangana", district: "Warangal", coordinates: [79.9497, 18.2464], type: "religious", era: "13th Century CE", tags: ["temple", "kakatiya", "shiva", "unesco"], unesco: true, unescoYear: 2021, description: "A Kakatiya-era Shiva temple renowned for its floating bricks, sandbox foundation engineering, and exquisitely carved black basalt sculptures.", shortDesc: "Kakatiya-era temple famed for its lightweight 'floating' bricks.", highlights: ["Bricks light enough to float on water", "Innovative sandbox foundation technique", "Named after its sculptor, Ramappa", "UNESCO World Heritage 2021"], visitingHours: "9:00 AM – 5:30 PM", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "October – February" },
  { name: "Thousand Pillar Temple", wikiTitle: "Thousand_Pillar_Temple", state: "Telangana", district: "Warangal", coordinates: [79.5941, 18.0006], type: "religious", era: "12th Century CE", tags: ["temple", "kakatiya", "star-shaped", "carving"], unesco: false, description: "A star-shaped Kakatiya-era temple dedicated to Shiva, Vishnu and Surya, celebrated for its finely carved pillars, perforated screens and monolithic Nandi.", shortDesc: "Star-shaped Kakatiya temple famed for its carved pillars.", highlights: ["Star-shaped Kakatiya architecture", "Dedicated to three deities in one complex", "Intricately carved stone pillars", "Monolithic Nandi bull statue"], visitingHours: "8:00 AM – 6:00 PM", entryFee: "Free", bestSeason: "October – February" },
  { name: "Padmanabhapuram Palace", wikiTitle: "Padmanabhapuram_Palace", state: "Tamil Nadu", district: "Kanyakumari", coordinates: [77.3238, 8.2422], type: "architectural", era: "16th Century CE", tags: ["palace", "travancore", "wooden", "kerala-style"], unesco: false, description: "One of the largest and best-preserved wooden palace complexes in Asia, former seat of the Travancore royal family, known for its intricate rosewood carvings.", shortDesc: "One of Asia's largest and finest surviving wooden palaces.", highlights: ["Former seat of the Travancore royal family", "Intricate rosewood ceiling carvings", "Traditional Kerala wooden architecture", "One of Asia's best-preserved wooden palaces"], visitingHours: "9:00 AM – 4:30 PM (Closed Mondays)", entryFee: "₹35 (Indian), ₹300 (Foreign)", bestSeason: "November – February" },
  { name: "Mattancherry Palace", wikiTitle: "Mattancherry_Palace", state: "Kerala", district: "Kochi", coordinates: [76.2603, 9.9585], type: "architectural", era: "16th Century CE", tags: ["palace", "dutch-palace", "murals", "cochin"], unesco: false, description: "Also known as the Dutch Palace, this palace features remarkable Hindu murals depicting scenes from the Ramayana and Mahabharata alongside royal portraits.", shortDesc: "Historic Kochi palace famed for its detailed Hindu murals.", highlights: ["Also called the 'Dutch Palace'", "Murals of Ramayana & Mahabharata scenes", "Built by the Portuguese, renovated by the Dutch", "Gallery of Cochin royal portraits"], visitingHours: "10:00 AM – 5:00 PM (Closed Fridays)", entryFee: "₹5 (Indian), ₹300 (Foreign)", bestSeason: "October – March" },
  { name: "Bekal Fort", wikiTitle: "Bekal_Fort", state: "Kerala", district: "Kasaragod", coordinates: [75.0308, 12.3919], type: "architectural", era: "17th Century CE", tags: ["fort", "coastal", "keyhole-shaped", "scenic"], unesco: false, description: "The largest fort in Kerala, a keyhole-shaped coastal fortress overlooking the Arabian Sea, offering sweeping views of the coastline.", shortDesc: "Kerala's largest fort, overlooking the Arabian Sea coastline.", highlights: ["Kerala's largest fort", "Distinctive keyhole shape", "Panoramic Arabian Sea views", "Popular filming location"], visitingHours: "8:00 AM – 6:00 PM", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "November – February" },
  { name: "Sree Padmanabhaswamy Temple", wikiTitle: "Padmanabhaswamy_Temple", state: "Kerala", district: "Thiruvananthapuram", coordinates: [76.9433, 8.4828], type: "religious", era: "18th Century CE (rebuilt)", tags: ["temple", "vishnu", "dravidian", "wealth"], unesco: false, description: "A richly decorated Vishnu temple in classic Dravidian style, historically associated with the Travancore royal family and famed for its immense hidden treasures.", shortDesc: "Ornate Vishnu temple famed worldwide for its hidden treasures.", highlights: ["Dravidian-Kerala architectural fusion", "Historic seat of Travancore royalty", "Famous for its vast temple treasury", "Strict traditional dress code for entry"], visitingHours: "3:30 AM – 7:20 PM (multiple slots)", entryFee: "Free (Hindus only, dress code applies)", bestSeason: "November – February" },
  { name: "Vellore Fort", wikiTitle: "Vellore_Fort", state: "Tamil Nadu", district: "Vellore", coordinates: [79.1378, 12.9186], type: "architectural", era: "16th Century CE", tags: ["fort", "vijayanagara", "moat", "mutiny"], unesco: false, description: "A well-preserved fort with a wide moat, built by Vijayanagara chieftains, notable as the site of one of the earliest armed mutinies against British rule in 1806.", shortDesc: "Moated Vijayanagara-era fort, site of an early anti-British mutiny.", highlights: ["Wide, well-preserved moat", "Site of the 1806 Vellore Mutiny", "Vijayanagara-era construction", "Houses a temple, church and mosque within"], visitingHours: "9:00 AM – 5:00 PM (Closed Fridays)", entryFee: "₹15 (Indian), ₹200 (Foreign)", bestSeason: "November – February" },
  { name: "Ramanathaswamy Temple", wikiTitle: "Ramanathaswamy_Temple", state: "Tamil Nadu", district: "Rameswaram", coordinates: [79.3129, 9.2882], type: "religious", era: "12th–17th Century CE", tags: ["temple", "shiva", "char-dham", "corridor"], unesco: false, description: "A major Shiva temple and one of the twelve Jyotirlinga sites, famous for having the longest temple corridor in India lined with over a thousand ornate pillars.", shortDesc: "Sacred Shiva shrine with India's longest temple corridor.", highlights: ["One of the 12 Jyotirlingas", "Longest corridor of any Hindu temple", "Part of the Char Dham pilgrimage", "22 sacred wells within the complex"], visitingHours: "5:00 AM – 1:00 PM, 3:00 PM – 9:00 PM", entryFee: "Free (camera fee applicable)", bestSeason: "October – April" },
  { name: "Basilica of Bom Jesus", wikiTitle: "Basilica_of_Bom_Jesus", state: "Goa", district: "North Goa", coordinates: [73.9114, 15.5009], type: "religious", era: "16th Century CE", tags: ["church", "baroque", "colonial", "unesco"], unesco: true, unescoYear: 1986, description: "A UNESCO-listed baroque church holding the mortal remains of St. Francis Xavier, one of the finest examples of Portuguese colonial architecture in Asia.", shortDesc: "Baroque church holding the remains of St. Francis Xavier.", highlights: ["Holds relics of St. Francis Xavier", "Fine Baroque colonial architecture", "UNESCO World Heritage 1986", "One of Goa's most visited churches"], visitingHours: "9:00 AM – 6:30 PM", entryFee: "Free", bestSeason: "November – February" },
  { name: "Fort Aguada", wikiTitle: "Fort_Aguada", state: "Goa", district: "North Goa", coordinates: [73.7742, 15.4925], type: "architectural", era: "17th Century CE", tags: ["fort", "portuguese", "lighthouse", "coastal"], unesco: false, description: "A well-preserved 17th-century Portuguese fort overlooking the Arabian Sea, built to protect against Dutch and Maratha naval attacks, featuring one of Asia's oldest lighthouses.", shortDesc: "Portuguese coastal fort with one of Asia's oldest lighthouses.", highlights: ["Built by the Portuguese in 1612", "One of Asia's oldest surviving lighthouses", "Sweeping Arabian Sea views", "Freshwater spring gave the fort its name"], visitingHours: "9:30 AM – 6:00 PM", entryFee: "Free", bestSeason: "November – February" },
  { name: "Champaner-Pavagadh Archaeological Park", wikiTitle: "Champaner-Pavagadh_Archaeological_Park", state: "Gujarat", district: "Panchmahal", coordinates: [73.5314, 22.4870], type: "archaeological", era: "8th–14th Century CE", tags: ["archaeological-park", "hilltop", "mosques", "unesco"], unesco: true, unescoYear: 2004, description: "A rare archaeological park combining pre-historic sites, a hill fortress, and 16th-century mosques and temples, spanning centuries of continuous settlement.", shortDesc: "Rare hilltop park spanning centuries of temples, mosques and forts.", highlights: ["Blend of Hindu and Islamic monuments", "Kalika Mata Temple atop Pavagadh Hill", "UNESCO World Heritage 2004", "Only intact pre-Mughal Islamic city in India"], visitingHours: "8:00 AM – 6:00 PM", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "October – February" },
  { name: "Adalaj Stepwell", wikiTitle: "Adalaj_Stepwell", state: "Gujarat", district: "Gandhinagar", coordinates: [72.5714, 23.1667], type: "archaeological", era: "15th Century CE", tags: ["stepwell", "carving", "solanki", "underground"], unesco: false, description: "An intricately carved five-storey stepwell built in 1499, combining Hindu and Islamic architectural elements, once a cool underground gathering place for travellers.", shortDesc: "Ornately carved five-storey stepwell built in 1499.", highlights: ["Five storeys deep, richly carved", "Blend of Hindu and Islamic motifs", "Built by Queen Rudabai in 1499", "Historic cool resting place for travellers"], visitingHours: "8:00 AM – 6:00 PM", entryFee: "Free", bestSeason: "October – February" },
  { name: "Laxmi Vilas Palace", wikiTitle: "Laxmi_Vilas_Palace", state: "Gujarat", district: "Vadodara", coordinates: [73.1979, 22.3067], type: "architectural", era: "19th Century CE", tags: ["palace", "gaekwad", "indo-saracenic", "largest-residence"], unesco: false, description: "The residence of the Gaekwad royal family of Baroda, one of the largest private residences ever built, four times the size of Buckingham Palace.", shortDesc: "Gaekwad royal palace — four times the size of Buckingham Palace.", highlights: ["Four times larger than Buckingham Palace", "Indo-Saracenic architectural style", "Completed in 1890", "Still home to the Gaekwad royal family"], visitingHours: "9:30 AM – 5:00 PM (Closed Mondays)", entryFee: "₹250 (Indian), ₹250 (Foreign)", bestSeason: "October – February" },
  { name: "Bhimbetka Rock Shelters", wikiTitle: "Bhimbetka_rock_shelters", state: "Madhya Pradesh", district: "Raisen", coordinates: [77.6122, 22.9353], type: "archaeological", era: "Paleolithic Era", tags: ["cave-paintings", "prehistoric", "rock-art", "unesco"], unesco: true, unescoYear: 2003, description: "A cluster of natural rock shelters containing some of the earliest traces of human life in India, with cave paintings spanning the Mesolithic period to historical times.", shortDesc: "Ancient rock shelters with India's earliest known cave paintings.", highlights: ["Paintings span 30,000+ years", "Earliest evidence of human life in India", "UNESCO World Heritage 2003", "Over 750 rock shelters in the area"], visitingHours: "7:00 AM – 6:00 PM", entryFee: "₹40 (Indian), ₹500 (Foreign)", bestSeason: "October – March" },
  { name: "Gwalior Fort", wikiTitle: "Gwalior_Fort", state: "Madhya Pradesh", district: "Gwalior", coordinates: [78.1691, 26.2296], type: "architectural", era: "8th Century CE", tags: ["fort", "hilltop", "tomansen", "man-mandir"], unesco: false, description: "A formidable hilltop fort often called the 'Gibraltar of India', housing the ornately tiled Man Mandir Palace and the tomb of musician Tansen.", shortDesc: "Formidable hilltop fort nicknamed the 'Gibraltar of India'.", highlights: ["Called the 'Gibraltar of India'", "Ornate blue-tiled Man Mandir Palace", "Tomb of legendary musician Tansen", "Over 1,000 years of continuous history"], visitingHours: "6:00 AM – 6:00 PM", entryFee: "₹75 (Indian), ₹250 (Foreign)", bestSeason: "October – March" },
  { name: "Jahangir Mahal, Orchha", wikiTitle: "Jahangir_Mahal,_Orchha", state: "Madhya Pradesh", district: "Orchha", coordinates: [78.6417, 25.3516], type: "architectural", era: "17th Century CE", tags: ["palace", "bundela", "mughal-influence", "riverside"], unesco: false, description: "A magnificent palace built by the Bundela king Bir Singh Deo to honour Mughal Emperor Jahangir's visit, showcasing a fusion of Rajput and Mughal styles.", shortDesc: "Bundela palace built to honour a Mughal emperor's visit.", highlights: ["Built for a single royal visit by Jahangir", "Fusion of Rajput and Mughal styles", "Overlooks the Betwa River", "Part of the historic Orchha complex"], visitingHours: "8:00 AM – 6:00 PM", entryFee: "₹25 (Indian), ₹300 (Foreign)", bestSeason: "October – March" },
  { name: "Leh Palace", wikiTitle: "Leh_Palace", state: "Ladakh", district: "Leh", coordinates: [77.5892, 34.1667], type: "architectural", era: "17th Century CE", tags: ["palace", "himalayan", "tibetan-style", "hilltop"], unesco: false, description: "A former royal palace of the Namgyal dynasty, built in Tibetan architectural style, overlooking the town of Leh with dramatic Himalayan mountain backdrops.", shortDesc: "Former royal Himalayan palace overlooking Leh town.", highlights: ["Built in the 17th century by the Namgyal dynasty", "Tibetan-style nine-storey structure", "Panoramic Himalayan views", "Modelled loosely on the Potala Palace"], visitingHours: "7:00 AM – 4:00 PM", entryFee: "₹20 (Indian), ₹100 (Foreign)", bestSeason: "May – September" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const existing = await Heritage.find({}, "slug").lean();
    const existingSlugs = new Set(existing.map((s) => s.slug));

    const docsToInsert = [];
    const skipped = [];
    const noImageFound = [];

    for (const m of newMonuments) {
      const slug = slugify(m.name);

      if (existingSlugs.has(slug)) {
        skipped.push(m.name);
        continue;
      }

      console.log(`🔎 Fetching real image for "${m.name}"...`);
      const img = await fetchWikiImage(m.name, m.wikiTitle);

      let images, thumbnail;

      if (img) {
        images = [img.full];
        thumbnail = img.thumb;
        console.log(`   ✅ Found: ${img.thumb}`);
      } else {
        // Fallback placeholder — flagged so you know to fix it manually later
        images = [`https://picsum.photos/seed/${slug}/800/600`];
        thumbnail = `https://picsum.photos/seed/${slug}/400/300`;
        noImageFound.push(m.name);
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
        images,
        thumbnail,
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

      // Be polite to Wikipedia's API — small delay between requests
      await new Promise((r) => setTimeout(r, 200));
    }

    console.log("");

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

    if (noImageFound.length > 0) {
      console.log(`\n⚠️  ${noImageFound.length} monuments got a PLACEHOLDER image`);
      console.log("    (no Wikipedia image found — fix these via Admin Panel → Edit):");
      noImageFound.forEach((n) => console.log(`   - ${n}`));
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected");
  }
}

seed();