export default (req, res, next) => {
  res.set("X-Robots-Tag", "none, noarchive");
  next();
};