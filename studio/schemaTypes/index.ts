import * as documents from './documents';
import * as objects from './objects';
import * as singletons from './singletons';

export const schemaTypes = [
  // Singletons
  ...Object.values(singletons),
  // Documents
  ...Object.values(documents),
  // Objects
  ...Object.values(objects),
];
