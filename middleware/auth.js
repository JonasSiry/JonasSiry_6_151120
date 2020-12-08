const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = jwt.verify(token, "7m;A1!|X,O'WMV(o(4#&v7_?(--dKA?M80l&'9$jvEE@}|Mm'qrfJ/YDFE7z^2=")
        const userId = decodedToken.userId
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID non valable !"
        }
        else {
            next()
        }
    }
    catch (error) {
        res.status(401).json({ error: error | "Requête non authentifiée !"})
    }
}