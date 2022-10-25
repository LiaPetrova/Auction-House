const preload = require('../middlewares/preload');
const { hasUser, isOwner } = require('../middlewares/guards');
const { createAuction, getAll, getById, placeBid, editAuction, deleteAuction } = require('../services/auctionService');
const { parseError } = require('../util/parser');

const auctionController = require('express').Router();

auctionController.get('/catalog', async (req, res) => {
    const auctions = await getAll();

    res.render('catalog', {
       title: 'Browse Auctions',
       auctions
    });
});

auctionController.get('/:id/details', preload(true), async (req, res) => {
    const auction = res.locals.auction;
    auction.isOwner = auction.owner._id.toString() == req.user?._id;
    auction.canBid = auction.lastBidder?._id != req.user?._id;
    auction.isUser = req.user != null;

    res.render('details', {
        title: auction.title,
        auction
    });
     
});
auctionController.get('/:id/bid', (req, res) => {
    res.redirect(`/auction/${req.params.id}/details`);
});

auctionController.post('/:id/bid', hasUser(), preload(true), async (req, res) => {
    const auction = res.locals.auction;
    try {
        if(auction.owner._id.toString() == req.user._id) {
            auction.isOwner = true;
            throw new Error('You cannot bid on your own auction');
        }

        if(auction.lastBidder?._id == req.user._id) {
            throw new Error('You are the current highest bidder');
        }
        if(Number(req.body.bidAmount) <= Number(auction.price)) {
            auction.canBid = true;
            auction.isUser = true;  
            throw new Error('Your bid must be higher than the current price')
        }

        await placeBid(auction._id, req.user, req.body.bidAmount);

        res.redirect(`/auction/${req.params.id}/details`);

    } catch (error) {
        res.render('details', {
            title: auction.title,
            auction,
            errors: parseError(error)
        });
    }
});

auctionController.get('/:id/edit', hasUser(), preload(true), isOwner(), async (req, res) => {
    const auction = res.locals.auction;

    res.render('edit', {
        title: `Edit ${auction.title}`,
        auction
    });
});


auctionController.post('/:id/edit', preload(true), isOwner(), async (req, res) => {
    const auction = res.locals.auction;


    try {
        await editAuction(auction._id, req.body);
        res.redirect(`/auction/${req.params.id}/details`);
    }
    catch (error) {
        req.body._id = auction._id;
        res.render('edit', {
            title: `Edit ${auction.title}`,
            auction: req.body,
            errors: parseError(error)
        });
    }
});

auctionController.get('/:id/delete', preload(true), isOwner(), async (req, res) => {
    await deleteAuction(req.params.id);
    res.redirect('/auction/catalog');
});

auctionController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Auction'
    });
});

auctionController.post('/create', hasUser(), async (req, res) => {
    const auction = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        price: Number(req.body.price),
        owner: req.user._id,
    }

    try {
        
        await createAuction(auction);
        res.redirect('/auction/catalog');
    } catch (error) {
        res.render('create', {
            title: 'Create Auction',
            auction: req.body,
            errors: parseError(error)
        });
    }
});

module.exports = auctionController;