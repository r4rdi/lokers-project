import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
// import Stripe from "stripe"; // Uncomment when Stripe is installed

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-10-16", // use appropriate version
// });

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    // Mock implementation for MVP
    // In a real application, you would create a Stripe Checkout Session here
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env[`STRIPE_PRICE_ID_${planId.toUpperCase()}`],
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planId: planId,
      },
    });

    return NextResponse.json({ url: session.url });
    */

    // Simulated successful checkout redirect for demo purposes
    return NextResponse.json({ 
      url: `/dashboard/settings?success=true&plan=${planId}`,
      message: "This is a mock checkout. In production, this would redirect to Stripe."
    });

  } catch (error: unknown) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
