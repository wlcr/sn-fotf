import {dataset, projectId, studioUrl} from '~/lib/sanity/api';
import {
  createDataAttribute,
  CreateDataAttributeProps,
} from '@sanity/visual-editing';
import {urlForImage} from './urlForImage';

export function resolveOpenGraphImage(image: any, width = 1200, height = 627) {
  if (!image) return;
  const url = urlForImage(image)?.width(1200).height(627).fit('crop').url();
  if (!url) return;
  return {url, alt: image?.alt as string, width, height};
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>;

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config);
}
