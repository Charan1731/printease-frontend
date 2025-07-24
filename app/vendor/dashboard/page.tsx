'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Building, Users, FileText, Settings, LogOut, TrendingUp } from 'lucide-react';

function VendorDashboardContent() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-black text-cyan font-mono">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border border-cyan-400 flex items-center justify-center">
                <Terminal className="h-4 w-4 text-cyan-400" />
              </div>
              <span className="text-xl font-bold tracking-wider">PRINTEASE</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Building className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-400">{user?.companyName}</span>
              </div>
              <Button onClick={handleLogout} className="cyber-button h-9 px-4 text-xs">
                <LogOut className="h-3 w-3 mr-2" />
                LOGOUT
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tighter">VENDOR DASHBOARD</h1>
          <p className="text-zinc-400 text-sm uppercase tracking-wider">
            ENTERPRISE CONTROL PANEL
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'TOTAL CLIENTS', value: '0', icon: Users },
            { label: 'DOCUMENTS', value: '0', icon: FileText },
            { label: 'REVENUE', value: '$0', icon: TrendingUp },
            { label: 'ACTIVE JOBS', value: '0', icon: Terminal },
          ].map((stat, index) => (
            <Card key={index} className="bg-zinc-950 border border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="h-5 w-5 text-zinc-400" />
                  <div className="text-xs text-zinc-500 font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">{stat.value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-zinc-950 border border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-lg tracking-wider">CLIENT MANAGEMENT</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button className="w-full primary-button h-12 text-sm">
                <Users className="h-4 w-4 mr-2" />
                MANAGE CLIENTS
              </Button>
              <Button className="w-full cyber-button h-12 text-sm">
                <FileText className="h-4 w-4 mr-2" />
                VIEW DOCUMENTS
              </Button>
              <Button className="w-full cyber-button h-12 text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                ANALYTICS
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-lg tracking-wider">SYSTEM STATUS</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">API STATUS</span>
                  <span className="text-xs text-green-400 uppercase tracking-wider">ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">PROCESSING QUEUE</span>
                  <span className="text-xs text-cyan-400 uppercase tracking-wider">IDLE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">STORAGE</span>
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">0% USED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">LAST BACKUP</span>
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">NEVER</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function VendorDashboard() {
  return (
    <AuthGuard requiredUserType="vendor">
      <VendorDashboardContent />
    </AuthGuard>
  );
}