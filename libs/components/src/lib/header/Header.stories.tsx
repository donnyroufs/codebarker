import React from 'react';

import { ComponentMeta, Story } from '@storybook/react';

import { Header, Props } from './Header';

export default {
  title: 'Header',
  component: Header,
  argTypes: {
    name: {
      defaultValue: 'Donny R.',
    },
  },
} as ComponentMeta<typeof Header>;

const Template: Story<Props> = (args): JSX.Element => <Header {...args} />;

export const Default: Story<Props> = Template.bind({});
