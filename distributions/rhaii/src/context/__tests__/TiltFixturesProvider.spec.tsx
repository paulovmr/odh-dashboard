import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { HardwareProfilesContext } from '@odh-dashboard/ui-core/context/HardwareProfilesContext';
import TiltFixturesProvider from '../TiltFixturesProvider';

const originalTiltFixtures = process.env.RHAII_TILT_FIXTURES;

const HardwareProfilesLoaded: React.FC = () => {
  const {
    globalHardwareProfiles: [, loaded],
  } = React.useContext(HardwareProfilesContext);

  return <span>{loaded ? 'loaded' : 'not loaded'}</span>;
};

afterEach(() => {
  if (originalTiltFixtures === undefined) {
    delete process.env.RHAII_TILT_FIXTURES;
  } else {
    process.env.RHAII_TILT_FIXTURES = originalTiltFixtures;
  }
});

describe('TiltFixturesProvider', () => {
  it('does not provide fixtures outside Tilt', () => {
    process.env.RHAII_TILT_FIXTURES = 'false';

    render(
      <TiltFixturesProvider>
        <HardwareProfilesLoaded />
      </TiltFixturesProvider>,
    );

    expect(screen.getByText('not loaded')).toBeDefined();
  });

  it('provides loaded empty hardware profiles in Tilt', () => {
    process.env.RHAII_TILT_FIXTURES = 'true';

    render(
      <TiltFixturesProvider>
        <HardwareProfilesLoaded />
      </TiltFixturesProvider>,
    );

    expect(screen.getByText('loaded')).toBeDefined();
  });
});
