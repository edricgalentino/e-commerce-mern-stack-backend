const routes = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

routes.post("/create-checkout-session", async (req, res) => {
    const { userId, products, total } = req.body;
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: "price_1LI1VxFkoqITIvETQMjUamgR",
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `http://localhost:3000/payment/success`,
        cancel_url: `http://localhost:3000/cart`,
    });

    res.redirect(303, session.url);
});

module.exports = routes;
