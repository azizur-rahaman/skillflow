/**
 * Device Settings Component
 * Device selection dropdown for audio and video settings
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings, Mic, Video, Volume2, Monitor } from "lucide-react";
import { AudioDevice, VideoDevice } from "../../types";
import { cn } from "@/lib/utils";

interface DeviceSettingsProps {
  audioDevices: AudioDevice[];
  videoDevices: VideoDevice[];
  selectedAudioDevice: string | null;
  selectedVideoDevice: string | null;
  onSelectAudioDevice: (deviceId: string) => void;
  onSelectVideoDevice: (deviceId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const DeviceSettings: React.FC<DeviceSettingsProps> = ({
  audioDevices,
  videoDevices,
  selectedAudioDevice,
  selectedVideoDevice,
  onSelectAudioDevice,
  onSelectVideoDevice,
  isOpen,
  onToggle,
  className,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Card
      className={cn(
        "absolute top-16 right-4 w-80 bg-card/95 backdrop-blur-sm border border-border/50 shadow-xl z-50",
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Device Settings</h3>
        </div>

        <div className="space-y-4">
          {/* Audio input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Mic className="w-4 h-4" />
              Microphone
            </Label>
            <Select
              value={selectedAudioDevice || ""}
              onValueChange={onSelectAudioDevice}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select microphone" />
              </SelectTrigger>
              <SelectContent>
                {audioDevices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    <div className="flex items-center gap-2">
                      <span>{device.label}</span>
                      {device.isDefault && (
                        <span className="text-xs text-muted-foreground">
                          (Default)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audio output */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Volume2 className="w-4 h-4" />
              Speaker
            </Label>
            <Select defaultValue="">
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select speaker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">System Default</SelectItem>
                {/* Additional speaker devices would be listed here */}
              </SelectContent>
            </Select>
          </div>

          {/* Video input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Video className="w-4 h-4" />
              Camera
            </Label>
            <Select
              value={selectedVideoDevice || ""}
              onValueChange={onSelectVideoDevice}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                {videoDevices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    <div className="flex items-center gap-2">
                      <span>{device.label}</span>
                      {device.isDefault && (
                        <span className="text-xs text-muted-foreground">
                          (Default)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Screen share info */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Monitor className="w-4 h-4" />
              Screen Share
            </Label>
            <p className="text-xs text-muted-foreground">
              When sharing your screen, select which screen or application to
              share.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={onToggle}>
            Close
          </Button>
        </div>
      </div>
    </Card>
  );
};
