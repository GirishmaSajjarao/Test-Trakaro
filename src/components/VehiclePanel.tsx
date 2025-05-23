
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, MapPin, Fuel, Activity } from 'lucide-react';

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

interface VehiclePanelProps {
  vehicles: Vehicle[];
  onViewVehicle: (vehicle: Vehicle) => void;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
}

const VehiclePanel: React.FC<VehiclePanelProps> = ({ vehicles, onViewVehicle, onAddVehicle }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    name: '',
    licensePlate: '',
    model: '',
    status: 'idle',
    location: '',
    fuelLevel: 100,
    mileage: 0,
    lastMaintenance: new Date().toISOString().split('T')[0]
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVehicle.name && newVehicle.licensePlate && newVehicle.model) {
      onAddVehicle(newVehicle);
      setNewVehicle({
        name: '',
        licensePlate: '',
        model: '',
        status: 'idle',
        location: '',
        fuelLevel: 100,
        mileage: 0,
        lastMaintenance: new Date().toISOString().split('T')[0]
      });
      setIsAddDialogOpen(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Header with Add Vehicle Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
          <p className="text-gray-600">Manage your fleet vehicles and their information</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Vehicle</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Enter the details for the new vehicle to add to your fleet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-name">Vehicle Name</Label>
                <Input
                  id="vehicle-name"
                  placeholder="e.g., Fleet Vehicle 004"
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="license-plate">License Plate</Label>
                <Input
                  id="license-plate"
                  placeholder="e.g., ABC-123"
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Vehicle Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., Ford Transit"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Main Depot"
                  value={newVehicle.location}
                  onChange={(e) => setNewVehicle({...newVehicle, location: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newVehicle.status} 
                  onValueChange={(value: 'active' | 'maintenance' | 'idle') => 
                    setNewVehicle({...newVehicle, status: value})
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
                  <Label htmlFor="fuel">Fuel Level (%)</Label>
                  <Input
                    id="fuel"
                    type="number"
                    min="0"
                    max="100"
                    value={newVehicle.fuelLevel}
                    onChange={(e) => setNewVehicle({...newVehicle, fuelLevel: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({...newVehicle, mileage: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Vehicle
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                  <CardDescription className="font-mono">{vehicle.licensePlate}</CardDescription>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Model:</strong> {vehicle.model}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{vehicle.location || 'Unknown Location'}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Fuel className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Fuel</p>
                    <p className="text-sm font-medium">{vehicle.fuelLevel}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">Mileage</p>
                    <p className="text-sm font-medium">{vehicle.mileage.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Badge variant={getStatusVariant(vehicle.status)}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewVehicle(vehicle)}
                  className="flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Added</h3>
            <p className="text-gray-600 mb-4">Start by adding your first vehicle to the fleet.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehiclePanel;
