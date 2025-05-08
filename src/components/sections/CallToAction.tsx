import ArrowRight from "@/assets/arrow-right.svg";
import starImage from "@/assets/star.png";
import springImage from "@/assets/spring.png";
import Image from "next/image";

export const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#C4AFFFCC] overflow-x-clip">
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title">Ready to get started?</h2>
          <p className="section-description mt-5">
            Sign up for an account and start using our app today.
          </p>
          <Image
            src={starImage}
            alt="star"
            className="absolute -left-[400px] -top-[137px]"
            width={360}
          />
          <Image
            src={springImage}
            alt="spring"
            className="absolute -right-[400px] -top-[100px]"
            width={360}
          />
        </div>

        <div className="flex gap-2 mt-10 justify-center">
          <button className="btn btn-primary">Sign up for free</button>
          <button className="btn btn-text gap-1">
            <span>Learn more</span> <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
