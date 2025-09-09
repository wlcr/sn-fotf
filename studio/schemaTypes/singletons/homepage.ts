import {defineField, defineType} from 'sanity';
import {DocumentIcon} from '@sanity/icons';
import pageBuilder from '../fields/pageBuilder';

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage Content',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      initialValue: 'Home',
      readOnly: true,
    }),
    pageBuilder,
  ],
});
