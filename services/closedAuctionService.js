const Auction = require("../models/Auction");
const ClosedAuction = require("../models/ClosedAuction");

async function getAllClosed (id) {
    return ClosedAuction.find({ 'owner' : id }).lean();
}

async function closeAuction (auction, userId) {
    const name = `${auction.lastBidder.firstName} ${auction.lastBidder.lastName}`
    const closedAuction = await ClosedAuction.create({
        title: auction.title,
        price: auction.price,
        lastBidder: name,
        imageUrl: auction.imageUrl,
        owner: userId
    });

    await Auction.findByIdAndRemove(auction._id);

    return closedAuction;
}

module.exports = {
    getAllClosed,
    closeAuction
};