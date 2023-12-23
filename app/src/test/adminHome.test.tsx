import { render, act, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

import Admin from '../routes/admin';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const useAuthMock = jest.spyOn(require('../contexts/AuthContext'), 'useAuth');

jest.mock('../contexts/AuthContext', () => ({
    ...jest.requireActual('../contexts/AuthContext'),
    useAuth: () => ({
        currentUser: {
            id: 'mocked-user-id',
            role: 'admin',
            email: 'mocked-email@ualberta.ca'
        },
        sessionToken: 'mocked-session-token',
        login: jest.fn(),
        logout: jest.fn(),
    })
}));

const mockDishesData = [
    {
        borrowed: true,
        borrowedAt: "2023-11-11T02:40:20.230Z",
        condition: "alright",
        id: "dish1",
        qid: 123,
        registered: "2023-07-22T20:19:47.144Z",
        status: "available",
        timesBorrowed: 3,
        type: "mug",
        userId: "user123"
    },

    {
        borrowed: false,
        borrowedAt: null,
        condition: "alright",
        id: "dish2",
        qid: 23,
        registered: "2023-07-22T20:19:50.144Z",
        status: "available",
        timesBorrowed: 7,
        type: "mug",
        userId: null
    },

    {
        borrowed: true,
        borrowedAt: "2023-11-16T02:40:20.230Z",
        condition: "alright",
        id: "dish3",
        qid: 30,
        registered: "2023-07-22T20:19:50.144Z",
        status: "available",
        timesBorrowed: 2,
        type: "plate",
        userId: "hello123"
    },

    {
        borrowed: true,
        borrowedAt: "2023-11-21T02:40:20.230Z",
        condition: "alright",
        id: "dish2",
        qid: 23,
        registered: "2023-07-22T20:19:50.144Z",
        status: "available",
        timesBorrowed: 9,
        type: "plate",
        userId: "test123"
    },

    {
        borrowed: true,
        borrowedAt: "2022-11-21T02:40:20.230Z",
        condition: "alright",
        id: "dish4",
        qid: 51,
        registered: "2020-07-22T20:19:50.144Z",
        status: "available",
        timesBorrowed: 1,
        type: "plate",
        userId: "lost123"
    },
]

const mockTransactionsData = [
    {
        dish: "dish1",
        id: '123',
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
        dish: "dish2",
        id: '23',
        returned: {
            condition: "large_crack_chunk",
            timestamp: "2023-09-26T23:44:52.548Z"
        },
        timestamp: "2023-09-25T02:40:20.230Z",
        user: {
            email: "test@example.com",
            id: "test123",
            role: "volunteer"
        }
    },

    {
        dish: "dish3",
        id: '30',
        returned: {
            condition: "alright",
            timestamp: "" // An empty string to indicate not returned
        },
        timestamp: "2023-11-16T02:40:20.230Z",
        user: {
            email: "hello@example.com",
            id: "hello123",
            role: "admin"
        }
    },

    {
        dish: "dish2",
        id: '23',
        returned: {
            condition: "large_crack_chunk",
            timestamp: ""
        },
        timestamp: "2023-11-21T02:40:20.230Z",
        user: {
            email: "test@example.com",
            id: "test123",
            role: "volunteer"
        }
    },

    {
        dish: "dish4",
        id: '51',
        returned: {
            condition: "alright",
            timestamp: ""
        },
        timestamp: "2022-11-21T02:40:20.230Z",
        user: {
            email: "test@example.com",
            id: "lost123",
            role: "customer"
        }
    },
   
];

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
          dishes: mockDishesData,
          transactions: mockTransactionsData
        }
      });

});

test("Renders homepage without crashing", async () => {
    await act(async () => {
        render(
          <Router>
            <Admin />
          </Router>
        );
      });

    expect(screen.getByPlaceholderText("Type text here...")).toBeInTheDocument();
    expect(screen.getByText("Dish ID")).toBeInTheDocument();
    expect(screen.getByText("Dish type")).toBeInTheDocument();    
});

