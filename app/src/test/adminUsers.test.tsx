import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Users from '../admin/users';
import adminApi from '../admin/adminApi';
import { act } from 'react-dom/test-utils';

jest.mock('../admin/adminApi');
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'), // use actual for all non-hook parts
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

//Mocking useAuth
const useAuthMock = jest.spyOn(require('../contexts/AuthContext'), 'useAuth');

//Mock responses for each of the api calls made in admin users page
const mockDishesStatusData = [
  {
    userId: 'user1',
    emailAddress: 'hello@ualberta.ca',
    inUse: 2,
    overdue: 30,
    role: 'customer',
  },
  {
    userId: 'user2',
    emailAddress: 'user2@ualberta.ca',
    inUse: 2,
    overdue: 5,
    role: 'admin',
  },
  {
    userId: 'user3',
    emailAddress: 'mysterious@ualberta.ca',
    inUse: 3,
    overdue: 39,
    role: 'volunteer',
  },
  {
    userId: 'user4',
    emailAddress: 'mocked-email@ualberta.ca',
    inUse: 5,
    overdue: 45,
    role: 'admin',
  }
];

const mockInUseResponse = [
  {
    email: 'hello@ualberta.ca',
    count: 2

  },
  {
    email: 'user2@ualberta.ca',
    count: 2

  },
  {
    email: 'mysterious@ualberta.ca',
    count: 3

  },
  {
    email: 'mocked-email@ualberta.ca',
    count: 5
  }
  
];

const mockOverdueResponse = [
  {
    email: 'hello@ualberta.ca',
    count: 30

  },
  {
    email: 'user2@ualberta.ca',
    count: 5

  },
  {
    email: 'mysterious@ualberta.ca',
    count: 39

  },
  {
    email: 'mocked-email@ualberta.ca',
    count: 45
  }
]

const mockDishes = [
  {
    id: 1,
    qid: 2,
    registered: '2023-07-22T20:19:47.144Z',
    status: 'available',
    timesBorrowed: 7,
    type: "plate",
    userId: "yo"

  }
]

const mockUsers = [
  {
    userId: 'user1',
    emailAddress: 'hello@ualberta.ca',
    role: 'customer',
  },
  {
    userId: 'user2',
    emailAddress: 'user2@ualberta.ca',
    role: 'admin',
  },
  {
    userId: 'user3',
    emailAddress: 'mysterious@ualberta.ca',
    role: 'volunteer',
  },
  {
    userId: 'user4',
    emailAddress: 'mocked-email@ualberta.ca',
    role: 'admin'
  }
]

const mockModifyRole = {
  data:{
  status: "Success"
  }
}


beforeEach(async () => {
    jest.clearAllMocks(); 

    //mocking all adminApi functions which are called in the flow of the admin users page
    jest.mock('../admin/adminApi', () => ({
      getDishesStatusForEachUser: jest.fn(() => Promise.resolve(mockDishesStatusData)),
      getAllDishes: jest.fn(() => Promise.resolve(mockDishes)),
      getUsers: jest.fn(() => Promise.resolve(mockUsers)),
      modifyRole: jest.fn(() => Promise.resolve({data:{status: 'Success'}})),

    }));

    //Mock response to be returned by our mock implementation of the useAuth
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

  
});

describe("Renders properly", () => {
  it("it renders Admin Users Page without crashing", () => {
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>);
  })})

describe('Table/Mainframe Check', () => {
  it('renders the four column headers', async () => {
    
    await act(async () => {
      render(
        <BrowserRouter>
          <Users />
        </BrowserRouter>
      );
    });

  await waitFor(() => {
    expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
  });

  expect(await screen.findByText('Email Address')).toBeInTheDocument();
  expect(await screen.findByText('In Use')).toBeInTheDocument();
  expect(await screen.findByText('Overdue')).toBeInTheDocument();
  expect(await screen.findByText('Role')).toBeInTheDocument();
  
  useAuthMock.mockRestore();
});

  it('fetches and displays user data', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Users />
        </BrowserRouter>
      );
    });
  
    //wait for page to be done loading  
    await waitFor(() => {
      expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
      
    });

    // Assert that the user data is displayed
    mockDishesStatusData.forEach(async (data) => {
      expect(await screen.findByText(data.emailAddress)).toBeInTheDocument();
      expect(await screen.findByText(data.inUse)).toBeInTheDocument();
      expect(await screen.findByText(data.overdue)).toBeInTheDocument();
      expect(await screen.findByText(data.role)).toBeInTheDocument();
    });

    // Clean up mocks
    useAuthMock.mockRestore();
  });
});

