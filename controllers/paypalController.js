const querystring = require('node:querystring');

// https://courseit.io/articulo/como-integrar-paypal-a-tu-web-x7f1yxv10
class PaypalController {
  constructor() {
    this.paypal = {
      url:
        process.env.NODE_ENV === 'production'
          ? 'https://api-m.paypal.com'
          : 'https://api-m.sandbox.paypal.com',
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_SECRET,
    };
  }

  async crearLinkDePago(price = 100) {
    const url = `${this.paypal.url}/v2/checkout/orders`;
    const token = await this.generateAccessToken();

    const hostname = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.HOST_NAME;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            items: [
              {
                name: 'Servicio de prueba',
                description: 'wowwww',
                quantity: 1,
                unit_amount: {
                  value: price.toString(),
                  currency_code: 'MXN',
                },
              },
            ],
            amount: {
              currency_code: 'MXN',
              value: price.toString(),
              breakdown: {
                item_total: {
                  value: price.toString(),
                  currency_code: 'MXN',
                },
              },
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              brand_name: 'ReSostenido',
              locale: 'es-MX',
              user_action: 'PAY_NOW',
              landing_page: 'NO_PREFERENCE',
              shipping_preference: 'NO_SHIPPING',
              return_url: `${hostname}/citas/procesar-pago`,
              cancel_url: `${hostname}/citas/cancelar-pago`,
            },
          },
        },
      }),
    });

    const data = await response.json();

    console.log(data);

    if (data && data.links) {
      const approvalLink = data.links.find((link) => {
        return link.rel == 'payer-action';
      });
      return { link: approvalLink.href };
    }
  }

  async generateAccessToken() {
    const headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers.set(
      'Authorization',
      'Basic ' +
        Buffer.from(
          this.paypal.clientId + ':' + this.paypal.clientSecret
        ).toString('base64')
    );
    const response = await fetch(`${this.paypal.url}/v1/oauth2/token`, {
      method: 'POST',
      headers,
      body: querystring.stringify({
        grant_type: 'client_credentials',
      }),
      auth: {
        username: this.paypal.clientId,
        password: this.paypal.clientSecret,
      },
    });
    const data = await response.json();
    return data.access_token;
  }
}

module.exports = PaypalController;
