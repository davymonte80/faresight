"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* Motion Variants */
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function LandingPage() {
  const features = [
    {
      title: "Predictive Intelligence",
      description:
        "Advanced machine learning algorithms analyze billions of historical fare patterns to forecast optimal booking windows with exceptional precision.",
      highlight: "92% prediction accuracy across global routes",
    },
    {
      title: "Executive Filtering",
      description:
        "Sophisticated search parameters that adapt to your travel preferences, delivering only the most relevant options that match your exact requirements.",
      highlight: "Dynamic filters based on behavioral patterns",
    },
    {
      title: "Global Market Coverage",
      description:
        "Comprehensive access to real-time data from every major airline and travel provider across 195 countries and 5,000 airports worldwide.",
      highlight: "24/7 global fare monitoring",
    },
    {
      title: "Transparent Analytics",
      description:
        "Detailed fare breakdowns, historical trend analysis, and price movement predictions presented through an intuitive executive dashboard.",
      highlight: "Complete pricing transparency",
    },
    {
      title: "Proactive Optimization",
      description:
        "Automated monitoring of selected routes with intelligent alerts when market conditions shift to your advantage.",
      highlight: "Real-time opportunity detection",
    },
    {
      title: "Enterprise Security",
      description:
        "Bank-level encryption and data protection protocols ensuring your search patterns and travel information remain completely confidential.",
      highlight: "Military-grade security standards",
    },
  ];

  const stats = [
    { value: "47%", label: "Average Client Savings" },
    { value: "2.5M", label: "Flights Analyzed Daily" },
    { value: "195", label: "Countries Covered" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  const testimonials = [
    {
      quote:
        "The predictive intelligence transformed our corporate travel program, delivering unprecedented savings and operational efficiency.",
      author: "Global Travel Director, Fortune 500",
      company: "International Technology Group",
    },
    {
      quote:
        "Finally, a platform that understands the complexity of global travel management with the sophistication our executives demand.",
      author: "Chief Operations Officer",
      company: "Multinational Financial Services",
    },
    {
      quote:
        "The analytical depth and predictive accuracy have fundamentally changed how we approach strategic travel planning.",
      author: "VP Global Mobility",
      company: "Leading Consulting Firm",
    },
  ];

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background/95">
      {/* Hero Section - Luxury Design */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Golden gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/5 via-transparent to-amber-900/10" />

        {/* Sophisticated background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,53,15,0.02)_25%,rgba(120,53,15,0.02)_50%,transparent_50%,transparent_75%,rgba(120,53,15,0.02)_75%)] bg-[length:4px_4px]" />

        {/* Thin gold accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-10"
            >
              <motion.div variants={fadeIn}>
                <div className="inline-flex items-center space-x-2 mb-8">
                  <div className="h-px w-12 bg-gradient-to-r from-amber-600 to-amber-400" />
                  <span className="text-sm font-medium tracking-widest text-amber-700 uppercase">
                    Enterprise Flight Intelligence
                  </span>
                  <div className="h-px w-12 bg-gradient-to-r from-amber-400 to-amber-600" />
                </div>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                transition={{ duration: 0.8 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95]"
              >
                <span className="block text-foreground">
                  Flight Intelligence
                </span>
                <span className="block mt-6 font-normal bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                  Redefined
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl text-foreground/70 leading-relaxed font-light max-w-2xl"
              >
                Advanced predictive analytics and market intelligence platform
                transforming global travel procurement through data-driven
                decision making.
              </motion.p>

              {/* Premium Stats Bar */}
              <motion.div
                variants={fadeIn}
                className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-y border-amber-800/10"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-amber-700 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm tracking-wider text-foreground/50 uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={fadeIn}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/search"
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-800 to-amber-700 text-white font-medium px-10 py-5 rounded-none hover:shadow-2xl hover:shadow-amber-900/30 transition-all duration-300 text-lg tracking-wide uppercase"
                >
                  <span className="relative z-10">Begin Analysis</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-amber-400 to-transparent" />
                </Link>
                <Link
                  href="#methodology"
                  className="border border-amber-800/30 bg-background/50 px-10 py-5 rounded-none font-medium hover:bg-amber-950/10 transition-all duration-300 text-lg tracking-wide uppercase"
                >
                  View Methodology
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Premium Visual */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              {/* Main Visual Container */}
              <div className="relative border border-amber-800/20 bg-gradient-to-br from-background to-amber-950/5 p-1">
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-950/10 via-transparent to-amber-900/5" />

                {/* Sophisticated Overlay Elements */}
                <div className="absolute inset-0 p-8">
                  {/* Data Visualization Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-1 bg-gradient-to-r from-amber-800/30 to-amber-600/30" />
                        <div className="h-1 bg-gradient-to-r from-amber-800/20 to-amber-600/20 w-3/4" />
                      </div>
                    ))}
                  </div>

                  {/* Market Trend Display */}
                  <div className="absolute bottom-8 left-8 right-8 border-t border-amber-800/20 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-1 w-32 bg-gradient-to-r from-amber-700 to-amber-600 mb-2" />
                        <div className="h-px w-24 bg-amber-800/30" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-amber-700 font-medium">
                          Optimal Window
                        </div>
                        <div className="text-xs text-foreground/50">
                          48-72 Hours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-6 h-px bg-gradient-to-r from-amber-600 to-transparent" />
                <div className="absolute top-0 left-0 h-6 w-px bg-gradient-to-b from-amber-600 to-transparent" />
                <div className="absolute top-0 right-0 w-6 h-px bg-gradient-to-l from-amber-600 to-transparent" />
                <div className="absolute top-0 right-0 h-6 w-px bg-gradient-to-b from-amber-600 to-transparent" />
                <div className="absolute bottom-0 left-0 w-6 h-px bg-gradient-to-r from-transparent to-amber-600" />
                <div className="absolute bottom-0 left-0 h-6 w-px bg-gradient-to-t from-amber-600 to-transparent" />
                <div className="absolute bottom-0 right-0 w-6 h-px bg-gradient-to-l from-transparent to-amber-600" />
                <div className="absolute bottom-0 right-0 h-6 w-px bg-gradient-to-t from-amber-600 to-transparent" />
              </div>

              {/* Subtle Background Elements */}
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-amber-900/5 blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-amber-800/5 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section
        id="methodology"
        className="py-32 bg-gradient-to-b from-background to-amber-950/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center space-x-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-amber-600 to-transparent" />
              <span className="text-sm font-medium tracking-widest text-amber-700 uppercase">
                Analytical Framework
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-amber-600 to-transparent" />
            </div>
            <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-8">
              Precision{" "}
              <span className="font-normal text-amber-700">Methodology</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-light leading-relaxed">
              Our proprietary three-phase analytical process delivers
              unparalleled accuracy in flight market intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                number: "01",
                title: "Market Intelligence Gathering",
                description:
                  "Real-time aggregation and processing of global flight data from every available source, including proprietary airline feeds and market indicators.",
                metrics: "Processing 2.5M data points hourly",
              },
              {
                number: "02",
                title: "Predictive Algorithm Analysis",
                description:
                  "Advanced machine learning models analyze historical patterns, seasonal trends, and market dynamics to forecast optimal booking conditions.",
                metrics: "92% forecast accuracy rate",
              },
              {
                number: "03",
                title: "Strategic Recommendation Engine",
                description:
                  "Personalized intelligence reports with precise booking windows, alternative routing options, and comprehensive market analysis.",
                metrics: "47% average client savings",
              },
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 p-10 min-h-[400px]">
                  <div className="absolute -top-6 left-10 text-7xl font-bold text-amber-900/10">
                    {phase.number}
                  </div>
                  <div className="mb-8">
                    <div className="h-px w-16 bg-gradient-to-r from-amber-700 to-amber-600 mb-6" />
                    <h3 className="text-2xl font-medium mb-4">{phase.title}</h3>
                  </div>
                  <p className="text-foreground/70 leading-relaxed mb-8 font-light">
                    {phase.description}
                  </p>
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="text-sm text-amber-700 font-medium">
                      {phase.metrics}
                    </div>
                  </div>

                  {/* Hover Effects */}
                  <div className="absolute inset-0 border border-amber-800/0 group-hover:border-amber-800/20 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/0 to-transparent group-hover:via-amber-800/30 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Premium Layout */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className={`flex flex-col lg:flex-row gap-12 items-start ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Feature Number */}
                <div className="lg:w-1/12">
                  <div className="text-6xl font-bold text-amber-900/20">
                    {(i + 1).toString().padStart(2, "0")}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-8/12">
                  <div className="h-px w-24 bg-gradient-to-r from-amber-700 to-amber-600 mb-8" />
                  <h3 className="text-3xl font-medium mb-6">{feature.title}</h3>
                  <p className="text-lg text-foreground/70 leading-relaxed mb-6 font-light">
                    {feature.description}
                  </p>
                  <div className="text-amber-700 font-medium">
                    {feature.highlight}
                  </div>
                </div>

                {/* Visual Separator */}
                <div className="lg:w-3/12">
                  <div className="h-px lg:h-32 w-full lg:w-px bg-gradient-to-r lg:bg-gradient-to-b from-amber-800/10 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Executive Endorsements */}
      <section className="py-32 bg-gradient-to-b from-amber-950/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-amber-600 to-transparent" />
              <span className="text-sm font-medium tracking-widest text-amber-700 uppercase">
                Executive Endorsements
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-amber-600 to-transparent" />
            </div>
            <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-8">
              Trusted by{" "}
              <span className="font-normal text-amber-700">Global Leaders</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
                className="border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 p-10"
              >
                <div className="text-2xl leading-relaxed mb-10 font-light text-foreground/80">
                  &quot;{testimonial.quote}&quot;
                </div>
                                                                                                     
                <div className="border-t border-amber-800/10 pt-6">
                  <div className="text-lg font-medium mb-1">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-foreground/50">
                    {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Minimalist Luxury */}
      <section className="py-32">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Minimal Background */}
          <div className="absolute inset-0 border border-amber-800/10" />
          <div className="absolute -inset-px border border-amber-800/5" />

          <div className="relative px-8 py-20 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div variants={fadeIn} className="mb-12">
                <div className="h-px w-24 bg-gradient-to-r from-amber-700 to-amber-600 mx-auto mb-8" />
                <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-8">
                  Begin Your{" "}
                  <span className="font-normal text-amber-700">Analysis</span>
                </h2>
              </motion.div>

              <motion.p
                variants={fadeIn}
                className="text-xl text-foreground/70 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
              >
                Experience the definitive platform for strategic flight
                intelligence and market optimization.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/search"
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-800 to-amber-700 text-white font-medium px-12 py-6 rounded-none hover:shadow-xl transition-all duration-300 text-lg tracking-wide uppercase"
                >
                  <span className="relative z-10">Request Access</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link
                  href=" "
                  className="border border-amber-800/30 bg-background px-12 py-6 rounded-none font-medium hover:bg-amber-950/10 transition-all duration-300 text-lg tracking-wide uppercase"
                >
                  Schedule Consultation
                </Link>
              </motion.div>

              <motion.p
                variants={fadeIn}
                className="mt-12 text-sm text-foreground/30 tracking-wider uppercase"
              >
                Exclusive Access • Enterprise Security • Global Coverage
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
