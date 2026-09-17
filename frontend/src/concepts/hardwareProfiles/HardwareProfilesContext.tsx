import * as React from 'react';
import { HardwareProfilesContext } from '@odh-dashboard/ui-core/context/HardwareProfilesContext';
import { useWatchHardwareProfiles } from '#~/utilities/useWatchHardwareProfiles';
import { useDashboardNamespace } from '#~/redux/selectors';

export { HardwareProfilesContext } from '@odh-dashboard/ui-core/context/HardwareProfilesContext';

export const HardwareProfilesContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { dashboardNamespace } = useDashboardNamespace();
  const globalHardwareProfiles = useWatchHardwareProfiles(dashboardNamespace);
  const contextValue = React.useMemo(
    () => ({
      globalHardwareProfiles,
    }),
    [globalHardwareProfiles],
  );
  return (
    <HardwareProfilesContext.Provider value={contextValue}>
      {children}
    </HardwareProfilesContext.Provider>
  );
};
