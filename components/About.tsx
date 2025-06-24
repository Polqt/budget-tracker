'use client';

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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function About() {
  const features = [
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Get detailed insights into your spending patterns with interactive charts and reports."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your financial data is encrypted and stored securely. We never share your personal information."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Track your income and expenses in real-time with instant updates across all devices."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Friendly",
      description: "Access your budget tracker anywhere with our responsive design that works on all devices."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Goal Setting",
      description: "Set financial goals and track your progress with visual indicators and milestone alerts."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Bank-level Security",
      description: "Multi-layer security with encryption ensures your financial data stays safe and private."
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
          <Target className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About BudgetBuddy</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A personal project built to simplify budget tracking and financial management. 
          Created with modern web technologies to help individuals take control of their finances.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">What Makes This Project Special?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Built with Modern Technology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Next</span>
              </div>
              <p className="font-medium">Next.js 15</p>
              <p className="text-sm text-gray-600">React Framework</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CSS</span>
              </div>
              <p className="font-medium">Tailwind CSS</p>
              <p className="text-sm text-gray-600">Styling</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <p className="font-medium">Supabase</p>
              <p className="text-sm text-gray-600">Database</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <p className="font-medium">TypeScript</p>
              <p className="text-sm text-gray-600">Type Safety</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-800">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Set Up Account</h3>
              <p className="text-gray-600">Create your account to start tracking your personal finances securely.</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Expenses</h3>
              <p className="text-gray-600">Log your income and expenses with an easy-to-use interface.</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Monitor Progress</h3>
              <p className="text-gray-600">View your spending patterns and financial trends over time.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">About the Developer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 max-w-2xl mx-auto">
            This project was created as a personal learning experience and practical tool for budget tracking. 
            Built with modern web technologies, it demonstrates full-stack development skills while solving 
            a real-world problem.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:your-email@example.com" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Me
            </a>
            <a 
              href="https://github.com/yourusername/budgetbuddy" 
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Github className="w-4 h-4" />
              View Source
            </a>
            <a 
              href="https://your-portfolio.com" 
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              Portfolio
            </a>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Personal Project • Built for Learning & Practical Use
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}