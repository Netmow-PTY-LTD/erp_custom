import { useEffect, useRef, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onAddressSelect: (details: {
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        latitude: number;
        longitude: number;
    }) => void;
}

export const AddressAutocomplete = forwardRef<HTMLInputElement, AddressAutocompleteProps>(
    ({ className, onAddressSelect, ...props }, ref) => {
        const { isLoaded, loadError } = useGoogleMapsScript();
        const internalRef = useRef<HTMLInputElement>(null);

        // Initialize Autocomplete
        useEffect(() => {
            if (!isLoaded || !internalRef.current) return;

            try {
                const autocomplete = new window.google.maps.places.Autocomplete(internalRef.current, {
                    fields: ["address_components", "formatted_address", "geometry", "name"],
                    types: ["address"],
                });

                const listener = autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();

                    if (!place || !place.address_components || !place.geometry) {
                        return;
                    }

                    let address = "";
                    let streetNumber = "";
                    let route = "";
                    let city = "";
                    let state = "";
                    let postalCode = "";
                    let country = "";

                    // Extract address components
                    place.address_components.forEach((component: any) => {
                        const types = component.types;

                        if (types.includes("street_number")) {
                            streetNumber = component.long_name;
                        }
                        if (types.includes("route")) {
                            route = component.long_name;
                        }
                        if (types.includes("locality")) {
                            city = component.long_name;
                        }
                        // Fallback for city if locality is missing
                        if (!city && types.includes("sublocality_level_1")) {
                            city = component.long_name;
                        }

                        if (types.includes("administrative_area_level_1")) {
                            state = component.long_name;
                        }
                        if (types.includes("postal_code")) {
                            postalCode = component.long_name;
                        }
                        if (types.includes("country")) {
                            country = component.long_name;
                        }
                    });

                    address = `${streetNumber} ${route}`.trim();
                    // If no specific street used, fall back toFormatted address or name
                    if (!address && place.name) {
                        address = place.name;
                    }

                    onAddressSelect({
                        address,
                        city,
                        state,
                        postalCode,
                        country,
                        latitude: place.geometry.location?.lat() || 0,
                        longitude: place.geometry.location?.lng() || 0,
                    });
                });

                // Cleanup
                return () => {
                    google.maps.event.removeListener(listener);
                    // google.maps.event.clearInstanceListeners(autocomplete);
                };
            } catch (error) {
                console.error("Error initializing Google Maps Autocomplete", error);
            }
        }, [isLoaded, onAddressSelect]);

        // Forward ref handling
        useEffect(() => {
            if (!ref) return;

            if (typeof ref === 'function') {
                ref(internalRef.current);
            } else {
                // Safe cast for mutable ref
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = internalRef.current;
            }
        }, [ref]);

        if (loadError) {
            return (
                <Input
                    ref={internalRef}
                    placeholder="Error loading maps"
                    disabled
                    className={cn("border-red-500", className)}
                    {...props}
                />
            );
        }

        return (
            <Input
                ref={internalRef}
                placeholder={props.placeholder || "Start typing address..."}
                className={className}
                {...props}
            />
        );
    }
);

AddressAutocomplete.displayName = "AddressAutocomplete";
