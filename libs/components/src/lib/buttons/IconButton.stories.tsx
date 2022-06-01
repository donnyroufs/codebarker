import React from 'react';

import { ComponentMeta, Story } from '@storybook/react';
import { FaRegBell } from 'react-icons/fa';

import { IconButton, Props } from './IconButton';

export default {
  title: 'IconButton',
  component: IconButton,
  argTypes: {
    icon: {
      defaultValue: <FaRegBell />,
    },
  },
} as ComponentMeta<typeof IconButton>;

const Template: Story<Props> = (args): JSX.Element => <IconButton {...args} />;

export const Default: Story<Props> = Template.bind({});