describe('Search Functionality', () => {
  it('allows users to be searched by email', async () => {

      //Mock the responses of the getDishesStatusForEachUser so that our mockData is displayed in the table
      const mockGetDishesStatusForEachUser = adminApi.getDishesStatusForEachUser as jest.Mock;
      mockGetDishesStatusForEachUser.mockImplementation(async (sessionToken)=> {
        return mockUsers.map(user => ({
          userId: user.userId,
          emailAddress: user.emailAddress,
          inUse: mockInUseResponse.find((data) => data.email == user.emailAddress)?.count, 
          overdue: mockOverdueResponse.find((data) => data.email == user.emailAddress)?.count, 
        }));
      });

      await act(async () => {
        render(
         
        <BrowserRouter>
          <Users />
        </BrowserRouter>
     
        );
      });
    
      //wait for page to be done loading  
      await waitFor(() => expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument());

      // Change the search input
      fireEvent.change(screen.getByPlaceholderText('search email...'), { target: { value: 'hello' } });
    
      // Wait for the search results to update
      await waitFor(() => {
        expect(screen.getByText('hello@ualberta.ca')).toBeInTheDocument();
        // Make sure other users are not displayed
        mockUsers.forEach(user => {
          if (!user.emailAddress.includes('hello')) {
            expect(screen.queryByText(user.emailAddress)).not.toBeInTheDocument();
          }
        });
      });
    useAuthMock.mockRestore();
  });
});
  


describe('Admin Users Role Update', () => {
  it('renders dropdowns for user roles and allows role updates', async () => {
        
    //Mock the responses of the modifyRole 
    const mockModifyRole = adminApi.modifyRole as jest.Mock;
    mockModifyRole.mockImplementation(async() => {
      return(
        {
          data:{
            status: 'Success'
          }
        }
      )
    })

    const mockGetDishesStatusForEachUser = adminApi.getDishesStatusForEachUser as jest.Mock;
      mockGetDishesStatusForEachUser.mockImplementation(async (sessionToken)=> {
        return mockUsers.map(user => ({
          userId: user.userId,
          emailAddress: user.emailAddress,
          inUse: mockInUseResponse.find((data) => data.email == user.emailAddress)?.count, // or calculate based on mockAllDishes if needed
          overdue: mockOverdueResponse.find((data) => data.email == user.emailAddress)?.count, // or calculate based on mockAllDishes if needed
          role: user.role,
        }));
      });
    await act(async () => {
      render(
        <BrowserRouter>
          <Users />
        </BrowserRouter>
      );
    });

    
    //wait for page to be done loading  
    await waitFor(() => {
      expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
    });

    //check if our mockdata has been loaded
    await waitFor(() => expect(screen.getByText(mockUsers[0].emailAddress)).toBeInTheDocument());

    //Select the dropdown box for the user who's role we wanna change
    const emailToChange = mockUsers[0].emailAddress;
    const selectRole = screen.getByTestId(`select-role-${emailToChange}`).querySelector('input');

    if (!(selectRole instanceof HTMLInputElement)) {
      throw new Error('The select role element was not found or is not an input element.');
    }

    // Simulate a role change
    fireEvent.change(selectRole, { target: { value: 'volunteer' } });

    const sessionToken = 'mocked-session-token';
    await waitFor(() => {
      //expect the role to be volunteer in the frontend
      expect(selectRole.value).toBe('volunteer');
    });

  // Assert that modifyRole was called with the correct arguments
  expect(adminApi.modifyRole).toHaveBeenCalledWith(
    sessionToken,
    mockUsers[0].userId, 
    'volunteer',
    emailToChange
  );

  useAuthMock.mockRestore();

  
  })

  it('cannot update current user role', async() => {
    const mockModifyRole = adminApi.modifyRole as jest.Mock;
    mockModifyRole.mockImplementation(async() => {
      return(
        {
          data:{
            status: 'Success'
          }
        }
      )
    })

    const mockGetDishesStatusForEachUser = adminApi.getDishesStatusForEachUser as jest.Mock;
      mockGetDishesStatusForEachUser.mockImplementation(async (sessionToken)=> {
        return mockUsers.map(user => ({
          userId: user.userId,
          emailAddress: user.emailAddress,
          inUse: mockInUseResponse.find((data) => data.email == user.emailAddress)?.count, // or calculate based on mockAllDishes if needed
          overdue: mockOverdueResponse.find((data) => data.email == user.emailAddress)?.count, // or calculate based on mockAllDishes if needed
          role: user.role,
        }));
      });
    await act(async () => {
      render(
        <BrowserRouter>
          <Users />
        </BrowserRouter>
      );
    });
  
    await waitFor(() => {
      expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
    });

    await waitFor(() => expect(screen.getByText(mockUsers[0].emailAddress)).toBeInTheDocument());

    expect(screen.getByText('mocked-email@ualberta.ca')).toBeInTheDocument();

    const emailToChange = 'mocked-email@ualberta.ca';
    expect(screen.getByTestId(`role-display-${emailToChange}`)).toBeInTheDocument();
    await waitFor(() => {
      // Since we're updating the role, we should check the Typography component
      // which is used to display the role for the current user.
      // the Typography component has a testid like `role-display-${emailToChange}`,
      const roleDisplay = screen.getByTestId(`role-display-${emailToChange}`);
      expect(roleDisplay.textContent).toBe('admin');
    });

    //modify role should not be called as per implementation
    expect(adminApi.modifyRole).toBeCalledTimes(0);

  useAuthMock.mockRestore();

  })


});











