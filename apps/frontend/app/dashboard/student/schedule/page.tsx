'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { assessmentApi } from '@/lib/api-client';
import {
  AssessmentsControllerGetAssessmentsListTypeEnum,
  AssessmentsControllerGetAssessmentsListDifficultyEnum,
  AssessmentsControllerGetAssessmentsListDraftAssessmentEnum,
} from '@mockai/sdk';

// Generate all time slots from 6 AM to 11 PM with 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 6; // 6 AM
  const endHour = 23; // 11 PM

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date();
      time.setHours(hour, minute, 0, 0);

      const timeString = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      // All slots are available
      slots.push({
        time: timeString,
        available: true,
      });
    }
  }

  return slots;
};

const availableSlots = generateTimeSlots();

interface Assessment {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  duration_minutes: number;
  description: string | null;
  max_score: number;
  total_questions: number;
  course: any;
}

export default function ScheduleInterview() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedInterview, setSelectedInterview] = useState<Assessment | null>(
    null,
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [interviews, setInterviews] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch available interviews on component mount
  useEffect(() => {
    fetchInterviews();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response =
        await assessmentApi.assessmentsControllerGetAssessmentsList({
          type: AssessmentsControllerGetAssessmentsListTypeEnum.Subjective,
          page: 1,
          limit: 20,
        });

      if (response.data?.assessments) {
        setInterviews(response.data.assessments);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load available interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!selectedInterview) {
      toast.error('Please select an interview');
      return;
    }
    if (!selectedDate || !selectedTime) {
      frontend;
      toast.error('Please select both date and time');
      return;
    }

    // Parse the time string and combine with selected date
    const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) {
      toast.error('Invalid time format');
      return;
    }

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3].toUpperCase();

    // Convert 12-hour format to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    // Create a new date with the selected date and time
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    const response = await assessmentApi.assessmentsControllerStartAssessment({
      startAssessmentBodyDto: {
        assessmentId: selectedInterview.id,
        scheduleAt: scheduledDateTime,
      },
    });
    console.log(response);

    toast.success('Interview scheduled successfully!');
  };

  // Get calendar data for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const isDateDisabled = (date: Date) => {
    return (
      date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  const isDateSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/schedule">
      <div className="space-y-8 ">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Schedule Your Interview
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your preferred interview, date and time for your mock
            interview session
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Interview Selection Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full relative z-50"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8 relative z-50">
              <div className="text-center pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  Select Interview
                </h3>
                <p className="text-lg text-gray-600">
                  Choose the interview you want to take
                </p>
              </div>

              {/* Dropdown */}
              <div className="relative flex z-[9999] dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-4 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {selectedInterview ? (
                      <>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-lg text-gray-800">
                            {selectedInterview.name}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                selectedInterview.difficulty,
                              )}`}
                            >
                              {selectedInterview.difficulty}
                            </span>
                            <span>
                              {selectedInterview.duration_minutes} min •{' '}
                              {selectedInterview.total_questions} questions
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500">
                        {loading
                          ? 'Loading interviews...'
                          : 'Select an interview'}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full z-[99999] left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600">
                          Loading interviews...
                        </span>
                      </div>
                    ) : interviews.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No interviews available
                      </div>
                    ) : (
                      <div className="py-2 flex flex-col gap-2">
                        {interviews.map((interview) => (
                          <button
                            key={interview.id}
                            onClick={() => {
                              setSelectedInterview(interview);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full p-4 z-50 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-lg text-gray-800">
                                  {interview.name}
                                </h4>
                                {selectedInterview?.id === interview.id && (
                                  <CheckCircle className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {interview.description ||
                                  'No description available'}
                              </p>
                              <div className="flex items-center justify-between text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                    interview.difficulty,
                                  )}`}
                                >
                                  {interview.difficulty}
                                </span>
                                <span className="text-gray-500">
                                  {interview.duration_minutes} min •{' '}
                                  {interview.total_questions} questions
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Date and Time Selection - Side by Side */}
          <div className="flex flex-wrap gap-8 justify-center relative z-10">
            {/* Date Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 min-w-[400px]"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8">
                <div className="text-center pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                      <CalendarIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Select Date
                  </h3>
                  <p className="text-lg text-gray-600">
                    Pick the perfect day for your interview
                  </p>
                </div>

                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={
                      currentMonth <=
                      new Date(today.getFullYear(), today.getMonth(), 1)
                    }
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {monthNames[currentMonth.getMonth()]}{' '}
                    {currentMonth.getFullYear()}
                  </h4>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day ? (
                        <button
                          onClick={() =>
                            !isDateDisabled(day) && setSelectedDate(day)
                          }
                          disabled={isDateDisabled(day)}
                          className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 ${
                            isDateSelected(day)
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                              : isDateDisabled(day)
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                  ))}
                </div>

                {selectedDate && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Selected:{' '}
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Time Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1 min-w-[400px]"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8">
                <div className="text-center pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Select Time
                  </h3>
                  <p className="text-lg text-gray-600">
                    Choose your preferred time slot
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots.map((slot) => (
                      <motion.div
                        key={slot.time}
                        whileHover={slot.available ? { scale: 1.02 } : {}}
                        whileTap={slot.available ? { scale: 0.98 } : {}}
                      >
                        <button
                          className={`w-full h-14 text-base font-semibold transition-all duration-200 rounded-xl border-2 ${
                            !slot.available
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                              : selectedTime === slot.time
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg border-transparent'
                              : 'hover:bg-gray-50 hover:border-gray-300 border-gray-200 bg-white'
                          }`}
                          onClick={() =>
                            slot.available && setSelectedTime(slot.time)
                          }
                          disabled={!slot.available}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {selectedTime === slot.time && slot.available && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            <span>{slot.time}</span>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Schedule Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={handleSchedule}
              disabled={!selectedInterview || !selectedDate || !selectedTime}
              className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Schedule Interview
            </button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
