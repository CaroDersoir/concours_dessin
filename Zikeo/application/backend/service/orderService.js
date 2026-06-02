/** logique métier commandes + envoi email de confirmation **/

require('dotenv').config();
const nodemailer = require('nodemailer');
const orderModel = require('../model/orderModel');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

function generateOrderNumber() {
    return 'ZK-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

exports.createOrder = async (userId, {shipping, cart, promo}) => {
    const rawTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discountPct = promo?.discount_percent ?? 0;
    const totalTtc = rawTotal * (1 - discountPct / 100);

    const orderNumber = generateOrderNumber();

    const order = await orderModel.create({
        user_id: userId,
        order_number: orderNumber,
        adresse_livraison: shipping.adresse_livraison,
        contact_nom: shipping.contact_nom,
        contact_email: shipping.contact_email,
        contact_telephone: shipping.contact_telephone,
        payment_method: shipping.payment_method,
        promo_code: promo?.code ?? null,
        discount_percent: discountPct,
        total_ht: rawTotal.toFixed(2),
        total_ttc: totalTtc.toFixed(2)
    }, cart.map(i => ({
        item_id: i.id ?? null,
        item_name: i.name,
        item_price: i.price,
        quantity: i.quantity
    })));

    if (shipping.contact_email) {
        await sendConfirmationEmail(shipping.contact_email, order, cart, promo, shipping).catch(() => {});
    }

    return order;
};

exports.getUserOrders = (userId) => orderModel.findByUserId(userId);

exports.getAllOrders = () => orderModel.findAll();

exports.updateOrderStatus = (id, status) => orderModel.updateStatus(id, status);

async function sendConfirmationEmail(email, order, cart, promo, shipping) {
    const itemsHtml = cart.map(i =>
        `<tr>
            <td style="padding:6px 12px">${i.name}</td>
            <td style="padding:6px 12px;text-align:center">${i.quantity}</td>
            <td style="padding:6px 12px;text-align:right">${(i.price * i.quantity).toFixed(2)} €</td>
        </tr>`
    ).join('');

    const discountLine = promo
        ? `<p>Code promo <strong>${promo.code}</strong> appliqué : -${promo.discount_percent}%</p>`
        : '';

    const paymentLabels = {carte: 'Carte bancaire', paypal: 'PayPal', virement: 'Virement bancaire'};

    await transporter.sendMail({
        from: `"Zikeo" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Confirmation de commande Zikeo — #${order.order_number}`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto;color:#222">
                <h2 style="color:#5b21b6">Merci pour votre commande !</h2>
                <p>Numéro de commande : <strong>${order.order_number}</strong></p>
                <table border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin:16px 0">
                    <thead style="background:#f3f0ff">
                        <tr>
                            <th style="padding:8px 12px;text-align:left">Article</th>
                            <th style="padding:8px 12px;text-align:center">Qté</th>
                            <th style="padding:8px 12px;text-align:right">Prix</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                </table>
                ${discountLine}
                <p>Total TTC : <strong>${Number(order.total_ttc).toFixed(2)} €</strong></p>
                <hr style="margin:16px 0"/>
                <p>Adresse de livraison : ${shipping.adresse_livraison || '—'}</p>
                <p>Mode de paiement : ${paymentLabels[shipping.payment_method] || shipping.payment_method}</p>
                <p style="margin-top:24px;color:#888;font-size:12px">
                    Ceci est un email de confirmation simulé. Aucun paiement réel n'a été effectué.
                </p>
            </div>
        `
    });
}
