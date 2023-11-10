import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Users from '../admin/users';


beforeAll(() => {
    jest.useFakeTimers('legacy');
    jest.setTimeout(10000);
  });

describe("initial render", () => {
  it("it renders Admin Users Page without crashing", () => {
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>);
  })});

  describe('renders the four column headers',  () => {
    it('renders the column header "Email Address"',async() => {
      jest.setTimeout(10000);
      render(
        <BrowserRouter>
          <Users />
        </BrowserRouter>);

      const emailAddressHeader = await screen.findByText(/Email Address/i);
      expect(emailAddressHeader).toBeInTheDocument();

      
    })});
    

