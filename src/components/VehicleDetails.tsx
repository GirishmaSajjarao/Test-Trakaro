
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Fuel, 
  Activity, 
  Calendar,
  Truck,
  Settings 
} from 'lucide-react';

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

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onBack: () => void;
  onUpdate: (vehicle: Vehicle) => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle, onBack, onUpdate }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState(vehicle);

  const handleUpdateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedVehicle);
    setIsEditDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-red-500';
      case 'idle': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'maintenance': return 'destructive';
      case 'idle': return 'secondary';
      default: return 'outline';
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Vehicles</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{vehicle.name}</h1>
                  <p className="text-gray-600 font-mono">{vehicle.licensePlate}</p>
                </div>
              </div>
            </div>
            
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Vehicle</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Vehicle Details</DialogTitle>
                  <DialogDescription>
                    Update the information for {vehicle.name}.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateVehicle} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Vehicle Name</Label>
                    <Input
                      id="edit-name"
                      value={editedVehicle.name}
                      onChange={(e) => setEditedVehicle({...editedVehicle, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-plate">License Plate</Label>
                    <Input
                      id="edit-plate"
                      value={editedVehicle.licensePlate}
                      onChange={(e) => setEditedVehicle({...editedVehicle, licensePlate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-model">Vehicle Model</Label>
                    <Input
                      id="edit-model"
                      value={editedVehicle.model}
                      onChange={(e) => setEditedVehicle({...editedVehicle, model: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Current Location</Label>
                    <Input
                      id="edit-location"
                      value={editedVehicle.location}
                      onChange={(e) => setEditedVehicle({...editedVehicle, location: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={editedVehicle.status} 
                      onValueChange={(value: 'active' | 'maintenance' | 'idle') => 
                        setEditedVehicle({...editedVehicle, status: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-fuel">Fuel Level (%)</Label>
                      <Input
                        id="edit-fuel"
                        type="number"
                        min="0"
                        max="100"
                        value={editedVehicle.fuelLevel}
                        onChange={(e) => setEditedVehicle({...editedVehicle, fuelLevel: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-mileage">Mileage</Label>
                      <Input
                        id="edit-mileage"
                        type="number"
                        min="0"
                        value={editedVehicle.mileage}
                        onChange={(e) => setEditedVehicle({...editedVehicle, mileage: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-maintenance">Last Maintenance</Label>
                    <Input
                      id="edit-maintenance"
                      type="date"
                      value={editedVehicle.lastMaintenance}
                      onChange={(e) => setEditedVehicle({...editedVehicle, lastMaintenance: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`} />
            </CardHeader>
            <CardContent>
              <Badge variant={getStatusVariant(vehicle.status)} className="text-sm">
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fuel Level</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getFuelLevelColor(vehicle.fuelLevel)}`}>
                {vehicle.fuelLevel}%
              </div>
              <p className="text-xs text-muted-foreground">Current level</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mileage</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicle.mileage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total distance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Maintenance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(vehicle.lastMaintenance).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">Service date</p>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Vehicle Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Vehicle Name</Label>
                  <p className="text-sm font-medium">{vehicle.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">License Plate</Label>
                  <p className="text-sm font-medium font-mono">{vehicle.licensePlate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Model</Label>
                  <p className="text-sm font-medium">{vehicle.model}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Vehicle ID</Label>
                  <p className="text-sm font-medium text-gray-400">#{vehicle.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location & Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Current Location</Label>
                <p className="text-sm font-medium flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{vehicle.location || 'Location not available'}</span>
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Operational Status</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`} />
                  <span className="text-sm font-medium">
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance & Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Maintenance & Performance</span>
            </CardTitle>
            <CardDescription>Track vehicle maintenance and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Fuel Efficiency</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getFuelLevelColor(vehicle.fuelLevel).replace('text-', 'bg-')}`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{vehicle.fuelLevel}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Maintenance Status</Label>
                <Badge variant={vehicle.status === 'maintenance' ? 'destructive' : 'default'}>
                  {vehicle.status === 'maintenance' ? 'Maintenance Required' : 'Good Condition'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Next Service</Label>
                <p className="text-sm font-medium">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleDetails;
