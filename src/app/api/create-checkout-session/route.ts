import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Coit Cache Collectible',
              description: 'Limited edition collectible - Only 250 made',
              images: ['https://wassuh.com/coit-cache-preview.jpg'],
            },
            unit_amount: 4200, // $42.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}?success=true`,
      cancel_url: `${req.headers.get('origin')}?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
