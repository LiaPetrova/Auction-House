const { Types, model, Schema } = require('mongoose');

const closedAuctionSchema = new Schema ({
    title: { type: String, required: true},
    price: { type: Number, required: true},
    lastBidder: { type: String, required: true},
    imageUrl: { type: String, required: true},
    owner: { type: Types.ObjectId, ref: 'User', required: true}
});

const ClosedAuction = model('ClosedAuction', closedAuctionSchema);

module.exports = ClosedAuction;