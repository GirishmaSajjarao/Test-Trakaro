
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Camera,
  Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setEditedProfile({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        position: profile.position || '',
        address: profile.address || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  if (!profile || !editedProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!editedProfile.name || !editedProfile.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedProfile.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: editedProfile.name,
          email: editedProfile.email,
          phone: editedProfile.phone,
          company: editedProfile.company,
          position: editedProfile.position,
          address: editedProfile.address,
          avatar_url: editedProfile.avatar_url,
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      await refreshProfile();
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // For now, we'll just use FileReader to show the image
      // In a production app, we would upload to Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditedProfile({ ...editedProfile, avatar_url: imageUrl });
        
        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been updated. Don't forget to save your changes!",
          variant: "default"
        });
        setIsSubmitting(false);
      };
      reader.readAsDataURL(file);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile picture",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      company: profile.company || '',
      position: profile.position || '',
      address: profile.address || '',
      avatar_url: profile.avatar_url || '',
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges} 
              className="flex items-center space-x-2"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={isEditing ? editedProfile.avatar_url : profile.avatar_url} 
                    alt="Profile picture" 
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(isEditing ? editedProfile.name : profile.name)}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium">
                  {isEditing ? editedProfile.name : profile.name}
                </h3>
                <p className="text-gray-600">
                  {isEditing ? editedProfile.position : profile.position}
                </p>
                {isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 flex items-center space-x-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    <Camera className="h-4 w-4" />
                    <span>Upload Photo</span>
                  </Button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                </Label>
                <Input
                  id="name"
                  value={isEditing ? editedProfile.name : profile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  disabled={!isEditing || isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editedProfile.email : profile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  disabled={!isEditing || isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number</span>
                </Label>
                <Input
                  id="phone"
                  value={isEditing ? editedProfile.phone : profile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  disabled={!isEditing || isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Position</span>
                </Label>
                <Input
                  id="position"
                  value={isEditing ? editedProfile.position : profile.position}
                  onChange={(e) => setEditedProfile({ ...editedProfile, position: e.target.value })}
                  disabled={!isEditing || isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>Company</span>
                </Label>
                <Input
                  id="company"
                  value={isEditing ? editedProfile.company : profile.company}
                  onChange={(e) => setEditedProfile({ ...editedProfile, company: e.target.value })}
                  disabled={!isEditing || isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                </Label>
                <Input
                  id="address"
                  value={isEditing ? editedProfile.address : profile.address}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                  disabled={!isEditing || isSubmitting}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Change Password</h4>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <Button variant="outline">
                Change Password
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline">
                Enable 2FA
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Configure your notification preferences</p>
              </div>
              <Button variant="outline">
                Manage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
