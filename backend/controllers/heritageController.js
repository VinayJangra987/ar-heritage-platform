import Heritage from "../models/Heritage.js";
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// ============ GET ALL SITES ============
export const getAllSites = async (req, res) => {
  try {
    const { type, state, unesco, search, page = 1, limit = 12, sort = "-createdAt" } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (state) filter.state = state;
    if (unesco) filter.unesco = unesco === "true";

    if (search) {
  const safeSearch = escapeRegex(search);
  filter.$or = [
    { name: { $regex: safeSearch, $options: "i" } },
    { state: { $regex: safeSearch, $options: "i" } },
    { district: { $regex: safeSearch, $options: "i" } },
    { tags: { $in: [new RegExp(safeSearch, "i")] } },
  ];
}

    const skip = (Number(page) - 1) * Number(limit);

    const [sites, total] = await Promise.all([
      Heritage.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select("-description"),
      Heritage.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      sites,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("❌ Get all sites error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SITE BY ID ============
export const getSiteById = async (req, res) => {
  try {
    const site = await Heritage.findById(req.params.id).populate(
      "relatedSites",
      "name thumbnail state type avgRating"
    );

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    res.status(200).json({
      success: true,
      site,
    });
  } catch (error) {
    console.error("❌ Get site by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SITE BY SLUG ============
export const getSiteBySlug = async (req, res) => {
  try {
    const site = await Heritage.findOne({ slug: req.params.slug }).populate(
      "relatedSites",
      "name thumbnail state type"
    );

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    res.status(200).json({
      success: true,
      site,
    });
  } catch (error) {
    console.error("❌ Get site by slug error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET RECOMMENDATIONS ============
// Return similar sites in same state or of same type
export const getRecommendations = async (req, res) => {
  try {
    const site = await Heritage.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    const recommendations = await Heritage.find({
      _id: { $ne: site._id },
      $or: [{ state: site.state }, { type: site.type }],
    })
      .limit(6)
      .select("name thumbnail state type avgRating totalReviews unesco");

    res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("❌ Get recommendations error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ CREATE SITE (ADMIN ONLY) ============
export const createSite = async (req, res) => {
  try {
    const site = await Heritage.create(req.body);

    res.status(201).json({
      success: true,
      message: "Site created successfully",
      site,
    });
  } catch (error) {
    console.error("❌ Create site error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE SITE (ADMIN ONLY) ============
export const updateSite = async (req, res) => {
  try {
    const site = await Heritage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Site updated successfully",
      site,
    });
  } catch (error) {
    console.error("❌ Update site error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE SITE (ADMIN ONLY) ============
export const deleteSite = async (req, res) => {
  try {
    const site = await Heritage.findByIdAndDelete(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Site deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete site error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DEFAULT EXPORT ============
export default {
  getAllSites,
  getSiteById,
  getSiteBySlug,
  getRecommendations,
  createSite,
  updateSite,
  deleteSite,
};