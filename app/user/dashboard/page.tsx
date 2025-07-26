'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Upload, FileText, Settings, LogOut, User, Download, Eye, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { FileUpload } from '@/components/ui/file-upload';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PDF {
  _id: string;
  filename: string;
  s3_url: string;
  fileSize: number;
  mimeType: string;
  pages: number;
  uploadedBy: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
  printType?: string;
}

function UserDashboardContent() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [isLoadingPdfs, setIsLoadingPdfs] = useState<Boolean>(true);
  const router = useRouter();
  const handleLogout = () => {
    logout();
  };

  const handleUpload =  async (file: File[]) => {

    setIsLoading(true);
    const token = localStorage.getItem("auth_token");
    if(!token){
      toast.error("Please login to upload a file");
      return;
    }

    try {

      const temp = file[0];
      if(!temp){
        toast.error("Please select a file to upload");
        return;
      }

      const formdata = new FormData();
      formdata.append('pdf',temp);

      const response = await fetch(`http://localhost:8080/api/v1/pdf/upload`, {
        method: 'POST',
        headers:{
          "Authorization":`Bearer ${token}`
        },
        body: formdata
      })

      if(!response.ok){
        toast.error("Failed to upload file");
        return;
      }      

      toast.success("File uploaded successfully");
      // Refresh the PDF list after successful upload
      getUserPDF();
    } catch (error) {

      toast.error("Failed to upload file")
      
    }finally{
      setIsLoading(false);
      console.log('file uploaded successfully');
    }

  }

  useEffect(() => {
    if (user?.id) {
      getUserPDF();
    }
  }, [user?.id])

  const getUserPDF = async () => {
    setIsLoadingPdfs(true);
    try {
      const token = localStorage.getItem("auth_token");
      if(!token){
        toast.error("Please login to view your documents");
        return;
      }

      const userId = user?.id;
      if (!userId) return;

      const response = await fetch(`http://localhost:8080/api/v1/pdf/user/${userId}`,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      })

      if(!response.ok){
        toast.error("Failed to fetch documents");
        return;
      }
      const data = await response.json();
      console.log(data);
      setPdfs(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch documents");
    } finally {
      setIsLoadingPdfs(false);
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-zinc-400" />;
    }
  }

  const getTotalStorage = () => {
    const totalBytes = pdfs.reduce((sum, pdf) => sum + (pdf.fileSize || 0), 0);
    return formatFileSize(totalBytes);
  }

  const getStatusCounts = () => {
    const completed = pdfs.filter(pdf => pdf.status === 'completed').length;
    const pending = pdfs.filter(pdf => pdf.status === 'pending').length;
    const processing = pdfs.filter(pdf => pdf.status === 'processing').length;
    return { completed, pending, processing };
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border border-white-400 flex items-center justify-center">
                <Terminal className="h-4 w-4 text-white-400" />
              </div>
              <Link href="/">
                <span className="text-xl font-bold tracking-wider">PRINTEASE</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-400">{user?.name}</span>
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
          {(() => {
            const { completed, pending, processing } = getStatusCounts();
            const stats = [
              { label: 'TOTAL UPLOADS', value: pdfs.length.toString(), icon: Upload },
              { label: 'COMPLETED', value: completed.toString(), icon: CheckCircle },
              { label: 'PENDING', value: pending.toString(), icon: Clock },
              { label: 'STORAGE USED', value: getTotalStorage(), icon: Terminal },
            ];
            return stats.map((stat, index) => (
              <Card key={index} className="bg-zinc-950 border border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="h-5 w-5 text-zinc-400" />
                    <div className="text-xs text-zinc-500 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white-400 mb-1">{stat.value}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                </CardContent>
              </Card>
            ));
          })()}
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <Card className="bg-zinc-950 border border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-lg tracking-wider">UPLOAD NEW DOCUMENT</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FileUpload onChange={handleUpload} />
              {isLoading && (
                <div className="mt-4 text-center text-zinc-400 text-sm">
                  <Terminal className="h-4 w-4 inline mr-2 animate-pulse" />
                  UPLOADING...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Documents Section */}
        <Card className="bg-zinc-950 border border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="text-lg tracking-wider flex items-center justify-between">
              YOUR DOCUMENTS
              <span className="text-xs text-zinc-500 font-mono">
                {pdfs.length} TOTAL
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingPdfs ? (
              <div className="text-center text-zinc-500 py-12">
                <Terminal className="h-8 w-8 mx-auto mb-4 animate-pulse" />
                <p className="text-sm uppercase tracking-wider">LOADING DOCUMENTS...</p>
              </div>
            ) : pdfs.length === 0 ? (
              <div className="text-center text-zinc-500 py-12">
                <FileText className="h-8 w-8 mx-auto mb-4 opacity-50" />
                <p className="text-sm uppercase tracking-wider">NO DOCUMENTS FOUND</p>
                <p className="text-xs mt-2">Upload your first PDF to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {pdfs.map((pdf, index) => (
                  <div key={pdf._id} className="p-6 hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="h-5 w-5 text-zinc-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                                                       <h3 className="text-sm font-medium text-white truncate">
                             {pdf.filename}
                           </h3>
                           <div className="flex items-center space-x-4 mt-1 text-xs text-zinc-500">
                             <span>UPLOADED: {formatDate(pdf.createdAt)}</span>
                             <span>SIZE: {formatFileSize(pdf.fileSize)}</span>
                             <span>PAGES: {pdf.pages}</span>
                             {pdf.printType && <span>TYPE: {pdf.printType}</span>}
                           </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(pdf.status)}
                          <span className="text-xs uppercase tracking-wider text-zinc-400">
                            {pdf.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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