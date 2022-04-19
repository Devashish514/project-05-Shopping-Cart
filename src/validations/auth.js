const jwt = require("jsonwebtoken");

const auth = async function (req, res, next) {
    try {
        let token = req.header("Authorization", "Bearer Token"); // token data is stored inside Authorization Bearer token of Postman
        // console.log(token);
        if (!token) {
            return res.status(404).send({ status: false, message: "Set token" });
        }
        let tokenData = token.split(" ");  // token is stored as "bearer tokenValue" inside authorization header.., thats why splitting it into array [bearer, token Value]....
        // [bearer token]
        let verifyToken = jwt.verify(tokenData[1], "secretKey");
        console.log(verifyToken);
        if (!verifyToken) {
            return res.status(401).send({ status: false, message: "Not Authorize" });
        } else {
            if (Date.now() > (verifyToken.exp) * 1000) {
                return res.status(404).send({ status: false, message: `Session Expired, please login again` });
            } else {
                req.ValidateUser = verifyToken.userId;
                next();
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: err });
    }

}
module.exports = { auth };