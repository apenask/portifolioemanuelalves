import { MercadoPagoConfig, Payment } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const mpAccessToken = process.env.MP_ACCESS_TOKEN || "";
const client = new MercadoPagoConfig({ accessToken: mpAccessToken });
const payment = new Payment(client);

async function test() {
  try {
    const paymentData = {
      transaction_amount: 10,
      description: `Rifa Número 1`,
      payment_method_id: "pix",
      payer: {
        email: "test@example.com",
        first_name: "Test User",
        identification: {
          type: "CPF",
          number: "12345678909",
        },
      },
      external_reference: "test_123",
    };

    const mpResponse = await payment.create({ body: paymentData });
    console.log(JSON.stringify(mpResponse, null, 2));
  } catch (error) {
    console.error(error);
  }
}

test();
