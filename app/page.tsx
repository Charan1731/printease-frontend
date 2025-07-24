'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Shield, Zap, Users, FileText, CheckCircle, Github, Mail, Phone, ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = user.userType === 'vendor' ? '/vendor/dashboard' : '/user/dashboard';
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, router]);

  const features = [
    {
      icon: Upload,
      title: 'UPLOAD',
      description: 'Instant PDF processing with advanced compression algorithms'
    },
    {
      icon: Shield,
      title: 'SECURE',
      description: 'Military-grade encryption with zero-knowledge architecture'
    },
    {
      icon: Zap,
      title: 'FAST',
      description: 'Sub-second processing with distributed computing power'
    },
    {
      icon: Users,
      title: 'SCALE',
      description: 'Enterprise-ready infrastructure for unlimited workflows'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'UPTIME' },
    { value: '<100ms', label: 'LATENCY' },
    { value: '256-BIT', label: 'ENCRYPTION' },
    { value: '24/7', label: 'SUPPORT' }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto px-4">
        <div className="glass-nav relative px-6 py-3 mx-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border border-cyan-400 flex items-center justify-center">
                <Terminal className="h-4 w-4 text-cyan-400" />
              </div>
              <span className="text-xl font-bold tracking-wider">PRINTEASE</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-zinc-400 hover:text-white transition-colors uppercase tracking-wide text-sm">
                FEATURES
              </Link>
              <Link href="#about" className="text-zinc-400 hover:text-white transition-colors uppercase tracking-wide text-sm">
                ABOUT
              </Link>
              <Link href="#contact" className="text-zinc-400 hover:text-white transition-colors uppercase tracking-wide text-sm">
                CONTACT
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button className="cyber-button h-9 px-4 text-xs">
                  {isAuthenticated ? 'DASHBOARD' : 'ACCESS'}
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="primary-button h-9 px-4 text-xs">
                  {isAuthenticated ? 'CONSOLE' : 'DEPLOY'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 data-grid opacity-20"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center px-4 py-2 border border-zinc-700 mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm text-zinc-400 uppercase tracking-wider">SYSTEM ONLINE</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-none tracking-tighter">
            PDF
            <br />
            <span className="text-cyan-400 glow-text">PROTOCOL</span>
          </h1>
          
          <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto font-mono">
            Advanced document processing system with quantum-level security protocols 
            and real-time synchronization capabilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/auth">
              <Button className="primary-button h-12 px-8 text-sm">
                INITIALIZE SYSTEM
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button className="cyber-button h-12 px-8 text-sm">
              VIEW DOCUMENTATION
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tighter">CORE MODULES</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Engineered for maximum efficiency and zero-compromise security.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="minimal-card futuristic-border cursor-pointer group"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <feature.icon className={`h-6 w-6 transition-colors duration-300 ${
                      hoveredFeature === index ? 'text-cyan-400' : 'text-zinc-400'
                    }`} />
                    <div className="text-xs text-zinc-500 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 tracking-wider">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 tracking-tighter">SYSTEM ARCHITECTURE</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Built on distributed microservices with containerized deployment 
                and auto-scaling capabilities for enterprise-grade performance.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Kubernetes orchestration',
                  'Redis caching layer',
                  'PostgreSQL clustering',
                  'Docker containerization',
                  'CI/CD automation',
                  'Monitoring & alerting'
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                    <span className="text-zinc-300 text-sm font-mono">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="bg-black border border-zinc-700 p-6 font-mono text-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-700">
                  <span className="text-cyan-400">terminal@printease:~$</span>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="space-y-2 text-zinc-300">
                  <div className="scan-line">
                    <span className="text-cyan-400">$</span> docker-compose up -d
                  </div>
                  <div className="text-green-400">✓ Database initialized</div>
                  <div className="text-green-400">✓ API gateway started</div>
                  <div className="text-green-400">✓ Load balancer active</div>
                  <div className="scan-line">
                    <span className="text-cyan-400">$</span> kubectl get pods
                  </div>
                  <div>NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS</div>
                  <div>printease-api-1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running</div>
                  <div>printease-api-2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running</div>
                  <div>printease-db&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running</div>
                  <div className="text-cyan-400 animate-pulse">█</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 tracking-tighter">READY TO DEPLOY?</h2>
          <p className="text-zinc-400 mb-8">
            Join the next generation of document processing systems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button className="primary-button h-12 px-8 text-sm">
                START DEPLOYMENT
              </Button>
            </Link>
            <Button className="cyber-button h-12 px-8 text-sm">
              CONTACT SUPPORT
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 border border-cyan-400 flex items-center justify-center">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-xl font-bold tracking-wider">PRINTEASE</span>
              </div>
              <p className="text-zinc-400 mb-4 text-sm">
                Advanced PDF processing protocol for enterprise systems.
              </p>
              <div className="flex space-x-4">
                <Github className="h-4 w-4 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
                <Mail className="h-4 w-4 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
                <Phone className="h-4 w-4 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold mb-4 tracking-wider">SYSTEM</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">FEATURES</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">PRICING</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">STATUS</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold mb-4 tracking-wider">RESOURCES</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">DOCS</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">GUIDES</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">EXAMPLES</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">SUPPORT</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold mb-4 tracking-wider">COMPANY</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">ABOUT</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">BLOG</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">CAREERS</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors">CONTACT</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
            <p className="text-zinc-500 text-sm font-mono">
              © 2025 PRINTEASE. ALL SYSTEMS OPERATIONAL.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}