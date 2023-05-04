var jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  try {
    // Verify Token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not Authorised");
  }
};

module.exports = fetchuser;
