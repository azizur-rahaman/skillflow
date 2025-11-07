/**
 * Video Call Index Page
 * Landing page for video calls - shows active sessions or creates new one
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Plus, Clock, Users } from "lucide-react";

export default function VideoCallIndexPage() {
  const router = useRouter();

  const handleCreateSession = () => {
    // Generate a random session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    router.push(`/video-call/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Video className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Video Calls</h1>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Connect with mentors and mentees through high-quality video sessions
          </p>
        </div>

        {/* Create New Session Card */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Start New Video Session
            </CardTitle>
            <CardDescription className="text-slate-400">
              Create a new video call session for mentoring or collaboration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCreateSession}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <Video className="w-4 h-4 mr-2" />
              Create Video Session
            </Button>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700">
            <CardHeader>
              <div className="p-2 bg-green-500/10 rounded-lg w-fit">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <CardTitle className="text-white text-lg">1-on-1 Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                Personal mentoring sessions for focused learning and growth
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700">
            <CardHeader>
              <div className="p-2 bg-purple-500/10 rounded-lg w-fit">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <CardTitle className="text-white text-lg">Group Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                Collaborative sessions with multiple participants
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700">
            <CardHeader>
              <div className="p-2 bg-cyan-500/10 rounded-lg w-fit">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <CardTitle className="text-white text-lg">Workshops</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                Interactive workshops and training sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
          <CardHeader>
            <CardTitle className="text-white">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-slate-300 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2" />
                <p>Click "Create Video Session" to generate a new meeting room</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                <p>Share the session link with your mentor or mentees</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
                <p>Join the call and start your collaborative session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
