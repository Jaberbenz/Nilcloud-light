"use client";

import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    title: "Starter",
    monthlyPrice: 4.9,
    priceId: "price_1RMTASRwfFxDYm7LTEyIx08F",
    buttonText: "Sign Up Now",
    popular: false,
    inverse: false,
    features: ["1 User", "3 Projects", "10GB Storage", "Email Only"],
  },
  {
    title: "Professional",
    monthlyPrice: 9.9,
    priceId: "price_XXXXX2",
    buttonText: "Join Pro",
    popular: true,
    inverse: true,
    features: [
      "Unlimited Users",
      "10 Projects",
      "100GB Storage",
      "Multiple Sessions",
      "Priority Support",
      "Round-the-Clock",
    ],
  },
  {
    title: "Enterprise",
    monthlyPrice: "To use",
    priceId: null,
    buttonText: "Get Enterprise",
    popular: false,
    inverse: false,
    features: [
      "Unrestricted Users",
      "50 Projects",
      "1To Storage",
      "Unlimited Sessions (SSO)",
      "White-glove Service",
      "24/7 Priority",
      "Premium Security",
      "Exclusive Access",
    ],
  },
];

export const Pricing = () => {
  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) return alert("Contact us for Enterprise pricing.");

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur lors de la création de la session Stripe.");
    }
  };

  return (
    <section className="bg-white py-24">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title py-1">Pricing</h2>
          <p className="section-description mt-4">
            Choose the plan that works best for you. We offer a variety of plans
            to suit different needs and budgets.
          </p>
        </div>

        <div className="flex flex-col gap-8 items-center mt-10 lg:flex-row lg:items-end lg:justify-center lg:gap-10">
          {pricingTiers.map(
            (
              {
                title,
                monthlyPrice,
                buttonText,
                popular,
                inverse,
                features,
                priceId,
              },
              index
            ) => (
              <div
                key={index}
                className={twMerge(
                  "card relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                  inverse === true
                    ? "border-black bg-black text-white"
                    : "border border-gray-200 shadow-sm rounded-xl bg-white"
                )}
              >
                <div className="flex justify-between">
                  <h3
                    className={twMerge(
                      "text-lg font-bold text-black/50",
                      inverse === true && "text-white/60"
                    )}
                  >
                    {title}
                  </h3>
                  {popular === true && (
                    <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                      <motion.span
                        animate={{
                          backgroundPositionX: "-100%",
                        }}
                        transition={{
                          duration: 1,
                          ease: "linear",
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                        className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-medium "
                      >
                        Popular
                      </motion.span>
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mt-[30px]">
                  <span className="text-4xl font-bold tracking-tighter leading-none">
                    ${monthlyPrice}
                  </span>
                  <span className="tracking-tight font-bold text-black/50">
                    /month
                  </span>
                </div>
                <button
                  onClick={() => handleSubscribe(priceId)}
                  className={twMerge(
                    "btn btn-primary w-full mt-[30px] transition-all duration-300",
                    inverse === true
                      ? "bg-white text-black hover:bg-gray-100"
                      : "hover:opacity-90"
                  )}
                >
                  {buttonText}
                </button>
                <ul className="flex flex-col gap-5 mt-8">
                  {features.map((feature, index) => (
                    <li className="text-sm flex items-center gap-4" key={index}>
                      <CheckIcon className="w-6 h-6" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
