import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook secrets are not configured on the server.' },
      { status: 500 }
    )
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const rawBody = await req.text()
  const stripe = new Stripe(stripeSecretKey, {})

  let event: Stripe.Event

  try {
    // Cryptographically verify webhook signature
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: any) {
    console.error('[Stripe Webhook Signature Verification Failed]:', err.message)
    return NextResponse.json(
      { error: `Webhook Signature Verification Failed: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle successful checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const appointmentId = session.metadata?.appointmentId || session.client_reference_id

    if (appointmentId) {
      const supabase = await createClient()

      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          status: 'confirmed',
          payment_mode: 'online',
          transaction_id: session.id,
        })
        .eq('id', appointmentId)

      if (updateError) {
        console.error('[Stripe Webhook Update Error]:', updateError.message)
        return NextResponse.json(
          { error: 'Database update failed' },
          { status: 500 }
        )
      }
    }
  }

  return NextResponse.json({ received: true })
}
