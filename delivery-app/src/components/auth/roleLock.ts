import { createContext } from 'react';

export type LockedRole = 'restaurant' | 'delivery' | 'admin';

/** Set by RoleAppShell when the app is a single-role native app (restaurant, delivery or admin). */
export const RoleLockContext = createContext<LockedRole | null>(null);

/** Demo credential autofill is only shown in dev builds or when explicitly enabled for a staging build. */
export const SHOW_DEMO_LOGIN = import.meta.env.DEV || import.meta.env.VITE_BHOJJ_DEMO_LOGIN === 'true';
