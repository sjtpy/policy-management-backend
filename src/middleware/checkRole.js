
function checkRole(roles) {
    return (req, res, next) => {
      const userData = req.cookies.userData ? JSON.parse(req.cookies.userData) : {};
      const {role} = userData
      if (!roles.includes(userData.role)) {
        return res.status(403).json({ message: 'Access Denied' });
      }
      next();
    };
  }

module.exports = checkRole;
