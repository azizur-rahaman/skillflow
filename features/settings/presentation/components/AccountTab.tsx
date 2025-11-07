"use client";

import React, { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Globe,
  Building,
  Briefcase,
  Camera,
  Save,
  Loader2,
} from "lucide-react";

export function AccountTab() {
  const { userProfile, updateProfile, isUpdating } = useSettings();
  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    bio: userProfile?.bio || "",
    location: userProfile?.location || "",
    website: userProfile?.website || "",
    company: userProfile?.company || "",
    jobTitle: userProfile?.jobTitle || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={userProfile.avatar}
                alt={userProfile.firstName}
              />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {userProfile.firstName[0]}
                {userProfile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-border bg-card hover:bg-muted"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-foreground">
              {userProfile.firstName} {userProfile.lastName}
            </h2>
            <p className="text-muted-foreground mt-1">{userProfile.email}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Member since {userProfile.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6 bg-card border-border rounded-2xl">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-foreground"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="rounded-xl bg-input border-border"
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-foreground"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="rounded-xl bg-input border-border"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label
              htmlFor="bio"
              className="text-sm font-medium text-foreground"
            >
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              className="rounded-xl bg-input border-border resize-none"
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
        </Card>

        {/* Professional Information */}
        <Card className="p-6 bg-card border-border rounded-2xl">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="jobTitle"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Job Title
              </Label>
              <Input
                id="jobTitle"
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
                className="rounded-xl bg-input border-border"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Building className="w-4 h-4" />
                Company
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="rounded-xl bg-input border-border"
                placeholder="e.g. Tech Corp"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="rounded-xl bg-input border-border"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                className="rounded-xl bg-input border-border"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isUpdating}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
