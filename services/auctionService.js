const Auction = require("../models/Auction");

async function getAll () {
    return Auction.find({}).lean();
}

async function getById (id) {
    return Auction.findById(id).populate('lastBidder').populate('owner').lean();
}

async function getByIdRaw (id) {
    return Auction.findById(id);

}

async function createAuction (auction) {
    return Auction.create(auction);
}

async function editAuction(id, data) {

    const existing = await Auction.findById(id);
    existing.title = data.title;
    existing.category = data.category;
    existing.imageUrl = data.imageUrl;
    if(existing.lastBidder == null) {
        existing.price = data.price;
    }
    existing.description = data.description;

    return existing.save();
}

async function deleteAuction (id) {
    return Auction.findByIdAndRemove(id);
}

async function placeBid (auctionId, userId, bidAmount) {
    const auction = await Auction.findById(auctionId);
    auction.bidder.push(userId);
    auction.lastBidder = userId;
    auction.price = Number(bidAmount);

    await auction.save();
}

module.exports = {
    getAll,
    getById,
    getByIdRaw,
    createAuction,
    editAuction,
    deleteAuction,
    placeBid
}