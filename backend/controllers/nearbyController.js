const Heritage = require("../models/Heritage");

// ── GET /api/nearby?lat=28.6139&lng=77.2090&radius=50 ────────────────────────
// Used by NearbySites.js component — find sites within radius (km)
exports.getNearbySites = async (req, res) => {
  try {
    const { lat, lng, radius = 50, limit = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng query parameters are required." });
    }

    const radiusInMeters = Number(radius) * 1000;

    const sites = await Heritage.find({
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: radiusInMeters,
        },
      },
    })
      .limit(Number(limit))
      .select("name thumbnail state district type avgRating totalReviews location hasTour");

    // Add distance to each site (in km)
    const sitesWithDistance = sites.map((site) => {
      const [siteLng, siteLat] = site.location.coordinates;
      const R = 6371;
      const dLat = ((siteLat - Number(lat)) * Math.PI) / 180;
      const dLng = ((siteLng - Number(lng)) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((Number(lat) * Math.PI) / 180) *
        Math.cos((siteLat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return { ...site.toObject(), distance: Math.round(distance * 10) / 10 };
    });

    res.status(200).json({ sites: sitesWithDistance, count: sitesWithDistance.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};