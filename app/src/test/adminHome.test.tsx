import { render, act, screen, waitFor, within, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

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
        id: "1234567",
        qid: 1234567,
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
        id: "23990",
        qid: 23990,
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
        id: "309876",
        qid: 309876,
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
        id: "42345",
        qid: 42345,
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
        id: "511190",
        qid: 511190,
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
        id: '1234567',
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
        id: '23990',
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
        id: '309876',
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
        id: '42345',
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
        id: '511190',
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

    // mockedAxios.get.mockResolvedValue({
    //     data: {
    //         transactions: mockTransactionsData
    //     }
    
  

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

    // Check the numbers displayed on the screen
    // const overdueDishes = mockTransactionsData.filter(transaction => transaction.returned.timestamp == "");
    // Calculate the expected number of overdue dishes
    // const timeNow = new Date();
    // const twoDaysInMs = 2 * 24 * 60 * 60 * 1000; // Two days in milliseconds
    // const overdueDishesCount = mockTransactionsData.reduce((count, transaction) => {
    //     if (transaction.returned.timestamp === "") {
    //     const borrowTime = new Date(transaction.timestamp).getTime();
    //     const timeElapsed = timeNow.getTime() - borrowTime;
    //     if (timeElapsed > twoDaysInMs) {
    //         return count + 1;
    //     }
    //     }
    //     return count;
    // }, 0);

    // await waitFor(() => {
    //     // expect(screen.getByTestId("in-use")).toHaveTextContent(inUseDishes.toString())
    //     // expect(screen.getByTestId("returned")).toHaveTextContent(availableDishes.toString())
    //     const overdueDishesElement = screen.getByTestId("overdue-count");
    //     expect(overdueDishesElement).toHaveTextContent(overdueDishesCount.toString());
    // });

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

    it('fetches and displays user data', async () => {
        await act(async () => {
            render(
              <Router>
                <Admin />
              </Router>
            );
        });
      

            for (const dish of mockDishesData) {
                const correspondingTransaction = mockTransactionsData.find(transaction => transaction.id === dish.id);
                // console.log(correspondingTransaction)

                if (correspondingTransaction) {
                    // Wait for the element to appear in the document
                    // await waitFor(() => {
                    //     expect(screen.getByTestId("table-row-email")).toHaveTextContent(correspondingTransaction.user.email);
                    // });
                    expect(await screen.findByText(correspondingTransaction.user.email)).toBeInTheDocument();
        
                    // Additional checks for dish and transaction details
                    // ...
                } else {
                    // No corresponding transaction found
                    console.error(`No corresponding transaction found for dish with id ${dish.id}`);
                }
            }
            useAuthMock.mockRestore();
//   });
  
})});
