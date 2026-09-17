import * as React from 'react';
import {
  IdentifierResourceType,
  SchedulingType,
  type HardwareProfileKind,
} from '@odh-dashboard/k8s-core';
import { HardwareProfilesContext } from '@odh-dashboard/ui-core/context/HardwareProfilesContext';

export const tiltHardwareProfile: HardwareProfileKind = {
  apiVersion: 'infrastructure.opendatahub.io/v1',
  kind: 'HardwareProfile',
  metadata: {
    name: 'tilt-default',
    namespace: 'opendatahub',
    annotations: {
      'opendatahub.io/display-name': 'Tilt default',
      'opendatahub.io/description': 'CPU and memory defaults for the RHAII Tilt environment.',
      'opendatahub.io/disabled': 'false',
    },
  },
  spec: {
    identifiers: [
      {
        displayName: 'CPU',
        identifier: 'cpu',
        minCount: '1',
        maxCount: '4',
        defaultCount: '1',
        resourceType: IdentifierResourceType.CPU,
      },
      {
        displayName: 'Memory',
        identifier: 'memory',
        minCount: '1Gi',
        maxCount: '8Gi',
        defaultCount: '1Gi',
        resourceType: IdentifierResourceType.MEMORY,
      },
    ],
    scheduling: {
      type: SchedulingType.NODE,
      node: {},
    },
  },
};

const tiltHardwareProfilesContextValue: React.ContextType<typeof HardwareProfilesContext> = {
  globalHardwareProfiles: [[tiltHardwareProfile], true, undefined],
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
