const auctionController = require("../controllers/auctionController");
const authController = require("../controllers/authController");
const closedAuctionController = require("../controllers/closedAuctionController");
const homeController = require("../controllers/homeController")

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/auction', auctionController);
    app.use('/closedAuction', closedAuctionController);
};