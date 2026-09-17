import * as React from 'react';
import { type K8sModelCommon, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  isK8sStatus,
  K8sStatusError,
  KnownLabels,
  type K8sWatchResult,
  type TemplateKind,
} from '@odh-dashboard/k8s-core';

export const TemplateModel: K8sModelCommon = {
  apiVersion: 'v1',
  apiGroup: 'template.openshift.io',
  kind: 'Template',
  plural: 'templates',
};

const useTemplates = (namespace?: string): K8sWatchResult<TemplateKind[]> => {
  const resource = React.useMemo(
    () =>
      namespace
        ? {
            isList: true,
            groupVersionKind: {
              group: TemplateModel.apiGroup,
              version: TemplateModel.apiVersion,
              kind: TemplateModel.kind,
            },
            namespace,
            selector: { matchLabels: { [KnownLabels.DASHBOARD_RESOURCE]: 'true' } },
          }
        : null,
    [namespace],
  );
  const [data, loaded, error] = useK8sWatchResource<TemplateKind[]>(resource, TemplateModel);

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
    return new Error('An unknown error occurred while loading serving runtime templates.');
  }, [error]);

  // The SDK type allows undefined while the host API contract always returns an array.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return [data ?? [], loaded, loadError];
};

export default useTemplates;
