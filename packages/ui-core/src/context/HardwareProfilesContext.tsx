import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  type HardwareProfileKind,
  isK8sStatus,
  K8sStatusError,
  type K8sWatchResult,
} from '@odh-dashboard/k8s-core';
import { HardwareProfileModel } from '@odh-dashboard/k8s-core/api/models';

export type HardwareProfilesContextType = {
  globalHardwareProfiles: K8sWatchResult<HardwareProfileKind[]>;
};

export const HardwareProfilesContext = React.createContext<HardwareProfilesContextType>({
  globalHardwareProfiles: [[], false, undefined],
});

export const useWatchHardwareProfiles = (
  namespace?: string,
): K8sWatchResult<HardwareProfileKind[]> => {
  const resource = React.useMemo(
    () =>
      namespace
        ? {
            isList: true,
            groupVersionKind: {
              group: HardwareProfileModel.apiGroup,
              version: HardwareProfileModel.apiVersion,
              kind: HardwareProfileModel.kind,
            },
            namespace,
          }
        : null,
    [namespace],
  );
  const [data, loaded, error] = useK8sWatchResource<HardwareProfileKind[]>(
    resource,
    HardwareProfileModel,
  );

  const loadError = React.useMemo(() => {
    if (error instanceof Error) {
      return error;
    }
    if (!error) {
      return undefined;
    }
    if (isK8sStatus(error)) {
      return new K8sStatusError(error);
    }
    return new Error('An unknown error occurred while loading hardware profiles.');
  }, [error]);

  // The SDK type allows undefined while the context contract always returns an array.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return [data ?? [], loaded, loadError];
};

type HardwareProfilesContextProviderProps = {
  namespace?: string;
  children: React.ReactNode;
};

export const HardwareProfilesContextProvider: React.FC<HardwareProfilesContextProviderProps> = ({
  namespace,
  children,
}) => {
  const globalHardwareProfiles = useWatchHardwareProfiles(namespace);
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
