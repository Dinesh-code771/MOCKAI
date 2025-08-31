'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookOpen,
  Calendar,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  Users,
  FileText,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/auth/actions';
import Link from 'next/link';

interface SidebarProps {
  role: 'student' | 'admin' | 'superadmin';
  currentPath: string;
}

const sidebarItems = {
  student: [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard/student' },
    {
      icon: Calendar,
      label: 'Schedule Interview',
      href: '/dashboard/student/schedule',
    },
    { icon: BookOpen, label: 'Take Test', href: '/dashboard/student/test' },
    { icon: Trophy, label: 'Results', href: '/dashboard/student/results' },
    {
      icon: Users,
      label: 'Leaderboard',
      href: '/dashboard/student/leaderboard',
    },
    { icon: Settings, label: 'Settings', href: '/dashboard/student/settings' },
  ],
  admin: [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard/admin' },
    { icon: Users, label: 'Students', href: '/dashboard/admin/students' },
    { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
  ],
  superadmin: [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard/superadmin' },
    {
      icon: Building,
      label: 'Workspaces',
      href: '/dashboard/superadmin/workspaces',
    },
    { icon: Users, label: 'Admins', href: '/dashboard/superadmin/admins' },
    {
      icon: ShieldCheck,
      label: 'Security',
      href: '/dashboard/superadmin/security',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/superadmin/settings',
    },
  ],
};

export function Sidebar({ role, currentPath }: SidebarProps) {
  const router = useRouter();
  const items = sidebarItems[role];

  const handleLogout = async () => {
    try {
      const result = await logoutAction();
      if (result.success) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect
      router.push('/auth/login');
    }
  };

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-screen bg-white/80 backdrop-blur-lg border-r border-white/20 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">EduPrep</h2>
            <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              John Doe
            </p>
            <p className="text-xs text-gray-500">john.doe@example.com</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return item.href === '/dashboard/student/test' ? (
            <button
              key={item.href}
              onClick={() => {
                router.push(item.href);
                router.refresh();
              }}
              className={cn(
                'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100/50 hover:text-gray-900',
              )}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </button>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100/50 hover:text-gray-900',
              )}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200/50">
        <button
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </motion.div>
  );
}
