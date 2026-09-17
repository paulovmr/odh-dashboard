import * as React from 'react';
import { HardwareProfilesContext } from '@odh-dashboard/ui-core/context/HardwareProfilesContext';

const tiltHardwareProfilesContextValue: React.ContextType<typeof HardwareProfilesContext> = {
  globalHardwareProfiles: [[], true, undefined],
};

type TiltFixturesProviderProps = {
  children: React.ReactNode;
};

const TiltFixturesProvider: React.FC<TiltFixturesProviderProps> = ({ children }) => {
  if (process.env.RHAII_TILT_FIXTURES !== 'true') {
    return <>{children}</>;
  }

  return (
    <HardwareProfilesContext.Provider value={tiltHardwareProfilesContextValue}>
      {children}
    </HardwareProfilesContext.Provider>
  );
};

export default TiltFixturesProvider;
