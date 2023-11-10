import React from 'react';
import { render } from '@testing-library/react';
import Users from '../admin/users';


//jest.useFakeTimers({ legacyFakeTimers: true });
beforeAll(() => {
    jest.useFakeTimers('legacy');
  });
test('it renders without crashing', () => {
  render(<Users />);
});