import { render, act, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import Homepage from '../routes/home';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const useAuthMock = jest.spyOn(require('../contexts/AuthContext'), 'useAuth');

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

        // Mock implementation for useAuth
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

    afterEach(() => {
        useAuthMock.mockRestore();
    })

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

describe('Existing users', () => {
    const mockTransactionsData = [
        {
            id: '1',
            dish: {
                qid: 123,
                id: 'dish1',
                type: 'mug'
            },
            returned: {
                condition: "alright",
                timestamp: "" // An empty string to indicate not returned
            },
            timestamp: "2023-11-11T02:40:20.230Z",
            user: {
                email: "user@example.com",
                id: "user123",
                role: "customer"
            }
        },

    ];

    const mockDishApiResponse = {
        data: {
            dish: {
                qid: 123,
                type: "mug"
            }
        }
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        // Mock the API call for transactions
        mockedAxios.get.mockResolvedValueOnce({
            data: { transactions: mockTransactionsData }
        });

        // Mock the API call for dish details in the DishCard component
        mockedAxios.get.mockResolvedValueOnce(mockDishApiResponse);
        
        await act(async () => {
            render(
                <Router>
                    <Homepage />
                </Router>
            );
        });
    });

    it('renders homepage for existing user', async () => {
        await waitFor(() => {
            expect(screen.getByText("My Impact")).toBeInTheDocument();
        });
    })

    it('checks item name and id in dishcard', async () => {
        await waitFor(() => {
            // Check for DishCard details
            const dishCards = screen.getAllByTestId('dish-card');
            expect(dishCards.length).toBe(mockTransactionsData.length);

            const firstDishCard = dishCards[0];
            expect(firstDishCard).toHaveTextContent(/mug # 123/);

        });
    });

    it('checks in use amount', async () => {
        await waitFor(() => {

            expect(screen.getByText("1 in use")).toBeInTheDocument();
        
        });
    });

    it('checks dishcard icon', async () => {
        await waitFor(() => {

            expect(screen.getByAltText('Mug Icon')).toBeInTheDocument();

        });
    });

    it('checks return by date', async () => {
        await waitFor(() => {
            const firstTransaction = mockTransactionsData[0];
            const borrowDate = new Date(firstTransaction.timestamp);
            const expectedReturnDate = new Date(borrowDate.getTime() + 86400000 * 2)

            // Format the date as it should appear in the DishCard text content
            const expectedDateString = expectedReturnDate.toLocaleDateString("en-US", {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });
            const textToFind = new RegExp(`Return before\\s*${expectedDateString}`);

            const dishCards = screen.getAllByTestId('dish-card')
            const firstDishCard = dishCards[0]
            expect(firstDishCard).toHaveTextContent(textToFind)
        
        });
    });
});
