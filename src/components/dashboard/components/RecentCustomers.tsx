import { useGetCustomersQuery } from "@/store/features/customers/customersApi";
import type { Customer } from "@/store/features/customers/types";

import { useState } from "react";

export default function RecentCustomers() {
  const [page] = useState(1);
  const limit = 6;



  const { data, isLoading, error } = useGetCustomersQuery({
    page,
    limit,
  });

  const customers: Customer[] = data?.data?.slice(0, limit) || [];

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Failed to load customers</div>;
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => {
        const initials = (customer.name || "N A")
          .split(" ")
          .map((n: string) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <div key={customer.id} className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                {initials}
              </div>

              {/* Name, Company, Phone, Address */}
              <div className="min-w-0">
                <p className="text-sm font-medium leading-none">
                  {customer.name}
                </p>
                {customer.company && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {customer.company}
                  </p>
                )}
                {customer.phone && (
                  <p className="text-xs text-muted-foreground truncate">
                    {customer.phone}
                  </p>
                )}
                {customer.address && (
                  <p className="text-xs text-muted-foreground/70 truncate">
                    {customer.address}
                  </p>
                )}
              </div>
            </div>

            {/* Right Amount */}
            <div className="text-sm font-medium shrink-0 ml-3">
              {Number(customer?.total_sales || 0).toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
