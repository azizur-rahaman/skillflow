'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Mentor Profile Page
 * Individual mentor profile with booking interface
 */

import { MentorBookingProvider } from "@/features/mentor-marketplace/context";
import { MentorProfileView } from "@/features/mentor-marketplace/presentation";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Mock data - in real app, this would come from API based on mentor ID
const mockMentor: any = {
  id: "1",
  name: "Sarah Chen",
  title: "Senior Software Engineer at Google",
  avatar: "/avatars/sarah-chen.jpg",
  bio: "10+ years in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about mentoring junior developers and helping them navigate their career paths in tech.",
  rating: 4.9,
  reviewCount: 127,
  hourlyRate: 120,
  currency: "USD",
  expertise: ["React", "Node.js", "TypeScript", "AWS", "System Design"],
  categories: ["technology", "engineering"],
  languages: ["English", "Mandarin"],
  experience: 10,
  company: "Google",
  education: ["Stanford University - Computer Science"],
  certifications: [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional",
  ],
  skills: [
    "React",
    "Node.js",
    "TypeScript",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
  ],
  availability: "available" as const,
  responseTime: "within 2 hours",
  totalSessions: 156,
  successRate: 98,
  verified: true,
  featured: true,
  location: "San Francisco, CA",
  timezone: "PST",
};

const mockReviews = [
  {
    id: "1",
    mentorId: "1",
    userId: "user1",
    userName: "John Developer",
    rating: 5,
    comment:
      "Sarah was incredibly helpful in explaining complex React concepts. Her code examples were clear and practical. She really took the time to understand my learning goals and tailored the session accordingly.",
    sessionType: "1-on-1" as const,
    createdAt: new Date("2024-01-15"),
    helpful: 12,
  },
  {
    id: "2",
    mentorId: "1",
    userId: "user2",
    userName: "Maria Engineer",
    rating: 5,
    comment:
      "Great session on system design patterns. Sarah has deep knowledge and explains things very well. The session was well-structured and I learned a lot about scalable architecture.",
    sessionType: "1-on-1" as const,
    createdAt: new Date("2024-01-10"),
    helpful: 8,
  },
  {
    id: "3",
    mentorId: "1",
    userId: "user3",
    userName: "Alex Junior",
    rating: 4,
    comment:
      "Very patient and knowledgeable. Helped me understand AWS architecture concepts that were confusing me. Would definitely book again for more advanced topics.",
    sessionType: "1-on-1" as const,
    createdAt: new Date("2024-01-08"),
    helpful: 15,
  },
];

const mockAvailableDates = [
  {
    date: new Date(),
    timeSlots: [
      {
        id: "1",
        startTime: "09:00",
        endTime: "10:00",
        available: true,
        price: 120,
        currency: "USD",
      },
      {
        id: "2",
        startTime: "10:00",
        endTime: "11:00",
        available: true,
        price: 120,
        currency: "USD",
      },
      {
        id: "3",
        startTime: "14:00",
        endTime: "15:00",
        available: true,
        price: 120,
        currency: "USD",
      },
      {
        id: "4",
        startTime: "15:00",
        endTime: "16:00",
        available: false,
        price: 120,
        currency: "USD",
      },
      {
        id: "5",
        startTime: "16:00",
        endTime: "17:00",
        available: true,
        price: 120,
        currency: "USD",
      },
    ],
    isAvailable: true,
  },
  {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    timeSlots: [
      {
        id: "6",
        startTime: "11:00",
        endTime: "12:00",
        available: true,
        price: 120,
        currency: "USD",
      },
      {
        id: "7",
        startTime: "13:00",
        endTime: "14:00",
        available: true,
        price: 120,
        currency: "USD",
      },
      {
        id: "8",
        startTime: "16:00",
        endTime: "17:00",
        available: true,
        price: 120,
        currency: "USD",
      },
    ],
    isAvailable: true,
  },
  {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    timeSlots: [
      {
        id: "9",
        startTime: "10:00",
        endTime: "11:00",
        available: true,
        price: 120,
        currency: "USD",
      },
      {
        id: "10",
        startTime: "14:00",
        endTime: "15:00",
        available: true,
        price: 120,
        currency: "USD",
      },
      {
        id: "11",
        startTime: "15:00",
        endTime: "16:00",
        available: true,
        price: 120,
        currency: "USD",
      },
    ],
    isAvailable: true,
  },
];

function MentorProfileContent() {
  const router = useRouter();
  const [mentor] = useState(mockMentor);
  const [reviews] = useState(mockReviews);
  const [availableDates] = useState(mockAvailableDates);

  const handleBookSession = (
    sessionType: "1-on-1" | "group" | "workshop" | "consultation"
  ) => {
    // In real app, this would trigger the booking flow
    console.log("Booking session:", sessionType);
  };

  const handleBack = () => {
    router.push("/mentor-marketplace");
  };

  return (
    <MentorProfileView
      mentor={mentor}
      reviews={reviews}
      availableDates={availableDates}
      onBookSession={handleBookSession}
      onBack={handleBack}
    />
  );
}

export default function MentorProfilePage() {
  return (
    <MentorBookingProvider>
      <MentorProfileContent />
    </MentorBookingProvider>
  );
}
