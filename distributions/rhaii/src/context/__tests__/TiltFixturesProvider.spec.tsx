import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { HardwareProfilesContext } from '@odh-dashboard/ui-core/context/HardwareProfilesContext';
import TiltFixturesProvider from '../TiltFixturesProvider';

const originalTiltFixtures = process.env.RHAII_TILT_FIXTURES;

const HardwareProfilesLoaded: React.FC = () => {
  const {
    globalHardwareProfiles: [profiles, loaded],
  } = React.useContext(HardwareProfilesContext);

  return (
    <span>
      {loaded ? 'loaded' : 'not loaded'}:
      {profiles.map((profile) => profile.metadata.name).join(',')}
    </span>
  );
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

    expect(screen.getByText('not loaded:')).toBeDefined();
  });

  it('provides a loaded default hardware profile in Tilt', () => {
    process.env.RHAII_TILT_FIXTURES = 'true';

    render(
      <TiltFixturesProvider>
        <HardwareProfilesLoaded />
      </TiltFixturesProvider>,
    );

    expect(screen.getByText('loaded:tilt-default')).toBeDefined();
  });
});
