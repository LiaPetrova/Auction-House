const { model, Schema, Types } = require('mongoose');


const auctionSchema = new Schema({
    title: { type: String, minLength: [4, 'The title must be at least 4 characters long']},
    description: { type: String, maxLength: [200, 'Description cannot be longer than 200 characters']},
    category: { type: String, enum: ['vehicles', 'estate', 'electronics', 'furniture', 'other'], required: [ true, 'Category is required'] },
    imageUrl: { type: String },
    price: { type: Number, min: [0, 'Price cannot be a negative number']},
    owner: { type: Types.ObjectId, required: true, ref: 'User'},
    bidder: { type: [Types.ObjectId], default: [], ref: 'User'},
    lastBidder: { type: Types.ObjectId, ref: 'User', default: null},
});

const Auction = model('Auction', auctionSchema);

module.exports = Auction;