describe('Dish Status', () => {
    
    it('check currently used and available dishes', async () => {
        await act(async () => {
            render(
              <Router>
                <Admin />
              </Router>
            );
          });

    await waitFor(() => {
        expect(screen.getByText("Currently in use")).toBeInTheDocument();
        expect(screen.getByText("Available")).toBeInTheDocument();
    });

    // Check the numbers displayed on the screen
    const inUseDishes = mockDishesData.filter(dish => dish.borrowed == true).length;
    const availableDishes = mockDishesData.filter(dish => dish.borrowed == false).length;

    await waitFor(() => {
        expect(screen.getByTestId("in-use")).toHaveTextContent(inUseDishes.toString())
        expect(screen.getByTestId("returned")).toHaveTextContent(availableDishes.toString())
        
    });

    });
    
      // Add more tests as needed
    it('check for overdue dishes', async () => {
        await act(async () => {
            render(
              <Router>
                <Admin />
              </Router>
            );
          });

    await waitFor(() => {
        expect(screen.getByTestId("overdue-text")).toBeInTheDocument();
    });

    // Calculate the number of overdue dishes (more than 2 days but less than 30 days)
    const timeToday = new Date();
    const overdueDishes = mockTransactionsData.filter(transaction => {
        if (transaction.returned.timestamp) return false; // Skip if already returned
        let borrowTime = new Date(transaction.timestamp);
        let timeDifference = (timeToday - borrowTime) / (1000 * 60 * 60 * 24);
        return timeDifference > 2 && timeDifference < 30;
    }).length;

    // Check if the number of overdue dishes is displayed correctly
    await waitFor(() => {
        expect(screen.getByTestId("overdue-count")).toHaveTextContent(overdueDishes.toString());
    });
});

    it('check for lost dishes', async () => {
        await act(async () => {
            render(
              <Router>
                <Admin />
              </Router>
            );
          });

    await waitFor(() => {
        expect(screen.getByText("Dishes Lost")).toBeInTheDocument();
    });

    // Check the numbers displayed on the screen
    // Calculate the number of lost dishes
    const timeToday = new Date();
    const dishesLost = mockTransactionsData.filter(transaction => {
        if (transaction.returned.timestamp) return false; // Skip if already returned
        let borrowTime = new Date(transaction.timestamp);
        let timeDifference = (timeToday - borrowTime) / (1000 * 60 * 60 * 24);
        return timeDifference >= 30;
    }).length;

    await waitFor(() => {
        expect(screen.getByTestId("lost-count")).toHaveTextContent(dishesLost.toString());
    });
    });
});

describe("Table Functionalities", () => {
    it('renders the five column headers', async () => {
    
        await act(async () => {
          render(
            <Router>
              <Admin />
            </Router>
          );
        });
    
      await waitFor(() => {
        expect(screen.getByText('Dish ID')).toBeInTheDocument();
        expect(screen.getByText('Dish type')).toBeInTheDocument();
        expect(screen.getByText('Dish Status')).toBeInTheDocument();
        expect(screen.getByTestId('overdue-table')).toBeInTheDocument();
        expect(screen.getByTestId('email-table')).toBeInTheDocument();
      });
    
      useAuthMock.mockRestore();
    });

    it('fetches and displays transactions data', async () => {
        await act(async () => {
            render(
              <Router>
                <Admin />
              </Router>
            );
        });

        for (const dish of mockDishesData) {
            const correspondingTransaction = mockTransactionsData.find(transaction => transaction.dish === dish.id);

            // Verify the columns
            const idElements = await screen.findAllByTestId(`row-${dish.qid}`);
            const rowEmails = await screen.findAllByTestId(`row-${correspondingTransaction?.user.email}`)
            const dishTypes = await screen.findAllByTestId(`row-${dish.type}`);

            for (const idElement of idElements) {
                expect(idElement.textContent).toBe(correspondingTransaction?.id);
            }
            for (const email of rowEmails) {
                expect(email.textContent).toBe(correspondingTransaction?.user.email);
            }
            for (const dishType of dishTypes) {
                expect(dishType.textContent).toBe(dish.type);
            }

        }
      
        useAuthMock.mockRestore();

    })

    it('search functionality', async () => {
        await act(async () => {
            render(
              <Router>
                <Admin />
              </Router>
            );
        });

         // Simulate typing into the search bar
        const searchInput = screen.getByPlaceholderText('Type text here...');
        fireEvent.change(searchInput, { target: { value: mockTransactionsData[0].id } });

        // Simulate click on the search button
        const searchButton = screen.getByText('Search');
        fireEvent.click(searchButton);

        // Assert that the table contains the expected data
        const expectedData = screen.getByText(mockTransactionsData[0].user.email);
        expect(expectedData).toBeInTheDocument();
        
      
        useAuthMock.mockRestore();
  
    })

});
