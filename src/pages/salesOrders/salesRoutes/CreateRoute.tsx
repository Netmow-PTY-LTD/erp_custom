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

// ---------------- Schema ----------------
const FormSchema = z.object({
  routeName: z.string().min(1),
  zoomLevel: z.number(),
  description: z.string().optional(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
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

    console.log('payload data ==>', data)

    const res = await addRoute(data).unwrap()

    if (res.status) {


      toast.success(res.message || 'Route add successfull')
      navigate('/dashboard/sales/sales-routes')
    }

  };




  return (
    <div className="w-full">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Create Route</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* ---------- Row 1 ---------- */}
              <div className="grid grid-cols-12 gap-4">
                <FormField
                  control={form.control}
                  name="routeName"
                  render={({ field }) => (
                    <FormItem className="col-span-9">
                      <FormLabel>Route Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Cyberjaya Road" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zoomLevel"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
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
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        State
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        Postal Code
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ---------- Row 3 (Lat/Lng) ---------- */}
              <div className="grid grid-cols-12 gap-4">
                <FormField
                  control={form.control}
                  name="centerLat"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
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
                    <FormItem className="col-span-6">
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

              {/* ---------- Row 4 (Coverage Radius) ---------- */}
              <div className="grid grid-cols-12 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="coverageRadius"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
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

                <div className="col-span-9 flex gap-3">
                  <Button type="button" onClick={() => alert("Use Pin Location")}>
                    Use Pin Location
                  </Button>

                  <Button type="button" onClick={() => alert("Use Map Bounds Radius")}>
                    Use Map Bounds Radius
                  </Button>
                </div>
              </div>

              {/* ---------- Google Map ---------- */}
              <div className="mb-4">
                <MapEmbed />
              </div>

              {/* ---------- Submit ---------- */}
              <div className="flex justify-end">
                <Button type="submit">Create</Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
