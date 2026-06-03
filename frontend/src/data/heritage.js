// src/data/heritage.js
// AR-Based Cultural Heritage Preservation & Tourism Platform
// Data file: Indian Heritage Sites organized hierarchically

export const heritageData = {
  states: {
    rajasthan: {
      name: "Rajasthan",
      tagline: "Land of Kings & Forts",
      coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600",
      districts: {
        jaipur: {
          name: "Jaipur",
          sites: [
            {
              id: "amber_fort",
              name: "Amber Fort",
              type: "architectural",
              period: "16th Century",
              unesco: false,
              coordinates: { lat: 26.9855, lng: 75.8513 },
              description:
                "A magnificent hill fort built by Raja Man Singh I in 1592, blending Rajput and Mughal architecture. The fort's Sheesh Mahal (Mirror Palace) is adorned with thousands of tiny mirrors creating a mesmerizing starlit effect.",
              significance:
                "One of Rajasthan's most visited monuments, Amber Fort showcases the opulence of Rajput rulers. Its blend of Hindu and Mughal styles represents cultural synthesis at its finest.",
              visitInfo: {
                timings: "8:00 AM – 5:30 PM",
                entryFee: "₹100 (Indian), ₹500 (Foreign)",
                bestSeason: "October – March",
              },
              images: [
                "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
                "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
              ],
              tags: ["fort", "rajput", "mughal", "mirror-palace"],
            },
            {
              id: "city_palace_jaipur",
              name: "City Palace",
              type: "architectural",
              period: "18th Century",
              unesco: false,
              coordinates: { lat: 26.9258, lng: 75.8237 },
              description:
                "The royal residence of the Jaipur royal family, a blend of Rajasthani, Mughal, and European architectural styles. Houses the Chandra Mahal and Mubarak Mahal.",
              significance:
                "The City Palace complex is the cultural heart of Jaipur, hosting the royal family's private quarters and a remarkable museum of royal artifacts.",
              visitInfo: {
                timings: "9:30 AM – 5:00 PM",
                entryFee: "₹150 (Indian), ₹700 (Foreign)",
                bestSeason: "October – February",
              },
              images: [
                "https://images.unsplash.com/photo-1624461563697-e6b0f38ee0c6?w=800",
              ],
              tags: ["palace", "royalty", "museum", "rajput"],
            },
          ],
        },
        jodhpur: {
          name: "Jodhpur",
          sites: [
            {
              id: "mehrangarh_fort",
              name: "Mehrangarh Fort",
              type: "architectural",
              period: "15th Century",
              unesco: false,
              coordinates: { lat: 26.2979, lng: 73.0188 },
              description:
                "Perched 400 feet above the Blue City, Mehrangarh is one of the largest forts in India. Built by Rao Jodha in 1459, its massive walls bear no scars of any successful military conquest.",
              significance:
                "The 'Magnificent Fort' commands views over the entire Blue City of Jodhpur. Its museum houses one of the finest collections of royal palanquins, costumes, arms, and paintings in Rajasthan.",
              visitInfo: {
                timings: "9:00 AM – 5:00 PM",
                entryFee: "₹100 (Indian), ₹600 (Foreign)",
                bestSeason: "October – March",
              },
              images: [
                "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
              ],
              tags: ["fort", "rajput", "blue-city", "museum"],
            },
          ],
        },
      },
    },
    uttarpradesh: {
      name: "Uttar Pradesh",
      tagline: "Heartland of Civilization",
      coverImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600",
      districts: {
        agra: {
          name: "Agra",
          sites: [
            {
              id: "taj_mahal",
              name: "Taj Mahal",
              type: "architectural",
              period: "17th Century",
              unesco: true,
              coordinates: { lat: 27.1751, lng: 78.0421 },
              description:
                "An ivory-white marble mausoleum commissioned by Mughal Emperor Shah Jahan in 1632 as a tribute to his wife Mumtaz Mahal. A UNESCO World Heritage Site and one of the Seven Wonders of the World.",
              significance:
                "The Taj Mahal is the supreme jewel of Mughal architecture and a universal symbol of love and artistic perfection. Its symmetrical gardens and the play of light on its marble surface change with the time of day.",
              visitInfo: {
                timings: "Sunrise to Sunset (Closed Fridays)",
                entryFee: "₹50 (Indian), ₹1300 (Foreign)",
                bestSeason: "November – February",
              },
              images: [
                "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
                "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
              ],
              tags: ["mughal", "world-wonder", "marble", "unesco", "love"],
            },
            {
              id: "agra_fort",
              name: "Agra Fort",
              type: "architectural",
              period: "16th Century",
              unesco: true,
              coordinates: { lat: 27.1796, lng: 78.0218 },
              description:
                "A massive red sandstone fort on the banks of the Yamuna, built by Akbar in 1565. It served as the main residence of the Mughal emperors before they moved to Delhi.",
              significance:
                "Agra Fort was the seat of Mughal power for generations. Shah Jahan was imprisoned here by his son Aurangzeb, spending his final years gazing at the Taj Mahal in the distance.",
              visitInfo: {
                timings: "6:00 AM – 6:00 PM",
                entryFee: "₹40 (Indian), ₹550 (Foreign)",
                bestSeason: "October – March",
              },
              images: [
                "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
              ],
              tags: ["mughal", "fort", "akbar", "unesco", "sandstone"],
            },
          ],
        },
        varanasi: {
          name: "Varanasi",
          sites: [
            {
              id: "kashi_vishwanath",
              name: "Kashi Vishwanath Temple",
              type: "religious",
              period: "18th Century (rebuilt)",
              unesco: false,
              coordinates: { lat: 25.3109, lng: 83.0107 },
              description:
                "One of the most famous Hindu temples dedicated to Lord Shiva, situated on the western bank of the sacred Ganga. The temple's gold-plated spire is an iconic symbol of Varanasi.",
              significance:
                "Kashi Vishwanath is considered the most sacred of all Shiva temples. Varanasi is one of the world's oldest continuously inhabited cities, and this temple is its eternal spiritual centre.",
              visitInfo: {
                timings: "4:00 AM – 11:00 PM",
                entryFee: "Free",
                bestSeason: "October – March",
              },
              images: [
                "https://images.unsplash.com/photo-1561361058-c24e01238a46?w=800",
              ],
              tags: ["temple", "shiva", "ganga", "spiritual", "sacred"],
            },
          ],
        },
      },
    },
    maharashtra: {
      name: "Maharashtra",
      tagline: "Gateway of India's Heritage",
      coverImage: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1600",
      districts: {
        aurangabad: {
          name: "Aurangabad",
          sites: [
            {
              id: "ajanta_caves",
              name: "Ajanta Caves",
              type: "archaeological",
              period: "2nd Century BCE – 6th Century CE",
              unesco: true,
              coordinates: { lat: 20.5519, lng: 75.7033 },
              description:
                "30 rock-cut Buddhist cave monuments containing some of the finest surviving examples of ancient Indian art, including paintings and sculptures. Declared a UNESCO World Heritage Site in 1983.",
              significance:
                "The Ajanta Caves represent the pinnacle of ancient Buddhist art. The delicate paintings inside depict stories from the Jataka tales and the life of Buddha with remarkable naturalism and emotional depth.",
              visitInfo: {
                timings: "9:00 AM – 5:30 PM (Closed Mondays)",
                entryFee: "₹40 (Indian), ₹600 (Foreign)",
                bestSeason: "November – March",
              },
              images: [
                "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800",
              ],
              tags: ["buddhist", "cave", "paintings", "unesco", "ancient"],
            },
            {
              id: "ellora_caves",
              name: "Ellora Caves",
              type: "archaeological",
              period: "6th – 11th Century CE",
              unesco: true,
              coordinates: { lat: 20.0258, lng: 75.1779 },
              description:
                "34 monasteries and temples extending over 2 km, belonging to Buddhist, Hindu, and Jain faiths. The Kailasa Temple (Cave 16) is the world's largest monolithic rock excavation.",
              significance:
                "Ellora is unique in showcasing the religious harmony of three great Indian faiths — Buddhism, Hinduism, and Jainism — side by side. The Kailasa Temple, carved out of a single basalt cliff, remains a wonder of ancient engineering.",
              visitInfo: {
                timings: "6:00 AM – 6:00 PM (Closed Tuesdays)",
                entryFee: "₹40 (Indian), ₹600 (Foreign)",
                bestSeason: "November – February",
              },
              images: [
                "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
              ],
              tags: ["caves", "buddhist", "hindu", "jain", "unesco", "kailasa"],
            },
          ],
        },
        mumbai: {
          name: "Mumbai",
          sites: [
            {
              id: "gateway_of_india",
              name: "Gateway of India",
              type: "architectural",
              period: "20th Century",
              unesco: false,
              coordinates: { lat: 18.9218, lng: 72.8347 },
              description:
                "A basalt arch monument built to commemorate the landing of King George V and Queen Mary in 1911. Completed in 1924, it stands as Mumbai's most iconic landmark.",
              significance:
                "The Gateway of India symbolizes the colonial era and India's subsequent independence. It was through this gateway that the last British troops departed India in 1948, marking the final act of colonial rule.",
              visitInfo: {
                timings: "Open 24 hours",
                entryFee: "Free",
                bestSeason: "November – February",
              },
              images: [
                "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800",
              ],
              tags: ["colonial", "arch", "landmark", "mumbai", "harbor"],
            },
          ],
        },
      },
    },
    karnataka: {
      name: "Karnataka",
      tagline: "Cradle of Empires",
      coverImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1600",
      districts: {
        hampi: {
          name: "Hampi",
          sites: [
            {
              id: "virupaksha_temple",
              name: "Virupaksha Temple",
              type: "religious",
              period: "7th Century CE",
              unesco: true,
              coordinates: { lat: 15.335, lng: 76.4607 },
              description:
                "One of the oldest functioning temples in India, dedicated to Lord Shiva as Virupaksha. Set against the dramatic boulder landscape of Hampi, it remains an active pilgrimage centre.",
              significance:
                "Virupaksha Temple is the living heart of the Hampi UNESCO World Heritage Site. It stood as the royal chapel of the Vijayanagara Empire, one of the greatest Hindu empires in Indian history.",
              visitInfo: {
                timings: "6:00 AM – 1:00 PM, 5:00 PM – 8:30 PM",
                entryFee: "Free",
                bestSeason: "October – February",
              },
              images: [
                "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
              ],
              tags: ["temple", "vijayanagara", "shiva", "unesco", "ancient"],
            },
          ],
        },
        mysuru: {
          name: "Mysuru",
          sites: [
            {
              id: "mysore_palace",
              name: "Mysore Palace",
              type: "architectural",
              period: "Early 20th Century",
              unesco: false,
              coordinates: { lat: 12.3051, lng: 76.6551 },
              description:
                "The official residence of the Wadiyar dynasty and the seat of the Kingdom of Mysore. The current palace was built between 1897 and 1912 in the Indo-Saracenic style.",
              significance:
                "Mysore Palace is the second most visited monument in India after the Taj Mahal. During Dasara festival, it is illuminated with nearly 100,000 light bulbs, creating a spectacular sight.",
              visitInfo: {
                timings: "10:00 AM – 5:30 PM",
                entryFee: "₹100 (Indian), ₹200 (Foreign)",
                bestSeason: "October – February",
              },
              images: [
                "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800",
              ],
              tags: ["palace", "wadiyar", "indo-saracenic", "dasara", "illuminated"],
            },
          ],
        },
      },
    },
    delhi: {
      name: "Delhi",
      tagline: "Seat of Empires",
      coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600",
      districts: {
        central_delhi: {
          name: "Central Delhi",
          sites: [
            {
              id: "red_fort",
              name: "Red Fort",
              type: "architectural",
              period: "17th Century",
              unesco: true,
              coordinates: { lat: 28.6562, lng: 77.2411 },
              description:
                "The historic fort that served as the main residence of Mughal emperors for nearly 200 years. Built by Shah Jahan in 1639 when he shifted his capital from Agra to Delhi.",
              significance:
                "The Red Fort is a symbol of India's power and independence. It is from the fort's ramparts that the Prime Minister of India hoists the national flag and addresses the nation every Independence Day.",
              visitInfo: {
                timings: "9:30 AM – 4:30 PM (Closed Mondays)",
                entryFee: "₹35 (Indian), ₹500 (Foreign)",
                bestSeason: "October – March",
              },
              images: [
                "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
              ],
              tags: ["mughal", "fort", "independence", "shahjahan", "unesco"],
            },
            {
              id: "qutub_minar",
              name: "Qutub Minar",
              type: "architectural",
              period: "12th – 13th Century",
              unesco: true,
              coordinates: { lat: 28.5245, lng: 77.1855 },
              description:
                "A 73-metre tall minaret of red sandstone and marble, begun by Qutb ud-Din Aibak in 1193. It is the tallest brick minaret in the world and a UNESCO World Heritage Site.",
              significance:
                "Qutub Minar marks the beginning of Muslim rule in India and the Delhi Sultanate. The surrounding Qutb complex contains India's first mosque and inscriptions in multiple languages.",
              visitInfo: {
                timings: "Sunrise to Sunset",
                entryFee: "₹40 (Indian), ₹600 (Foreign)",
                bestSeason: "October – March",
              },
              images: [
                "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
              ],
              tags: ["minaret", "sultanate", "sandstone", "tallest", "unesco"],
            },
          ],
        },
      },
    },
  },

  heritageTypes: {
    architectural:  { label: "Architectural",  icon: "🏛️", color: "#C9A84C", description: "Forts, palaces, minarets, and monuments" },
    archaeological: { label: "Archaeological", icon: "⛏️", color: "#8B6F47", description: "Ancient cave complexes, ruins, and excavated cities" },
    religious:      { label: "Religious",      icon: "🛕", color: "#E07B54", description: "Temples, mosques, churches, and sacred spaces" },
    natural:        { label: "Natural",        icon: "🌿", color: "#4A7C59", description: "Forests, rivers, mountains, and natural reserves" },
    intangible:     { label: "Intangible",     icon: "🎭", color: "#9B59B6", description: "Dance, music, crafts, and living cultural traditions" },
  },

  // ── Get all sites flat array with state/district info ─────────────────────
  getAllSites() {
    const sites = [];
    Object.entries(this.states).forEach(([stateKey, state]) => {
      Object.entries(state.districts).forEach(([districtKey, district]) => {
        district.sites.forEach((site) => {
          sites.push({
            ...site,
            state:       state.name,
            stateKey,
            district:    district.name,
            districtKey,
          });
        });
      });
    });
    return sites;
  },

  // ── Get site by id safely ─────────────────────────────────────────────────
  getSiteById(id) {
    if (!id || id === 'undefined' || id === 'null') return null;
    return this.getAllSites().find((s) => s.id === id) || null;
  },

  // ── Recommendations — handles null/undefined/empty id gracefully ──────────
  getRecommendations(currentSiteId, userPreferences = []) {
    const allSites = this.getAllSites();

    // No currentSiteId — return top UNESCO sites as default
    if (!currentSiteId || currentSiteId === 'undefined' || currentSiteId === 'null') {
      return allSites
        .filter((s) => s.unesco)
        .slice(0, 4)
        .map((s) => ({ ...s, relevanceScore: 0 }));
    }

    const currentSite = allSites.find((s) => s.id === currentSiteId);

    // id given but site not found locally (might be MongoDB-only site)
    if (!currentSite) {
      return allSites
        .filter((s) => s.unesco)
        .slice(0, 4)
        .map((s) => ({ ...s, relevanceScore: 0 }));
    }

    // Score-based recommendations
    return allSites
      .filter((s) => s.id !== currentSiteId)
      .map((site) => {
        let score = 0;
        if (site.type === currentSite.type)       score += 3;
        if (site.state === currentSite.state)     score += 2;
        if (site.unesco && currentSite.unesco)    score += 2;
        (site.tags || []).forEach((tag) => {
          if ((currentSite.tags || []).includes(tag)) score += 1;
          if (userPreferences.includes(tag))          score += 1.5;
        });
        return { ...site, relevanceScore: score };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 4);
  },
};

export default heritageData;