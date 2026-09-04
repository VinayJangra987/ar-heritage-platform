router.get("/me/stats", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    badges: user.badges || [],
    streak: user.streak || { current: 0, longest: 0 },
    favoritesCount: user.favorites?.length || 0,
  });
});