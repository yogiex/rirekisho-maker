import { createContext } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { RirekishoData } from '@/lib/schema/rirekisho-schema';

export const DraftFormContext = createContext<UseFormReturn<RirekishoData> | null>(null);
