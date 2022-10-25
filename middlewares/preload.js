const { getById, getByIdRaw } = require("../services/auctionService"); //TODO

module.exports = (lean) => async (req, res, next) => {
    if (lean) {
        res.locals.auction = await getById(req.params.id);
    } else {
        res.locals.auction = await getByIdRaw(req.params.id);
    }

    next();
};