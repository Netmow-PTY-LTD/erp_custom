/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MapEmbed } from "@/components/MapEmbed";
import { useAddSalesRouteMutation } from "@/store/features/salesRoute/salesRoute";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

// ---------------- Schema ----------------
const FormSchema = z.object({
  routeName: z.string().min(1),
  zoomLevel: z.number(),
  description: z.string().optional(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  end_location: z.string(),
  start_location: z.string(),
  postalCode: z.string(),
  centerLat: z.number(),
  centerLng: z.number(),
  coverageRadius: z.number(),
});



export default function CreateRoutePage() {
  const navigate = useNavigate()
  const [addRoute] = useAddSalesRouteMutation();

  //   const mapRef = useRef(null);
  //   const markerRef = useRef(null);
  //   const [map, setMap] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      routeName: "",
      zoomLevel: 12,
      description: "",
      country: "Malaysia",
      state: "Selangor",
      city: "Cyberjaya",
      postalCode: "63000",
      centerLat: 2.9253,
      centerLng: 101.6559,
      coverageRadius: 5,
      start_location: '',
      end_location: ''

    },
  });

  //   const watchLat = form.watch("centerLat");
  //   const watchLng = form.watch("centerLng");
  //   const watchZoom = form.watch("zoomLevel");

  //   // ---------------- MAP INIT ----------------
  //   useEffect(() => {
  //     if (!window.google || !mapRef.current) return;

  //     const initialCenter = {
  //       lat: watchLat,
  //       lng: watchLng,
  //     };

  //     const mapInstance = new window.google.maps.Map(mapRef.current, {
  //       center: initialCenter,
  //       zoom: watchZoom,
  //     });

  //     const marker = new window.google.maps.Marker({
  //       map: mapInstance,
  //       position: initialCenter,
  //       draggable: true,
  //     });

  //     marker.addListener("dragend", (e) => {
  //       form.setValue("centerLat", e.latLng.lat());
  //       form.setValue("centerLng", e.latLng.lng());
  //     });

  //     markerRef.current = marker;
  //     setMap(mapInstance);
  //   }, []);

  // ---------------- Use Pin Location ----------------
  //   const usePinLocation = () => {
  //     if (!markerRef.current) return;
  //     const pos = markerRef.current.getPosition();
  //     form.setValue("centerLat", pos.lat());
  //     form.setValue("centerLng", pos.lng());
  //   };

  // ---------------- Use Map Bounds Radius ----------------
  //   const useBoundsRadius = () => {
  //     if (!map) return;

  //     const bounds = map.getBounds();
  //     if (!bounds) return;

  //     const center = bounds.getCenter();
  //     const ne = bounds.getNorthEast();

  //     // Haversine formula
  //     const R = 6371;
  //     const dLat = ((ne.lat() - center.lat()) * Math.PI) / 180;
  //     const dLng = ((ne.lng() - center.lng()) * Math.PI) / 180;

  //     const lat1 = center.lat() * (Math.PI / 180);
  //     const lat2 = ne.lat() * (Math.PI / 180);

  //     const a =
  //       Math.sin(dLat / 2) ** 2 +
  //       Math.cos(lat1) *
  //         Math.cos(lat2) *
  //         Math.sin(dLng / 2) ** 2;

  //     const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //     form.setValue("coverageRadius", Number(distance.toFixed(2)));
  //   };

  // ---------------- Submit Payload ----------------
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {



    const res = await addRoute(data).unwrap()

    if (res.status) {
      toast.success(res.message || 'Route add successfull')
      navigate('/dashboard/sales/sales-routes')
    }

  };




  return (
    <div className="w-full">
      <Card className="w-full shadow-md">
        {/* ---------- Header ---------- */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <CardTitle className="text-xl sm:text-2xl font-semibold">
            Create Route
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* ---------- Row 1 ---------- */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-9">
                  <FormField
                    control={form.control}
                    name="routeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cyberjaya Road" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name="zoomLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoom Level</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ---------- Description ---------- */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ---------- Row 2 ---------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {["country", "state", "city", "postalCode"].map((name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">{name}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* ---------- Start / End Location ---------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Cyberjaya Gate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Putrajaya Sentral" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ---------- Lat / Lng ---------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="centerLat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Center Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="centerLng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Center Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ---------- Coverage Radius ---------- */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="coverageRadius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coverage Radius (km)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-9 flex flex-col sm:flex-row gap-3">
                  <Button type="button">Use Pin Location</Button>
                  <Button type="button">Use Map Bounds Radius</Button>
                </div>
              </div>

              {/* ---------- Map ---------- */}
              <div className="h-[250px] sm:h-[350px] md:h-[450px] w-full">
                <MapEmbed />
              </div>

              {/* ---------- Submit ---------- */}
              <div className="flex justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>

  );
}
