'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Mail, ArrowLeft, UserX, Shield } from 'lucide-react';
import Link from 'next/link';

export default function SocialAuthFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 backdrop-blur-lg border-white/20 shadow-xl">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
            >
              <UserX className="h-8 w-8 text-red-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              User Not Found
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              We couldn't find an account with this email address
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800 mb-1">
                    Authentication Failed
                  </h4>
                  <p className="text-sm text-red-700">
                    The email address associated with your social account is not
                    registered in our system.
                  </p>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800 mb-1">
                    What you can do:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Contact your administrator to create an account</li>
                    <li>• Use a different email address if available</li>
                    <li>• Try signing in with a different method</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                asChild
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Link href="/auth/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </div>

            {/* Contact Support */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                Need help? Contact support
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                support@mockai.com
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
