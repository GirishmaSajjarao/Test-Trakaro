
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  Plus, 
  MapPin, 
  Fuel, 
  Activity, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';
import VehiclePanel from '@/components/VehiclePanel';
import VehicleDetails from '@/components/VehicleDetails';
import ProfilePage from '@/components/ProfilePage';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
  status: 'active' | 'maintenance' | 'idle';
  location: string;
  fuelLevel: number;
  mileage: number;
  lastMaintenance: string;
}

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      // Placeholder for now - will implement real API call later
      // In a real implementation, we would fetch vehicles from Supabase
      // For now, let's just set some sample data
      setVehicles([
        {
          id: '1',
          name: 'Fleet Vehicle 001',
          licensePlate: 'ABC-123',
          model: 'Ford Transit',
          status: 'active',
          location: 'Downtown District',
          fuelLevel: 75,
          mileage: 45230,
          lastMaintenance: '2024-01-15'
        },
        {
          id: '2',
          name: 'Fleet Vehicle 002',
          licensePlate: 'XYZ-456',
          model: 'Mercedes Sprinter',
          status: 'maintenance',
          location: 'Service Center',
          fuelLevel: 20,
          mileage: 67890,
          lastMaintenance: '2024-01-10'
        },
        {
          id: '3',
          name: 'Fleet Vehicle 003',
          licensePlate: 'DEF-789',
          model: 'Iveco Daily',
          status: 'idle',
          location: 'Main Depot',
          fuelLevel: 90,
          mileage: 23456,
          lastMaintenance: '2024-01-20'
        }
      ]);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDetails(true);
  };

  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    setSelectedVehicle(updatedVehicle);
  };

  const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>) => {
    const vehicle: Vehicle = {
      ...newVehicle,
      id: Date.now().toString()
    };
    setVehicles([...vehicles, vehicle]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-red-500';
      case 'idle': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  if (showVehicleDetails && selectedVehicle) {
    return (
      <VehicleDetails 
        vehicle={selectedVehicle} 
        onBack={() => setShowVehicleDetails(false)}
        onUpdate={handleUpdateVehicle}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Truck className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cartrack Dashboard</h1>
                <p className="text-gray-600">Fleet Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {profile && (
                <span className="text-sm text-gray-600 mr-2">
                  Welcome, {profile.name}
                </span>
              )}
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Profile</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vehicles.length}</div>
                  <p className="text-xs text-muted-foreground">Active fleet size</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {vehicles.filter(v => v.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Currently on road</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {vehicles.filter(v => v.status === 'maintenance').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Needs attention</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Fuel Level</CardTitle>
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {vehicles.length > 0 
                      ? Math.round(vehicles.reduce((acc, v) => acc + v.fuelLevel, 0) / vehicles.length)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Fleet average</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Vehicle Activity</CardTitle>
                <CardDescription>Latest updates from your fleet</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : vehicles.length > 0 ? (
                  <div className="space-y-4">
                    {vehicles.slice(0, 3).map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`} />
                          <div>
                            <p className="font-medium">{vehicle.name}</p>
                            <p className="text-sm text-gray-600">{vehicle.licensePlate} • {vehicle.location}</p>
                          </div>
                        </div>
                        <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                          {vehicle.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No vehicle activity to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="mt-6">
            <VehiclePanel 
              vehicles={vehicles} 
              onViewVehicle={handleViewVehicle}
              onAddVehicle={handleAddVehicle}
            />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Reports</CardTitle>
                <CardDescription>Comprehensive analytics and reporting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Reports Coming Soon</h3>
                  <p className="text-gray-600">Advanced reporting and analytics features will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfilePage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
