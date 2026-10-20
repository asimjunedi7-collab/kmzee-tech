"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/content";
import { springDefault, springSettle } from "@/lib/motion";
import { HeroGlobe } from "./HeroGlobe";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: springDefault },
};

export function Hero({ dict }: { dict: Dict }) {
  const { hero } = dict;
  const words = hero.typed;
  const [wordIndex, setWordIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Gentle parallax on the illustration as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -48]);

  // Rotate the subtitle line. Under reduced motion it stays on the first phrase.
  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const id = window.setInterval(() => setWordIndex((i) => (i + 1) % words.length), 2800);
    return () => window.clearInterval(id);
  }, [reduceMotion, words.length]);

  return (
    <section ref={sectionRef} id="top" className="relative isolate overflow-hidden pb-12 pt-10 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-24">
      <div
        aria-hidden="true"
        className="glow -start-32 -top-32 h-[30rem] w-[30rem]"
        style={{ background: "var(--glow-a)" }}
      />

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div variants={stagger} initial="hidden" animate="show" className="text-center lg:text-start">
          <motion.p variants={rise} className="eyebrow">
            {hero.brand}
          </motion.p>

          <motion.h1 variants={rise} className="display mt-5 whitespace-nowrap text-[clamp(2.25rem,5vw,4.25rem)]">
            <span>{hero.titleBefore}</span> <span className="text-accent">+</span> <span>{hero.titleAfter}</span>
          </motion.h1>

          <motion.p variants={rise} className="lead mx-auto mt-5 max-w-xl sm:mt-6 lg:mx-0">
            {hero.subtitle}
          </motion.p>

          <motion.div variants={rise} className="mt-6 sm:mt-7">
            <p className="small text-muted">{hero.builtAround}</p>
            <div className="relative mt-1 h-12 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={wordIndex}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={springDefault}
                  className="absolute inset-x-0 text-xl font-bold leading-snug text-fg sm:text-2xl"
                >
                  {words[wordIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.blockquote
            variants={rise}
            className="small mx-auto mt-6 max-w-xl italic text-muted sm:mt-7 lg:mx-0 lg:border-s-2 lg:border-accent lg:ps-4 lg:text-start"
          >
            “{hero.quote}”
          </motion.blockquote>

          <motion.div variants={rise} className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-9 lg:justify-start">
            <a href="#services" className="btn btn-primary">
              {hero.ctaPrimary}
            </a>
            <a href="#transformation-highlights" className="btn btn-secondary">
              {hero.ctaSecondary}
            </a>
            <a href="#contact" className="btn btn-ghost">
              {hero.ctaContact}
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springSettle}
          className="hidden md:block"
        >
          <HeroGlobe />
        </motion.div>
      </div>
    </section>
  );
}
