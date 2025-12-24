"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  User, 
  Settings, 
  Navigation, 
  Info,
  Edit2
} from "lucide-react";
import { MapEmbed } from "@/components/MapEmbed";
import { useNavigate, useParams } from "react-router";
import { useGetSalesRouteByIdQuery } from "@/store/features/salesRoute/salesRoute";

export default function SalesRouteDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: route, isLoading, isError } = useGetSalesRouteByIdQuery(id as string);

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading route details...</div>;
  if (isError || !route) return <div className="p-8 text-center text-red-500">Failed to load route details.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{route.routeName}</h1>
            <p className="text-muted-foreground flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" /> {route.city}, {route.state}
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <Edit2 className="h-4 w-4" />
          Edit Route
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Map & Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-[400px] w-full bg-muted">
              <MapEmbed
                center={{ lat: route.centerLat, lng: route.centerLng }}
                zoom={route.zoomLevel}
                marker={{ lat: route.centerLat, lng: route.centerLng }}
                radius={route.coverageRadius}
              />
            </div>
            <CardContent className="p-6">
               <div className="flex items-center gap-2 mb-4">
                  <Navigation className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Route Path</h3>
               </div>
               <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="text-center flex-1">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">Start Point</p>
                    <p className="font-medium">{route.start_location}</p>
                  </div>
                  <div className="h-px flex-1 bg-border relative mx-4">
                     <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs uppercase text-muted-foreground font-semibold">End Point</p>
                    <p className="font-medium">{route.end_location}</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Description Section */}
          {route.description && (
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-primary" />
                  Route Description
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {route.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Metadata & Assignments */}
        <div className="space-y-6">
          {/* Geographic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Country" value={route.country} />
                <DetailItem label="Postal Code" value={route.postalCode} />
              </div>
              <Separator />
              <div className="space-y-3">
                 <h5 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                   <Settings className="h-3 w-3" /> Technical Specs
                 </h5>
                 <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-muted-foreground">Radius:</span>
                    <span className="font-mono font-medium text-right">{route.coverageRadius} km</span>
                    <span className="text-muted-foreground">Lat:</span>
                    <span className="font-mono font-medium text-right">{route.centerLat}</span>
                    <span className="text-muted-foreground">Lng:</span>
                    <span className="font-mono font-medium text-right">{route.centerLng}</span>
                    <span className="text-muted-foreground">Zoom:</span>
                    <span className="font-mono font-medium text-right">{route.zoomLevel}</span>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff Assignment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" /> Assigned Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {route.assignedStaff && route.assignedStaff.length > 0 ? (
                  route.assignedStaff.map((staff) => (
                    <Badge key={staff} variant="secondary" className="px-3 py-1 gap-1 font-normal">
                      <User className="h-3 w-3" /> {staff}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No staff assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Assignment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Customers ({route.assignedCustomers?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {route.assignedCustomers && route.assignedCustomers.length > 0 ? (
                  route.assignedCustomers.map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                      <span className="text-sm font-medium">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                        {c.coordinates[0]}, {c.coordinates[1]}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No customers assigned</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Small helper component for consistent labeling
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase">{label}</h4>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}