const { isOwner, hasUser } = require('../middlewares/guards');
const preload = require('../middlewares/preload');
const { closeAuction, getAllClosed } = require('../services/closedAuctionService');

const closedAuctionController = require('express').Router();

closedAuctionController.get('/:id/close', preload(true), isOwner(), async (req, res) => {
    const auction = res.locals.auction;

    await closeAuction(auction, req.user._id);
    res.redirect('/closedAuction');
});

closedAuctionController.get('/', hasUser(), async (req, res) => {
    const closedAuctions = await getAllClosed(req.user._id);

    res.render('closedAuction', {
        title: 'Closed Auctions',
        closedAuctions
    });
});

module.exports = closedAuctionController;