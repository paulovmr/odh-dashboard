import { renderHook } from '@testing-library/react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { KnownLabels, type TemplateKind } from '@odh-dashboard/k8s-core';
import useTemplates, { TemplateModel } from '../useTemplates';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  ...jest.requireActual('@openshift/dynamic-plugin-sdk-utils'),
  useK8sWatchResource: jest.fn(),
}));

const mockUseK8sWatchResource = jest.mocked(useK8sWatchResource);

describe('useTemplates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseK8sWatchResource.mockReturnValue([[], true, undefined]);
  });

  it('watches dashboard serving runtime templates in the requested namespace', () => {
    renderHook(() => useTemplates('model-serving-demo'));

    expect(mockUseK8sWatchResource).toHaveBeenCalledWith(
      {
        isList: true,
        groupVersionKind: {
          group: 'template.openshift.io',
          version: 'v1',
          kind: 'Template',
        },
        namespace: 'model-serving-demo',
        selector: { matchLabels: { [KnownLabels.DASHBOARD_RESOURCE]: 'true' } },
      },
      TemplateModel,
    );
  });

  it('does not start a watch without a namespace', () => {
    renderHook(() => useTemplates());

    expect(mockUseK8sWatchResource).toHaveBeenCalledWith(null, TemplateModel);
  });

  it('returns templates and preserves Kubernetes errors', () => {
    const templates = [{ metadata: { name: 'vllm-template' } }] as TemplateKind[];
    const error = new Error('template API unavailable');
    mockUseK8sWatchResource.mockReturnValue([templates, true, error]);

    const { result } = renderHook(() => useTemplates('model-serving-demo'));

    expect(result.current).toEqual([templates, true, error]);
  });

  it('normalizes unknown watch errors', () => {
    mockUseK8sWatchResource.mockReturnValue([[], true, 'unexpected failure']);

    const { result } = renderHook(() => useTemplates('model-serving-demo'));

    expect(result.current[2]).toEqual(
      new Error('An unknown error occurred while loading serving runtime templates.'),
    );
  });
});
