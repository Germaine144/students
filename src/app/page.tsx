"use client";

import { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react'; // Import FC (Function Component) type

// --- Define Types for Component Props ---

// Define the types for the AnimatedNumber component's props
type AnimatedNumberProps = {
  to: number;
  decimals?: number; // Optional prop
  suffix?: string;   // Optional prop
};

// Define the types for the FeatureCard component's props
type FeatureCardProps = {
  icon: string;
  color: string;
  title: string;
  description: string;
};


// --- Reusable AnimatedNumber Component ---

// Apply the types to the component function
function AnimatedNumber({ to, decimals = 0, suffix = '' }: AnimatedNumberProps) {
  // Add a specific type to the ref for better type safety
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(0, to, {
        duration: 2,
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = value.toFixed(decimals) + suffix;
          }
        },
      });
    }
  }, [isInView, to, decimals, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}


// --- UI Section Components ---

const Header: FC = () => (
  <header className="bg-white border-b border-gray-200">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600">SMS</Link>
      <div className="flex items-center space-x-4">
        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Login
        </Link>
        <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Register
        </Link>
      </div>
    </div>
  </header>
);

const Hero: FC = () => (
  <section className="bg-gray-50 text-center py-20 sm:py-24">
    <div className="container mx-auto px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
        Welcome to the Student Management System
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        The all-in-one solution for managing student data efficiently.
      </p>
      <div className="mt-8 flex justify-center space-x-4">
        <Link href="/register" className="px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Get Started
        </Link>
        <Link href="/#features" className="px-6 py-3 text-base font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Learn More
        </Link>
      </div>
    </div>
  </section>
);

const Features: FC = () => (
  <section id="features" className="py-16 sm:py-20 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon="fa-users"
          color="text-blue-500"
          title="Student Profiles"
          description="Comprehensive student information management"
        />
        <FeatureCard
          icon="fa-chart-line"
          color="text-green-500"
          title="Analytics"
          description="Track performance and generate reports"
        />
        <FeatureCard
          icon="fa-book-open"
          color="text-purple-500"
          title="Course Management"
          description="Organize courses and academic schedules"
        />
        <FeatureCard
          icon="fa-shield-halved"
          color="text-red-500"
          title="Secure & Private"
          description="Enterprise-grade security for your data"
        />
      </div>
    </div>
  </section>
);

// Apply the types to the FeatureCard component's props
const FeatureCard: FC<FeatureCardProps> = ({ icon, color, title, description }) => (
  <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
    <div className={`text-2xl ${color}`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
  </div>
);

const Stats: FC = () => (
  <section className="py-16 sm:py-20 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="p-4">
          <span className="text-4xl md:text-5xl font-bold text-blue-600">
            <AnimatedNumber to={10} suffix="K+" />
          </span>
          <p className="mt-2 text-base text-gray-600">Students Managed</p>
        </div>
        <div className="p-4">
          <span className="text-4xl md:text-5xl font-bold text-blue-600">
            <AnimatedNumber to={500} suffix="+" />
          </span>
          <p className="mt-2 text-base text-gray-600">Schools</p>
        </div>
        <div className="p-4">
          <span className="text-4xl md:text-5xl font-bold text-blue-600">
            <AnimatedNumber to={99.9} decimals={1} suffix="%" />
          </span>
          <p className="mt-2 text-base text-gray-600">Uptime</p>
        </div>
        <div className="p-4">
          <span className="text-4xl md:text-5xl font-bold text-blue-600">
            <AnimatedNumber to={24} suffix="/7" />
          </span>
          <p className="mt-2 text-base text-gray-600">Support</p>
        </div>
      </div>
    </div>
  </section>
);


// --- Main Page Component ---

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
      </main>
    </div>
  );
}