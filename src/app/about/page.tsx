/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Sparkles, Shield, Heart, Globe, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/footer";

export default function AboutPage() {

  const features = [
    {
      icon: Sparkles,
      title: "Curated Experiences",
      description: "Discover hand-picked events from the best organizers in your area.",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Your transactions are protected with industry-standard encryption.",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with event enthusiasts from around the world.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant notifications about events you care about.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const team = [
    {
      name: "Sadnan Zaman",
      role: "Founder & CEO",
      bio: "Passionate about bringing people together through meaningful experiences.",
      avatar: "AM",
      color: "from-violet-500 to-purple-500",
    },
    {
      name: "Sarah Chen",
      role: "Head of Events",
      bio: "Former event planner with 10+ years of experience in the industry.",
      avatar: "SC",
      color: "from-emerald-500 to-green-500",
    },
    {
      name: "Marcus Rodriguez",
      role: "Tech Lead",
      bio: "Building the future of event discovery and management.",
      avatar: "MR",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#050508]">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-purple-600/20" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400 font-medium">Our Story</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                Bringing People
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent"> Together</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                We&apos;re on a mission to make event discovery seamless, connections meaningful, and experiences unforgettable.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                  Explore Events
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
                To create a world where discovering and attending amazing events is effortless, 
                connecting with like-minded people is natural, and every experience leaves a lasting memory.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                We believe that events have the power to transform communities, spark creativity, 
                and bring joy to people&apos;s lives. That&apos;s why we&apos;re building the ultimate platform 
                for event discovery and management.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl blur-2xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8">
                <Heart className="w-12 h-12 text-violet-400 mb-4" />
                <p className="text-white text-xl font-semibold italic">
                  &quot;Every event is an opportunity to create something magical. We&apos;re here to make that happen.&quot;
                </p>
                <p className="text-zinc-500 mt-4">— Sadnan Zaman, Founder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Us
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Everything you need to discover and manage amazing events in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Meet the Team
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Passionate individuals dedicated to making your event experience extraordinary.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all group"
              >
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl font-bold text-white">{member.avatar}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-violet-400 text-sm mb-3">{member.role}</p>
                <p className="text-zinc-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of event enthusiasts and start discovering amazing experiences today.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              Explore Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}