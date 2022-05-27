import React from 'react';

import { ComponentMeta, Story } from '@storybook/react';

import { Button, Props } from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    children: {
      defaultValue: 'My Button',
    },
  },
} as ComponentMeta<typeof Button>;

const Template: Story<Props> = (args): JSX.Element => <Button {...args} />;

export const Primary: Story<Props> = Template.bind({});
export const Secondary: Story<Props> = Template.bind({});

Secondary.args = {
  variant: 'outline',
};
