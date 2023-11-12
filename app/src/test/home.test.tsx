import { render, act, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import Homepage from '../routes/home';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../contexts/AuthContext', () => ({
    ...jest.requireActual('../contexts/AuthContext'),
    useAuth: () => ({
        currentUser: {
            id: 'mocked-user-id',
            role: 'customer',
            email: 'mocked-email@ualberta.ca'
        },
        sessionToken: 'mocked-session-token',
        login: jest.fn(),
        logout: jest.fn(),
    })
}));

describe('New users', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    
        mockedAxios.get.mockResolvedValue({
            data: {
                transactions: [
                    // Empty transaction for new user
                ]
            }
        });

        // Mock implementation for useAuth, if necessary
        const useAuthMock = jest.spyOn(require('../contexts/AuthContext'), 'useAuth');
        useAuthMock.mockImplementation(() => ({
            currentUser: {
                id: 'mocked-user-id',
                role: 'admin',
                email: 'mocked-email@ualberta.ca'
            },
            sessionToken: 'mocked-session-token',
            login: jest.fn(),
            logout: jest.fn(),
        }));

        await act(async () => {
            render(
                <Router>
                    <Homepage />
                </Router>
            );
        });
    });

    it('renders homepage for new user', async () => {
        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("You don't have any dishes borrowed at the moment. Start borrowing to make an impact!")).toBeInTheDocument();
        });
    });

    it('redirects user to first external link', async () => {
        // Find the first image link
        const imageLink = screen.getAllByAltText('External Link')[0];
        
        // Verify the href attribute
        expect(imageLink.closest('a')).toHaveAttribute('href', 'https://www.dishzero.ca/how-it-works-1');

        // Note: Actual navigation can't be tested here, 
        // but we're ensuring the link is correctly set up.
        
        // Simulate a click on the link
        userEvent.click(imageLink);
    });

    it('redirects user to second external link', async () => {
       // Find the second image link
       const imageLink = screen.getAllByAltText('External Link')[1];
       
       // Verify the href attribute
       expect(imageLink.closest('a')).toHaveAttribute('href', 'https://www.dishzero.ca/impact');

       // Simulate a click on the link
       userEvent.click(imageLink);
    });

    it('clicks on borrow button', async () => {
        // Find the Borrow button
        const borrowButton = screen.getByText('Borrow');

        // Check if the borrow button is in a ReactRouterLink and navigates to the correct path
        const borrowLink = borrowButton.closest('a');
       
        if (borrowLink) {
            expect(borrowLink.getAttribute('href')).toBe('/borrow');
        } else {
            throw new Error('Borrow link not found');
        }

        // Simulate a click on the borrow button
        userEvent.click(borrowButton);
        
    });

    it('clicks on scan button', async () => {
        // Find the scan image by alt text
        const scanImage = screen.getByAltText('scan icon');

        // Check if the scan image is in a ReactRouterLink and navigates to the correct path
        const scanLink = scanImage.closest('a');
        
        if (scanLink) {
            expect(scanLink.getAttribute('href')).toBe('/borrow');
        } else {
            throw new Error('Scan link not found');
        }

        // Simulate a click on the borrow button
        userEvent.click(scanLink);
    });

});

