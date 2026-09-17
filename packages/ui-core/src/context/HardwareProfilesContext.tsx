import * as React from 'react';
import type { HardwareProfileKind, K8sWatchResult } from '@odh-dashboard/k8s-core';

export type HardwareProfilesContextType = {
  globalHardwareProfiles: K8sWatchResult<HardwareProfileKind[]>;
};

export const HardwareProfilesContext = React.createContext<HardwareProfilesContextType>({
  globalHardwareProfiles: [[], false, undefined],
});
