'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  PieChart,
  Smartphone,
  Lock,
  TrendingUp,
  Github,
  Mail,
  Globe,
  Target,
  Heart,
  Code,
  Rocket,
  Coffee,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function About() {
  const features = [
    {
      icon: <PieChart className="w-6 h-6" />,
      title: 'Smart Analytics',
      description:
        'AI-powered insights into your spending patterns with predictive analytics and personalized recommendations.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Enterprise Security',
      description:
        'Military-grade encryption with zero-knowledge architecture. Your data is secure by design.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description:
        'Real-time synchronization across all devices with offline-first architecture for seamless experience.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Cross-Platform',
      description:
        'Progressive Web App with native mobile experience. One codebase, everywhere access.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Goal Achievement',
      description:
        'Smart goal tracking with ML-powered predictions and automated milestone celebrations.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Privacy First',
      description:
        'GDPR compliant with local-first data storage. You own your data, we protect it.',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const techStack = [
    {
      name: 'Next.js 15',
      description: 'React Framework',
      icon: '⚛️',
      color: 'bg-black',
    },
    {
      name: 'React 19',
      description: 'UI Library',
      icon: '🔧',
      color: 'bg-blue-600',
    },
    {
      name: 'TypeScript',
      description: 'Type Safety',
      icon: '🛡️',
      color: 'bg-blue-700',
    },
    {
      name: 'Tailwind CSS',
      description: 'Styling',
      icon: '🎨',
      color: 'bg-cyan-500',
    },
    {
      name: 'Framer Motion',
      description: 'Animations',
      icon: '✨',
      color: 'bg-purple-600',
    },
    {
      name: 'Supabase',
      description: 'Backend',
      icon: '🗄️',
      color: 'bg-green-600',
    },
    {
      name: 'Drizzle ORM',
      description: 'Database',
      icon: '🔄',
      color: 'bg-orange-500',
    },
    { name: 'Zod', description: 'Validation', icon: '✅', color: 'bg-red-500' },
  ];

  const principles = [
    {
      icon: <Code className="w-5 h-5" />,
      title: 'Clean Architecture',
      description: 'SOLID principles, modular design, and maintainable code',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Security First',
      description: 'Input validation, sanitization, and secure authentication',
    },
    {
      icon: <Rocket className="w-5 h-5" />,
      title: 'Performance',
      description: 'Optimized loading, caching, and responsive design',
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'User Experience',
      description: 'Intuitive interface with accessibility in mind',
    },
  ];

  const stats = [
    {
      number: '15+',
      label: 'Modern Technologies',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      number: '100%',
      label: 'Type Safety',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      number: '0',
      label: 'Security Vulnerabilities',
      icon: <Lock className="w-5 h-5" />,
    },
    {
      number: '∞',
      label: 'Scalability',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-16">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
              <Target className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
              Personal Finance Revolution
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              BudgetTracker Pro
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              A next-generation personal finance management platform built with
              cutting-edge technology, enterprise-grade security, and
              user-centric design principles.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4"
          >
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
              <Rocket className="w-4 h-4 mr-2" />
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-slate-300 hover:bg-slate-50 px-8 py-3"
            >
              <Github className="w-4 h-4 mr-2" />
              View Source
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-2 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center">
            <Badge className="bg-blue-100 text-blue-600 mb-4">
              Core Features
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Engineering Excellence
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Built with modern software engineering principles, focusing on
              maintainability, security, and user experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl text-white group-hover:scale-110 transition-transform`}
                      >
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl text-slate-800">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <Badge className="bg-purple-100 text-purple-600 mb-4">
              Technology Stack
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Built with Modern Tools
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Leveraging the latest technologies to deliver a robust, scalable,
              and maintainable application.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {techStack.map((tech, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="text-center group"
                    >
                      <div
                        className={`w-16 h-16 ${tech.color} rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl group-hover:shadow-lg transition-all duration-300`}
                      >
                        {tech.icon}
                      </div>
                      <p className="font-semibold text-slate-800">
                        {tech.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {tech.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Software Engineering Principles */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <Badge className="bg-green-100 text-green-600 mb-4">
              Software Engineering
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Development Principles
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Following industry best practices and software engineering
              methodologies for reliable, maintainable code.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4 text-green-600">
                      {principle.icon}
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <Badge className="bg-orange-100 text-orange-600 mb-4">
              How It Works
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Simple & Powerful
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      step: '1',
                      title: 'Setup & Secure',
                      description:
                        'Create your account with enterprise-grade security',
                    },
                    {
                      step: '2',
                      title: 'Track & Analyze',
                      description:
                        'Log transactions with AI-powered categorization',
                    },
                    {
                      step: '3',
                      title: 'Achieve & Celebrate',
                      description:
                        'Reach your financial goals with smart insights',
                    },
                  ].map((item, index) => (
                    <div key={index} className="text-center relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">
                          {item.step}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-slate-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600">{item.description}</p>
                      {index < 2 && (
                        <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-orange-400" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Developer Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Coffee className="w-10 h-10" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-4">
                  Crafted with Passion
                </h2>
                <p className="text-slate-300 max-w-3xl mx-auto mb-8 text-lg">
                  This project represents the intersection of modern software
                  engineering, user experience design, and personal finance
                  management. Built as a demonstration of full-stack development
                  capabilities while solving real-world financial tracking
                  challenges.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Developer
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Source Code
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Portfolio
                  </Button>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-700">
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-sm">
                      Built for Learning • Designed for Impact • Engineered for
                      Scale
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
