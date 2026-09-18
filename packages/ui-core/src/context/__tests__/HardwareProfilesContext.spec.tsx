import * as React from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import type { HardwareProfileKind } from '@odh-dashboard/k8s-core';
import { HardwareProfileModel } from '@odh-dashboard/k8s-core/api/models';
import {
  HardwareProfilesContext,
  HardwareProfilesContextProvider,
  useWatchHardwareProfiles,
} from '../HardwareProfilesContext';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  ...jest.requireActual('@openshift/dynamic-plugin-sdk-utils'),
  useK8sWatchResource: jest.fn(),
}));

const mockUseK8sWatchResource = jest.mocked(useK8sWatchResource);

const HardwareProfilesConsumer: React.FC = () => {
  const {
    globalHardwareProfiles: [profiles, loaded],
  } = React.useContext(HardwareProfilesContext);

  return (
    <span>{loaded ? profiles.map((profile) => profile.metadata.name).join(',') : 'loading'}</span>
  );
};

describe('HardwareProfilesContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseK8sWatchResource.mockReturnValue([[], true, undefined]);
  });

  it('watches hardware profiles in the requested namespace', () => {
    renderHook(() => useWatchHardwareProfiles('opendatahub'));

    expect(mockUseK8sWatchResource).toHaveBeenCalledWith(
      {
        isList: true,
        groupVersionKind: {
          group: 'infrastructure.opendatahub.io',
          version: 'v1',
          kind: 'HardwareProfile',
        },
        namespace: 'opendatahub',
      },
      HardwareProfileModel,
    );
  });

  it('does not start a watch without a namespace', () => {
    renderHook(() => useWatchHardwareProfiles());

    expect(mockUseK8sWatchResource).toHaveBeenCalledWith(null, HardwareProfileModel);
  });

  it('normalizes unknown watch errors', () => {
    mockUseK8sWatchResource.mockReturnValue([[], true, 'unexpected failure']);

    const { result } = renderHook(() => useWatchHardwareProfiles('opendatahub'));

    expect(result.current[2]).toEqual(
      new Error('An unknown error occurred while loading hardware profiles.'),
    );
  });

  it('provides profiles loaded from Kubernetes', () => {
    const profiles = [
      {
        apiVersion: 'infrastructure.opendatahub.io/v1',
        kind: 'HardwareProfile',
        metadata: { name: 'default-profile', namespace: 'opendatahub' },
        spec: { identifiers: [] },
      },
    ] as HardwareProfileKind[];
    mockUseK8sWatchResource.mockReturnValue([profiles, true, undefined]);

    render(
      <HardwareProfilesContextProvider namespace="opendatahub">
        <HardwareProfilesConsumer />
      </HardwareProfilesContextProvider>,
    );

    expect(screen.getByText('default-profile')).toBeDefined();
  });
});
