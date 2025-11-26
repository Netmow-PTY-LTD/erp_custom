

import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

export type TUserPath = {
    title: string;
    url: string;
    icon?: React.ReactNode | ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
    items?: TUserPath[];
    element?: React.ReactNode;
    layout?: React.ReactNode;
};

export type TRoute = {
    path: string;
    element: React.ReactNode;
};
