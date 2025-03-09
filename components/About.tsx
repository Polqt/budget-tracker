import {
  ArrowRight,
  TrendingUp,
  PieChart,
  Target,
  Star,
  ChevronDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

export default function About() {
  const users = [
    { id: 1, name: 'John Doe', initials: 'JD', image: '/Eye.jpg' },
    { id: 2, name: 'Jepoy Dizon', initials: 'JD', image: '/Car.jpg' },
    { id: 3, name: 'Miles Pinoy', initials: 'MP', image: '/Cat.jpg' },
    { id: 4, name: 'Jepoy Gold', initials: 'JG', image: '/Figure.jpg' },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen overflow-x-hidden">
      <div className="px-4 py-8 w-full">
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col space-y-4">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 w-fit px-4 py-1 rounded-full text-sm font-medium"
              >
                Your Financial Companion
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                About <span className="text-green-600">BudgetBuddy</span>
              </h1>
              <p className="text-lg text-gray-600">
                Your personal finance companion that makes budgeting simple,
                insightful, and genuinely enjoyable.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 hover:bg-green-50 transition-colors"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-500/20">
                <div className="flex -space-x-2">
                  {users.map(user => (
                    <Avatar
                      key={user.id}
                      className="border-2 border-white h-10 w-10"
                    >
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    2,000+ users
                  </span>{' '}
                  trust BudgetBuddy
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-600 to-green-400"></div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Monthly Budget
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        $2,450
                      </div>
                      <div className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" /> +5.3%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Savings Goal
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        $10,000
                      </div>
                      <div className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" /> 45% complete
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-gray-700">
                        Monthly overview
                      </div>
                      <div className="text-xs text-gray-500">March 2025</div>
                    </div>
                    <div className="flex items-end space-x-2 h-24">
                      <div className="flex-1 bg-green-200 rounded-t h-12"></div>
                      <div className="flex-1 bg-green-300 rounded-t h-16"></div>
                      <div className="flex-1 bg-green-400 rounded-t h-20"></div>
                      <div className="flex-1 bg-green-500 rounded-t h-14"></div>
                      <div className="flex-1 bg-green-600 rounded-t h-10"></div>
                      <div className="flex-1 bg-green-700 rounded-t h-18"></div>
                      <div className="flex-1 bg-green-800 rounded-t h-8"></div>
                    </div>
                  </div>
                  <div className="flex justify-end text-sm text-gray-500">
                    <div>v2.0.4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center p-4 md:border-r border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-2">94%</div>
              <div className="text-gray-600 text-center">
                of users report better financial awareness
              </div>
            </div>
            <div className="flex flex-col items-center p-4 md:border-r border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-2">30+</div>
              <div className="text-gray-600 text-center">
                financial insights provided monthly
              </div>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="text-4xl font-bold text-green-600 mb-2">
                $1.2M
              </div>
              <div className="text-gray-600 text-center">
                saved by our users collectively
              </div>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="text-4xl font-bold text-green-600 mb-2">
                4.9/5
              </div>
              <div className="text-gray-600 text-center">
                average user satisfaction rating
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 w-fit px-4 py-1 rounded-full text-sm font-medium mb-4"
                  >
                    My Purpose
                  </Badge>
                  <CardTitle className="text-3xl font-bold">
                    My Mission
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Why I created BudgetBuddy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-lg">
                    I created BudgetBuddy to help people like you take control
                    of their finances. I believe that budgeting should be
                    simple, insightful, and even enjoyable.
                  </p>
                  <p className="text-gray-700 text-lg">
                    My goal is to empower you with insights about your spending
                    habits, help you set realistic financial goals, and
                    celebrate progress along the way.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="text-green-600 hover:text-green-700 pl-0 hover:bg-green-50"
                  >
                    Read My Story <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 order-1 md:order-2 flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg shadow-md transform -rotate-6"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-green-50 rounded-lg shadow-md transform rotate-3"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500 to-green-700 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-opacity-20 flex items-center justify-center">
                    <PieChart className="w-32 h-32 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 mb-4 px-4 py-1 rounded-full text-sm font-medium"
            >
              What I Offer
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              BudgetBuddy provides all the tools you need to manage your
              finances effectively
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="group border-t-4 border-t-green-500 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader>
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="group-hover:text-green-700 transition-colors">
                  Expense Tracking
                </CardTitle>
                <CardDescription>Monitor your spending habits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Easily track your expenses across multiple categories and
                  accounts. Get real-time updates on where your money is going.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="text-green-600 hover:text-green-700 pl-0 hover:bg-green-50"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="group border-t-4 border-t-blue-500 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader>
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="group-hover:text-blue-700 transition-colors">
                  Budget Planning
                </CardTitle>
                <CardDescription>
                  Set and achieve financial goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Create custom budgets for different categories and track your
                  progress. Set specific goals and get notified when you reach
                  them.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 pl-0 hover:bg-blue-50"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="group border-t-4 border-t-purple-500 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader>
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="group-hover:text-purple-700 transition-colors">
                  Visual Reports
                </CardTitle>
                <CardDescription>
                  Understand your finances at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Gain insights through intuitive charts and graphs that make
                  your financial data easy to understand and act upon.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700 pl-0 hover:bg-purple-50"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white p-8 shadow-lg relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
            <Badge className="bg-green-700 text-white border-green-500 mb-4 px-4 py-1 rounded-full text-sm font-medium">
              Take Action Today
            </Badge>
            <h2 className="text-3xl font-bold">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Join thousands of users who have transformed their financial
              habits with BudgetBuddy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-green-700 hover:bg-gray-100 shadow-md hover:shadow-lg transition-all">
                Get Started Now
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-green-700 transition-all"
              >
                View Plans
              </Button>
            </div>
            <div className="text-sm text-white/70 pt-4 flex items-center justify-center">
              <Star className="h-4 w-4 mr-1" fill="currentColor" />
              No credit card required • Free 14-day trial
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 mb-4 px-4 py-1 rounded-full text-sm font-medium"
          >
            Common Questions
          </Badge>
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <Button
            variant="outline"
            className="text-green-600 border-2 hover:bg-green-50"
          >
            View All FAQs <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </section>

        {/* Footer Accent */}
        <hr className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
        <div className="py-6 text-center text-sm text-gray-500">
          © 2025 BudgetBuddy. All rights reserved.
        </div>
      </div>
    </div>
  );
}
