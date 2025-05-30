// src/components/integrations/types.ts
import { ReactNode } from 'react';

export interface AdminFeature {
    id: string;
    name: string;
    icon: string;
    description: string;
}

export interface ContentCardProps {
    title: string;
    subheader: string;
    description: string;
    icon: string;
    color: string;
    buttonText: string;
    buttonColor?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    onClick: () => void;
}