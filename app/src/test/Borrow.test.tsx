import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Borrow from '../routes/borrow'; 
import axios from 'axios'; // API requests 


import '@testing-library/jest-dom';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockPost = axios.post as jest.MockedFunction<typeof axios.post>;

const mockData = {
    show: true, 
    success: true
}

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

beforeEach(() => {
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
})

test('renders without crashing and displays the Scanner component', () => {

    render(
    <BrowserRouter>
    <Borrow />
    </BrowserRouter>
    );
  });

//  double check what ,toBeInTheDocument() does
test('Confirm modal is displayed when confirm state is true', async () => {
  //Mock response to be returned by our mock implementation of the useAuth
 
    render(
        <BrowserRouter>
        <Borrow />
        </BrowserRouter>
        );

    // You might need to simulate the condition that sets the confirm state to true
    // For example, if a button click sets this state, you would simulate that click
    const enterButton = screen.getByTestId('enter-btn');
    fireEvent.click(enterButton);

    expect(screen.getByText('Borrow')).toBeInTheDocument(); // Assuming 'Borrow' is unique to this modal
  });

//test search bar
test('updates on input', async () => {
     render(
        <BrowserRouter>
        <Borrow />
        </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Enter dish id #') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'query' } });
    expect(input.value).toBe('query');
  });

test('triggers search on Enter key', () => {
   // Mock the API call for transactions
   mockedAxios.get.mockResolvedValueOnce(mockData);

    render(
        <BrowserRouter>
        <Borrow />
        </BrowserRouter>
    );
    
    const input = screen.getByPlaceholderText('Enter dish id #') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 6 } });
    const enterButton = screen.getByTestId('enter-btn');
    fireEvent.click(enterButton);
    expect(screen.getByText('Borrow')).toBeInTheDocument();
    expect(screen.getByText("ID: 6"))
  });


  test('triggers search on Enter key', async ()=> {
    // Mock the API call for transactions
    mockPost.mockResolvedValue(mockData);
    //mockedAxios.get.mockResolvedValueOnce(mockData);
    //something: jest.fn(() => Promise.resolve(Promise.resolve(mockData))),
 
     render(
         <BrowserRouter>
         <Borrow />
         </BrowserRouter>
     );
     
     const input = screen.getByPlaceholderText('Enter dish id #') as HTMLInputElement;
     fireEvent.change(input, { target: { value: 6 } });
     const enterButton = screen.getByTestId('enter-btn');
     fireEvent.click(enterButton);
     expect(screen.getByText('Borrow')).toBeInTheDocument();
     expect(screen.getByText("ID: 6"))
    
     const borrowButton = screen.getByTestId('borrow-btn');
     fireEvent.click(borrowButton);
     await waitFor(() => {
      expect(screen.getByText("Successfully borrowed"))
      expect(screen.getByText("Dish # 6"))
     });
     

     // Optionally, check if axios.post was called with the correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish/borrow`,
      {}, // your post body
      {
        headers: { 
          "x-api-key": `${process.env.REACT_APP_API_KEY}`, 
          "session-token": 'mocked-session-token' 
        },
        params: { qid: '6' },
      }
    );

   });

   test('Fail to borrow dish occurs', async ()=> {
    // Mock the API call for transactions
    mockPost.mockResolvedValue(mockData);
    //mockedAxios.get.mockResolvedValueOnce(mockData);
    //something: jest.fn(() => Promise.resolve(Promise.resolve(mockData))),
 
     render(
         <BrowserRouter>
         <Borrow />
         </BrowserRouter>
     );
     
     const input = screen.getByPlaceholderText('Enter dish id #') as HTMLInputElement;
     fireEvent.change(input, { target: { value: 6 } });
     const enterButton = screen.getByTestId('enter-btn');
     fireEvent.click(enterButton);
     expect(screen.getByText('Borrow')).toBeInTheDocument();
     expect(screen.getByText("ID: 6"))
    
     const borrowButton = screen.getByTestId('borrow-btn');
     fireEvent.click(borrowButton);
     await waitFor(() => {
      expect(screen.getByText("Successfully borrowed"))
      expect(screen.getByText("Dish # 6"))
     });
     
     
     // Optionally, check if axios.post was called with the correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish/borrow`,
      {}, // your post body
      {
        headers: { 
          "x-api-key": `${process.env.REACT_APP_API_KEY}`, 
          "session-token": 'mocked-session-token' 
        },
        params: { qid: '6' },
      }
    );

    const second_input = screen.getByPlaceholderText('Enter dish id #') as HTMLInputElement;
     fireEvent.change(second_input, { target: { value: 6 } });
     fireEvent.click(enterButton);
     expect(screen.getByText('Borrow')).toBeInTheDocument();
     expect(screen.getByText("ID: 6"))
  
     fireEvent.click(borrowButton);
     await waitFor(() => {
      expect(screen.getByText("Failed to borrow"))
      expect(screen.getByText("Dish # 6"))
     },{ timeout: 5000 });

    

   });