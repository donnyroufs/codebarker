import React from 'react';

import { ComponentMeta, Story } from '@storybook/react';

import { Button, Props } from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    children: {
      defaultValue: 'Sign In',
    },
  },
} as ComponentMeta<typeof Button>;

const Template: Story<Props> = (args): JSX.Element => <Button {...args} />;

export const Default: Story<Props> = Template.bind({});
Default.args = {
  variant: 'primary',
};

export const SecondaryButton: Story<Props> = Template.bind({});
SecondaryButton.args = {
  variant: 'secondary',
};

export const OutlineButton: Story<Props> = Template.bind({});
OutlineButton.args = {
  variant: 'outline',
};
