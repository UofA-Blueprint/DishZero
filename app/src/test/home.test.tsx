import { render, act, screen, waitFor, within } from "@testing-library/react";
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

test("Renders homepage for new users without crashing", async () => {
    // Mock implementation for useAuth
    useAuthMock.mockImplementation(() => ({
        currentUser: {
            id: 'mocked-user-id',
            role: 'customer',
            email: 'mocked-email@ualberta.ca'
        },
        sessionToken: 'mocked-session-token',
        login: jest.fn(),
        logout: jest.fn(),
    }));

    mockedAxios.get.mockResolvedValue({
        data: {
            transactions: [
                // Empty transaction for new user
            ]
        }
    });

    render(
        <Router>
            <Homepage />
        </Router>
    )

    await waitFor(() => {
        expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText("How It Works")).toBeInTheDocument();
        expect(screen.getByText("Our Impact")).toBeInTheDocument();
        expect(screen.getByText("You don't have any dishes borrowed at the moment. Start borrowing to make an impact!")).toBeInTheDocument();
    });
});

test("Renders homepage for existing users without crashing", async () => {
    // Mock implementation for useAuth
    useAuthMock.mockImplementation(() => ({
        currentUser: {
            id: 'mocked-user-id',
            role: 'customer',
            email: 'mocked-email@ualberta.ca'
        },
        sessionToken: 'mocked-session-token',
        login: jest.fn(),
        logout: jest.fn(),
    }));

    mockedAxios.get.mockResolvedValue({
        data: {
            transactions: [
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
        ]}
    });

    render(
        <Router>
            <Homepage />
        </Router>
    )

    await waitFor(() => {
        expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText("My Impact")).toBeInTheDocument();
        expect(screen.getByText("Dishes Used")).toBeInTheDocument();
        expect(screen.getByText("Waste Diverted")).toBeInTheDocument();
    });
});

describe('New users', () => {
    beforeEach(async () => {
        jest.clearAllMocks();

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

        mockedAxios.get.mockResolvedValue({
            data: {
                transactions: [
                    // Empty transaction for new user
                ]
            }
        });

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

    it('Redirects user to first external link', async () => {
        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });

        // Find the first image link
        const imageLink = screen.getAllByAltText('External Link')[0];
        
        // Verify the href attribute
        expect(imageLink.closest('a')).toHaveAttribute('href', 'https://www.dishzero.ca/how-it-works-1');

        // Note: Actual navigation can't be tested here, 
        // but we're ensuring the link is correctly set up.
        
        // Simulate a click on the link
        userEvent.click(imageLink);
    });

    it('Redirects user to second external link', async () => {
        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });

        // Find the second image link
        const imageLink = screen.getAllByAltText('External Link')[1];
        
        // Verify the href attribute
        expect(imageLink.closest('a')).toHaveAttribute('href', 'https://www.dishzero.ca/impact');

        // Simulate a click on the link
        userEvent.click(imageLink);
    });

    it('Clicks on borrow button', async () => {
        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });
        
        // Find the Borrow button
        const borrowButton = screen.getByText('Borrow');

        // Check if the borrow button is in a ReactRouterLink and navigates to the correct path
        const borrowLink = borrowButton.closest('a');
        expect(borrowLink?.getAttribute('href')).toBe('/borrow');

        // Simulate a click on the borrow button
        userEvent.click(borrowButton);
    });

    it('Clicks on scan button', async () => {
        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });

        // Find the scan image by alt text
        const scanImage = screen.getByAltText('scan icon');

        // Check if the scan image is in a ReactRouterLink and navigates to the correct path
        const scanLink = scanImage.closest('a');
        expect(scanLink?.getAttribute('href')).toBe('/borrow');

        // Simulate a click on the scan button
        userEvent.click(scanImage);
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

        {
            id: '2',
            dish: {
                qid: 122,
                id: 'dish2',
                type: 'plate'
            },
            returned: {
                condition: "alright",
                timestamp: "2023-11-12T02:40:20.230Z"
            },
            timestamp: "2023-11-11T02:40:20.230Z",
            user: {
                email: "user@example.com",
                id: "user123",
                role: "customer"
            }
        },

        {
            id: '3',
            dish: {
                qid: 133,
                id: 'dish3',
                type: 'mug'
            },
            returned: {
                condition: "alright",
                timestamp: "2023-11-13T02:40:20.230Z"
            },
            timestamp: "2023-11-11T02:40:20.230Z",
            user: {
                email: "user@example.com",
                id: "user123",
                role: "customer"
            }
        },

        {
            id: '4',
            dish: {
                qid: 900,
                id: 'dish4',
                type: 'plate'
            },
            returned: {
                condition: "alright",
                timestamp: ""
            },
            timestamp: "2023-11-11T02:40:20.230Z",
            user: {
                email: "user@example.com",
                id: "user123",
                role: "customer"
            }
        },

    ];

    beforeEach(async () => {
        jest.clearAllMocks();

        // Mock the API call for transactions
        mockedAxios.get.mockResolvedValueOnce({
            data: { transactions: mockTransactionsData }
        });

        // Mocking the axios.get call for each unreturned dish based on their qid
        mockTransactionsData.filter(transaction => transaction.returned.timestamp === "").forEach((transaction) => {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    dish: {
                        qid: transaction.dish.qid,
                        type: transaction.dish.type
                    }
                }
            });
        });
        
        await act(async () => {
            render(
                <Router>
                    <Homepage />
                </Router>
            );
        });
    });

    it('Checks returned dishes and waste diverted statistics', async () => {
        // Calculate the expected number of returned dishes
        const expectedReturnedDishesCount = mockTransactionsData.filter(
            (transaction) => transaction.returned.timestamp !== ""
        ).length;

        // Calculate the expected waste diverted amount based on returned dishes
        const expectedWasteDiverted = expectedReturnedDishesCount * 0.5;

        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByTestId("returned-dishes-count")).toHaveTextContent(expectedReturnedDishesCount.toString())
            expect(screen.getByTestId("waste-diverted-amt")).toHaveTextContent(expectedWasteDiverted.toString())
        });
    })

    it('Checks if in-use amount matches number of currently borrowed dishes', async () => {
        const amountDishesUsed = mockTransactionsData.filter(
            (transaction) => transaction.returned.timestamp === ""
        ).length

        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText(`${amountDishesUsed.toString()} in use`)).toBeInTheDocument();
        });
    });

    it('Checks dishcard details', async () => {
        const dishCards = screen.getAllByTestId('dish-card');

        // Only checking unreturned dishes
        const unreturnedTransactions = mockTransactionsData.filter(t => t.returned.timestamp === "");
        
        // Verify each DishCard has the correct content
        unreturnedTransactions.forEach((transaction, index) => {
            const dishCard = dishCards[index]
            const expectedName = new RegExp(`${transaction.dish.type} # ${transaction.dish.qid}`);
            expect(dishCard).toHaveTextContent(expectedName);
            
            // Check the icon displayed in the DishCard
            const expectedIconAltText = transaction.dish.type === 'mug' ? 'Mug Icon' : 'Container Icon';
            const icon = within(dishCard).getByAltText(expectedIconAltText);
            expect(icon).toBeInTheDocument();
            
            // Check if return by date is 48 hours after borrow date
            const borrowDate = new Date(transaction.timestamp);
            const expectedReturnDate = new Date(borrowDate.getTime() + 86400000 * 2);
            const expectedDateString = expectedReturnDate.toLocaleDateString("en-US", {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });
            const textToFind = `Return before ${expectedDateString}`;
            expect(dishCard).toHaveTextContent(textToFind);
        });
    });
});
