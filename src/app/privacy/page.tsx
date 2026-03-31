/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Shield, Eye, Database, Lock, FileText, Cookie, Mail, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/footer";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Personal information (name, email address, phone number)",
        "Account credentials (securely hashed passwords)",
        "Event preferences and attendance history",
        "Payment information (processed securely by Stripe)",
        "Device and browser information",
        "IP address and location data",
      ],
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        "To provide and improve our event management services",
        "To process your event registrations and payments",
        "To send you event confirmations and updates",
        "To personalize your experience on our platform",
        "To communicate with you about upcoming events",
        "To analyze and improve platform performance",
      ],
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "All data is encrypted in transit using SSL/TLS",
        "Passwords are hashed and never stored in plain text",
        "Regular security audits and updates",
        "Limited access to personal data by authorized personnel",
        "Secure data centers with industry-standard protections",
      ],
    },
    {
      title: "Cookies & Tracking",
      icon: Cookie,
      content: [
        "Essential cookies for platform functionality",
        "Analytics cookies to improve our service",
        "Preference cookies to remember your settings",
        "You can control cookie preferences in your browser",
        "Third-party cookies from payment processors",
      ],
    },
    {
      title: "Data Retention",
      icon: Trash2,
      content: [
        "Account data retained while your account is active",
        "Event data retained for historical and analytics purposes",
        "You can request data deletion at any time",
        "Some data may be retained for legal compliance",
        "Anonymized data may be kept for research purposes",
      ],
    },
    {
      title: "Your Rights",
      icon: Shield,
      content: [
        "Access your personal data at any time",
        "Request corrections to inaccurate data",
        "Request deletion of your account and data",
        "Opt out of marketing communications",
        "Export your data in a portable format",
        "Withdraw consent at any time",
      ],
    },
  ];

  const lastUpdated = "March 31, 2026";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#050508]">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-purple-600/20" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Shield className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400 font-medium">Privacy Policy</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Your Privacy Matters
              </h1>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                We&apos;re committed to protecting your personal information and being transparent about how we use it.
              </p>
              <p className="text-sm text-zinc-500 mt-4">Last updated: {lastUpdated}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              At EventHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our platform. Please read this policy carefully to understand 
              our views and practices regarding your personal data.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              By using EventHub, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with any part of this policy, please do not use our services.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all"
                >
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-violet-400" />
                      </div>
                      <h2 className="text-xl font-bold text-white">{section.title}</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-zinc-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Third-Party Services */}
          <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-violet-400" />
              <h2 className="text-xl font-bold text-white">Third-Party Services</h2>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We use trusted third-party services to help us operate our platform:
            </p>
            <ul className="space-y-2 text-zinc-400">
              <li>• <strong className="text-white">Stripe</strong> - Secure payment processing</li>
              <li>• <strong className="text-white">Cloudflare</strong> - Content delivery and security</li>
              <li>• <strong className="text-white">Google Analytics</strong> - Platform analytics</li>
              <li>• <strong className="text-white">SendGrid</strong> - Email communications</li>
            </ul>
            <p className="text-sm text-zinc-500 mt-4">
              These services have their own privacy policies and data processing agreements.
            </p>
          </div>

          {/* Children&apos;s Privacy */}
          <div className="mt-8 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Children&apos;s Privacy</h3>
                <p className="text-zinc-400 text-sm">
                  Our platform is not intended for children under 13. We do not knowingly collect 
                  personal information from children under 13. If you believe we have collected such 
                  information, please contact us immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Changes to Policy */}
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-2">Changes to This Policy</h3>
            <p className="text-zinc-400 text-sm">
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are 
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </div>

          {/* Contact for Privacy */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h2>
              <p className="text-zinc-400 mb-6">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all hover:scale-105"
              >
                Contact Our Privacy Team
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}