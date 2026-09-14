import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-10-16",
// });
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    // const signature = req.headers.get("stripe-signature") as string;

    // let event: Stripe.Event;

    // try {
    //   event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    // } catch (err: any) {
    //   console.error(`Webhook Error: ${err.message}`);
    //   return NextResponse.json({ error: err.message }, { status: 400 });
    // }

    // Mock parsing for MVP
    const event = JSON.parse(body);

    const supabase = await createServerClient();

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        // const session = event.data.object as Stripe.Checkout.Session;
        const session = event.data.object;
        
        if (session.metadata?.userId && session.metadata?.planId) {
          // Update user subscription in database
          const { error } = await supabase
            .from("subscriptions")
            .upsert({
              user_id: session.metadata.userId,
              plan_id: session.metadata.planId,
              status: "active",
              current_period_start: new Date().toISOString(),
              // current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              payment_provider: "stripe",
              provider_subscription_id: session.subscription,
            });

          if (error) {
            console.error("Error updating subscription:", error);
            return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
          }
        }
        break;
      
      case "customer.subscription.deleted":
        // Handle subscription cancellation
        const subscription = event.data.object;
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("provider_subscription_id", subscription.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
