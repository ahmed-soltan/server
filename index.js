require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())

app.use(
    cors({
        origin: process.env.BASE_URL,
    })
)

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

app.post("/create-checkout-session", async (req, res) => {
    try {
        console.log(req.body.items)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items:  Array.isArray(req.body.items) ? req.body.items && req.body.items.map(item => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.title,
                        },
                        unit_amount: (item.price) * 100,

                    },
                    quantity: item.quantity
                }
            }):[],
            success_url: `${process.env.BASEURL}/success`,
            cancel_url: `${process.env.BASEURL}/cancel`
        })

        res.json({ url: session.url })

    } catch (e) {
        console.log(req.body.items)
        res.status(500).json({ error: e.message })
    }
})

app.listen()