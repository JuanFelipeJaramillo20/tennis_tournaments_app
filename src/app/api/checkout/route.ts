import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const env = new paypal.core.SandboxEnvironment(clientId, clientSecret);

const client = new paypal.core.PayPalHttpClient(env);

export async function POST() {
  const order = new paypal.orders.OrdersCreateRequest();

  order.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "100.00",
        },
      },
    ],
  });

  const response = await client.execute(order);
  return NextResponse.json({ id: response.result.id }, {status: 200});
}
