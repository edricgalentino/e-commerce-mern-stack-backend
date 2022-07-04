const routes = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

routes.post("/payment", async (req, res) => {
    const { tokenId, amount } = req.body;
    stripe.charges.create(
        {
            source: tokenId,
            amount: amount,
            currency: "usd",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(500).send({ error: stripeErr });
            } else {
                res.status(200).send({ success: stripeRes });
            }
        }
    );
});

module.exports = routes;
