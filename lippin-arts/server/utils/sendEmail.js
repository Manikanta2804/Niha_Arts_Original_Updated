const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendOrderConfirmationEmail(toEmail, order) {
  const itemsHtml = order.items
    .map((item) => `<tr><td style="padding:6px 0;">${item.name} × ${item.quantity}</td><td style="text-align:right;">₹${(item.price * item.quantity).toFixed(0)}</td></tr>`)
    .join('');

  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #6B1E23;">NiHarts</h2>
      <p>Hi ${order.shippingAddress.fullName}, thank you for your order!</p>
      <p style="color: #666; font-size: 14px;">Order #${order._id.toString().slice(-8)}</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        ${itemsHtml}
      </table>
      <p style="font-weight: bold; text-align: right;">Total: ₹${order.total.toFixed(0)}</p>
      <p style="color: #666; font-size: 14px;">
        Shipping to: ${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">We'll notify you again when your order ships.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"NiHarts" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Order Confirmed — NiHarts #${order._id.toString().slice(-8)}`,
    html,
  });
}

async function sendOtpEmail(toEmail, otp) {
  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #6B1E23;">NiHarts</h2>
      <p>You requested to reset your password. Use the code below — it expires in 10 minutes.</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; color: #6B1E23; margin: 24px 0;">${otp}</p>
      <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"NiHarts" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your NiHarts Password Reset Code',
    html,
  });
}

async function sendAdminOrderNotification(order, customer) {
  const itemsHtml = order.items
    .map((item) => `<tr><td style="padding:6px 0;">${item.name} × ${item.quantity}</td><td style="text-align:right;">₹${(item.price * item.quantity).toFixed(0)}</td></tr>`)
    .join('');

  const html = `
    <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto;">
      <h2 style="color: #6B1E23;">New Order Received — NiHarts</h2>
      <p style="color: #666; font-size: 14px;">Order #${order._id.toString().slice(-8)} · ${new Date(order.createdAt).toLocaleString('en-IN')}</p>

      <h3 style="margin-bottom: 4px;">Customer Details</h3>
      <p style="margin: 0; font-size: 14px;">${customer.fullName}<br/>${customer.email}<br/>${customer.phone}</p>

      <h3 style="margin-top: 20px; margin-bottom: 4px;">Items</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
      </table>
      <p style="font-weight: bold; text-align: right;">Total: ₹${order.total.toFixed(0)}</p>

      <h3 style="margin-top: 20px; margin-bottom: 4px;">Shipping Address</h3>
      <p style="margin: 0; font-size: 14px;">
        ${order.shippingAddress.fullName}, ${order.shippingAddress.phone}<br/>
        ${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
      </p>

      <p style="margin-top: 20px; font-size: 14px;"><strong>Payment method:</strong> ${order.paymentApp}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"NiHarts Orders" <${process.env.EMAIL_USER}>`,
    to: 'varma182869@gmail.com, niharikabonagiri10@gmail.com',
    subject: `New Order #${order._id.toString().slice(-8)} — ₹${order.total.toFixed(0)}`,
    html,
  });
}

module.exports = { sendOrderConfirmationEmail, sendOtpEmail, sendAdminOrderNotification };
