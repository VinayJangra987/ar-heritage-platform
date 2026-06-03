const Heritage = require("../models/Heritage");

// ── GET /api/heritage ────────────────────────────────────────────────────────
// Supports: ?type=Architectural&state=Rajasthan&unesco=true&search=taj&page=1&limit=12
exports.getAllSites = async (req, res) => {
  try {
    const { type, state, unesco, search, page = 1, limit = 12, sort = "-createdAt" } = req.query;

    const filter = {};

    // Discovery.js filters
    if (type)   filter.type  = type;
    if (state)  filter.state = state;
    if (unesco) filter.unesco = unesco === "true";

    // Search overlay in App.js — name, state, district, tags
    if (search) {
      filter.$or = [
        { name:     { $regex: search, $options: "i" } },
        { state:    { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { tags:     { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [sites, total] = await Promise.all([
      Heritage.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select("-description -scenes"), // keep response light for cards
      Heritage.countDocuments(filter),
    ]);

    res.status(200).json({
      sites,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/heritage/:id ────────────────────────────────────────────────────
// Used by Modal.js — full site details
exports.getSiteById = async (req, res) => {
  try {
    const site = await Heritage.findById(req.params.id).populate("relatedSites", "name thumbnail state type avgRating");
    if (!site) return res.status(404).json({ message: "Site not found." });
    res.status(200).json({ site });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/heritage/slug/:slug ─────────────────────────────────────────────
exports.getSiteBySlug = async (req, res) => {
  try {
    const site = await Heritage.findOne({ slug: req.params.slug }).populate("relatedSites", "name thumbnail state type");
    if (!site) return res.status(404).json({ message: "Site not found." });
    res.status(200).json({ site });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/heritage/recommendations/:id ────────────────────────────────────
// Used by Recommendations.js component
exports.getRecommendations = async (req, res) => {
  try {
    const site = await Heritage.findById(req.params.id);
    if (!site) return res.status(404).json({ message: "Site not found." });

    // Return same-type sites in the same state, exclude current
    const recommendations = await Heritage.find({
      _id:   { $ne: site._id },
      $or:   [{ state: site.state }, { type: site.type }],
    })
      .limit(6)
      .select("name thumbnail state type avgRating totalReviews unesco");

    res.status(200).json({ recommendations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/heritage  (admin only) ─────────────────────────────────────────
exports.createSite = async (req, res) => {
  try {
    const site = await Heritage.create(req.body);
    res.status(201).json({ site });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── PATCH /api/heritage/:id  (admin only) ────────────────────────────────────
exports.updateSite = async (req, res) => {
  try {
    const site = await Heritage.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!site) return res.status(404).json({ message: "Site not found." });
    res.status(200).json({ site });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── DELETE /api/heritage/:id  (admin only) ───────────────────────────────────
exports.deleteSite = async (req, res) => {
  try {
    const site = await Heritage.findByIdAndDelete(req.params.id);
    if (!site) return res.status(404).json({ message: "Site not found." });
    res.status(200).json({ message: "Site deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};