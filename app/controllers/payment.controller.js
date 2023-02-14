const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



// exports.create = (req, res) => {
//     try {
//         const session = stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             mode: "payment",
//             line_items: [{
//                 price: req.body.price,
//                 quantity: 1
//             }],
//             success_url: "http://localhost:8081/payment/success",
//             cancel_url: "http://localhost:8081/profile",
//             apiKey:process.env.STRIPE_SECRET_KEY
//         })
//             .then(result => {
//                 // console.log(result);
//                 res.json({url: result.url})
//         })
//     } catch (e) {
//         res.status(500).json({error: e.message})
//     }
// }

exports.create = (req, res) => {
    let status, error;
    const { token, amount} = req.body;
    try{
        //  Stripe.charges.create({
        //     source: token.id,
        //     amount,
        //     currency: 'usd'

        console.log(token, amount)
        // })
        status = "success"
    }catch(error){
        console.log(error);
        status="failure"
    }
    res.json({error, status})
}
