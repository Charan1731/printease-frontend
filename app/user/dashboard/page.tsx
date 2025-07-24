'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Upload, FileText, Settings, LogOut, User } from 'lucide-react';
import Link from 'next/link';

function UserDashboardContent() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
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
                <User className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-400">{user?.fullName}</span>
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
          <h1 className="text-3xl font-bold mb-2 tracking-tighter">USER DASHBOARD</h1>
          <p className="text-zinc-400 text-sm uppercase tracking-wider">
            SYSTEM STATUS: OPERATIONAL
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'TOTAL UPLOADS', value: '0', icon: Upload },
            { label: 'PROCESSED', value: '0', icon: FileText },
            { label: 'PENDING', value: '0', icon: Settings },
            { label: 'STORAGE USED', value: '0 MB', icon: Terminal },
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-zinc-950 border border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-lg tracking-wider">QUICK ACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button className="w-full primary-button h-12 text-sm">
                <Upload className="h-4 w-4 mr-2" />
                UPLOAD PDF
              </Button>
              <Button className="w-full cyber-button h-12 text-sm">
                <FileText className="h-4 w-4 mr-2" />
                VIEW DOCUMENTS
              </Button>
              <Button className="w-full cyber-button h-12 text-sm">
                <Settings className="h-4 w-4 mr-2" />
                ACCOUNT SETTINGS
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-lg tracking-wider">RECENT ACTIVITY</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center text-zinc-500 py-8">
                <Terminal className="h-8 w-8 mx-auto mb-4 opacity-50" />
                <p className="text-sm uppercase tracking-wider">NO RECENT ACTIVITY</p>
                <p className="text-xs mt-2">Upload your first PDF to get started</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <AuthGuard requiredUserType="user">
      <UserDashboardContent />
    </AuthGuard>
  );
}