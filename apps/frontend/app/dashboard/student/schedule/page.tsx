'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock,
  User,
  MapPin,
  Calendar as CalendarIcon,
  CheckCircle,
  Star,
  Video,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

const interviewTypes = [
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Coding challenges and technical questions',
    duration: '60 minutes',
    color: 'bg-blue-500',
  },
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Situational and behavioral questions',
    duration: '45 minutes',
    color: 'bg-purple-500',
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Architecture and design discussions',
    duration: '90 minutes',
    color: 'bg-green-500',
  },
];

const availableSlots = [
  { time: '09:00 AM', available: true },
  { time: '10:30 AM', available: false },
  { time: '02:00 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '06:00 PM', available: false },
];

const interviewers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Software Engineer',
    company: 'Google',
    rating: 4.9,
    reviews: 156,
    avatar: '/placeholder-avatar.jpg',
    specialties: ['React', 'JavaScript', 'System Design'],
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Engineering Manager',
    company: 'Meta',
    rating: 4.8,
    reviews: 203,
    avatar: '/placeholder-avatar.jpg',
    specialties: ['Leadership', 'Behavioral', 'Career Growth'],
  },
  {
    id: 3,
    name: 'Alex Rivera',
    role: 'Principal Engineer',
    company: 'Netflix',
    rating: 4.9,
    reviews: 89,
    avatar: '/placeholder-avatar.jpg',
    specialties: ['Algorithms', 'Data Structures', 'Optimization'],
  },
];

export default function ScheduleInterview() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedInterviewer, setSelectedInterviewer] = useState<number | null>(null);

  const handleSchedule = () => {
    if (!selectedDate || !selectedType || !selectedTime || !selectedInterviewer) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Interview scheduled successfully!');
  };

  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/schedule">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Schedule Interview</h1>
          <p className="text-gray-600">Book a mock interview session with industry experts</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interview Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle>Select Interview Type</CardTitle>
                <CardDescription>Choose the type of interview you'd like to practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {interviewTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${type.color}`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{type.title}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {type.duration}
                          </div>
                        </div>
                      </div>
                      {selectedType === type.id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Interviewer Selection */}
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle>Choose Your Interviewer</CardTitle>
                <CardDescription>Select from our pool of experienced professionals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {interviewers.map((interviewer) => (
                  <motion.div
                    key={interviewer.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedInterviewer === interviewer.id
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedInterviewer(interviewer.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={interviewer.avatar} />
                        <AvatarFallback>{interviewer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-800">{interviewer.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {interviewer.rating} ({interviewer.reviews})
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{interviewer.role} at {interviewer.company}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {interviewer.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedInterviewer === interviewer.id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Date and Time Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Available Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    className="w-full justify-start"
                    disabled={!slot.available}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                  >
                    {slot.time}
                    {!slot.available && <span className="ml-2 text-xs">(Booked)</span>}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Meeting Options */}
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle>Meeting Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Call
                </Button>
              </CardContent>
            </Card>

            {/* Schedule Button */}
            <Button
              onClick={handleSchedule}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              size="lg"
            >
              Schedule Interview
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}