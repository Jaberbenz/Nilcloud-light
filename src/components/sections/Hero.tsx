"use client";

import ArrowIcon from "@/assets/arrow-right.svg";
import cogImage from "@/assets/cog.png";
import cylinderImage from "@/assets/cylinder.png";
import noodleImage from "@/assets/noodle.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export const Hero = () => {
  const heroRef = useRef(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,var(--tw-gradient-from),var(--tw-gradient-to))] from-dark-highlight to-light-background overflow-x-clip"
    >
      {/* <StarsCanvas /> */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="md:flex items-center justify-center gap-8">
          <div className="md:w-[478px] mx-auto md:mx-0 text-center md:text-left">
            <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight mx-auto md:mx-0">
              Version alpha is here
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-light-text to-light-primary bg-clip-text text-transparent mt-6 text-center md:text-left">
              Dev to Prod <br /> in See Awaits
            </h1>
            <p className="text-xl text-light-secondary-text tracking-tight mt-6 text-center">
              Next-gen Deployment Solution
            </p>
            <div className="flex gap-1 items-center justify-center md:justify-start mt-[30px]">
              <button className="btn btn-primary" onClick={handleGetStarted}>
                Get started
              </button>
              <button className="btn btn-text gap-1">
                <span>Learn more</span>
                <ArrowIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative flex justify-center md:justify-start">
            <motion.img
              src={cogImage.src}
              alt="cog"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
            <motion.img
              src={cylinderImage.src}
              width={220}
              alt="cylinder"
              className="hidden md:block -top-8 -left-40 md:absolute"
              style={{
                translateY: translateY,
              }}
            />
            <motion.img
              src={noodleImage.src}
              width={220}
              alt="noodle"
              className="hidden lg:block absolute top-[524px] left-[448px] rotate-[30deg]"
              style={{
                rotate: 30,
                translateY: translateY,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
