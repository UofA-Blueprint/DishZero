// adapted from borrow.test.tsx by Jing

import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Return from '../routes/return'
import axios from 'axios' // API requests

import '@testing-library/jest-dom'
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const mockPost = axios.post as jest.MockedFunction<typeof axios.post>
const mockGet = axios.get as jest.MockedFunction<typeof axios.get>

const mockGetData = {
    data: {
        dish: {
            registered: '2023-08-22T20:19:47.144Z',
            type: 'plate',
            qid: 6,
            status: 'available',
            condition: 'good',
            borrowedAt: '2024-01-03T06:16:09.744Z',
            timesBorrowed: 16,
            userId: 'lEGOWajsD7ZW9xQ23qhbanAMFMA3',
            borrowed: true,
            id: 'Mejp6iZt2HzzrJZDBBAy',
        },
    },
}

// const mockPostData = ;

jest.mock('../contexts/AuthContext', () => ({
    ...jest.requireActual('../contexts/AuthContext'), // use actual for all non-hook parts
    useAuth: () => ({
        currentUser: {
            id: 'mocked-user-id',
            role: 'admin',
            email: 'mocked-email@ama.ca',
        },
        sessionToken: 'mocked-session-token',
        login: jest.fn(),
        logout: jest.fn(),
    }),
}))

//Mocking useAuth
const useAuthMock = jest.spyOn(require('../contexts/AuthContext'), 'useAuth')

beforeEach(() => {
    //Mock response to be returned by our mock implementation of the useAuth
    useAuthMock.mockImplementation(() => ({
        currentUser: {
            id: 'mocked-user-id',
            role: 'admin',
            email: 'mocked-email@ama.ca',
        },
        sessionToken: 'mocked-session-token',
        login: jest.fn(),
        logout: jest.fn(),
    }))
})

test('Confirm page is visible to admins', () => {
    render(
        <BrowserRouter>
            <Return />
        </BrowserRouter>,
    )
    expect(screen.getByText('Return Dishes')).toBeInTheDocument()
})

test('triggers search on Enter key', async () => {
    // Mock the API call for transactions
    mockPost.mockImplementation((url) => {
        switch (url) {
            case `/api/dish/return`:
                return Promise.resolve({ data: { message: 'dish returned' } })
            case `/api/dish/condition`:
                return Promise.resolve({ data: { message: 'updated condition' } })
            default:
                return Promise.reject(new Error('not found'))
        }
    })
    //   mockGet.mockRejectedValue(new Error("qr code not found"))
    mockGet.mockResolvedValue(mockGetData)
    //   mockPost.mockResolvedValue(mockPostData);
    //mockedAxios.get.mockResolvedValueOnce(mockData);
    //something: jest.fn(() => Promise.resolve(Promise.resolve(mockData))),

    render(
        <BrowserRouter>
            <Return noTimer={true} />
        </BrowserRouter>,
    )

    const input = screen.getByPlaceholderText('Enter dish id #') as HTMLInputElement
    fireEvent.change(input, { target: { value: 6 } })
    const enterButton = screen.getByTestId('return-btn')
    fireEvent.click(enterButton)
    //   expect(screen.getByText("Borrow")).toBeInTheDocument();
    //   expect(screen.getByText("#6"));

    //   const borrowButton = screen.getByTestId("borrow-btn");
    //   fireEvent.click(borrowButton);
    await Promise.resolve()

    await waitFor(() => {
        expect(screen.getByText('Successfully returned'))
        expect(screen.getByText('Plate #6'))
    })

    const openReportButton = screen.getByTestId('open-report-modal-btn')
    fireEvent.click(openReportButton)
    //   await Promise.resolve();
    //   expect(screen.getByText("Report"));
    // const counter = await screen.findByText('Report')
    await waitFor(() => {
        //     expect(screen.getByText("Report")).toBeInTheDocument();
        expect(screen.getByText('Small crack/chip'))
        expect(screen.getByText('Large crack/chunk missing'))
        expect(screen.getByText('Shattered'))
    })
    const small_crack = screen.getByTestId('small_crack')
    fireEvent.click(small_crack)
    const end_report_button = screen.getByTestId('end-report-btn')
    fireEvent.click(end_report_button)
    await Promise.resolve()
    await waitFor(() => {
        expect(screen.getByTestId('plate-id-and-condition')).toHaveTextContent('Updated condition')
    })
    // Optionally, check if axios.post was called with the correct arguments
    expect(mockPost.mock.calls).toEqual([
        [
            `/api/dish/return`,
            {
                returned: {
                    condition: 'good',
                },
            }, // your post body
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${process.env.REACT_APP_API_KEY}`,
                    'session-token': 'mocked-session-token',
                },
                params: { qid: '6' },
                baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
            },
        ],
        [
            `/api/dish/condition`,
            {
                condition: 'small_crack_chip',
            },
            {
                baseURL: 'http://localhost:8080',
                headers: {
                    'Content-Type': 'application/json',
                    'session-token': 'mocked-session-token',
                    'x-api-key': 'test',
                },
                params: {
                    id: 'Mejp6iZt2HzzrJZDBBAy',
                },
            },
        ],
    ])

    // Optionally, check if axios.post was called with the correct arguments
    expect(axios.get).toHaveBeenCalledWith(`/api/dish`, {
        headers: {
            'x-api-key': `${process.env.REACT_APP_API_KEY}`,
            'session-token': 'mocked-session-token',
        },
        params: { qid: '6' },
        baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
    })
})

test('Dish Not Found', async () => {
    // Mock the API call for transactions
    mockPost.mockImplementation((url) => {
        switch (url) {
            case `/api/dish/return`:
                return Promise.reject({
                    response: {
                        data: {
                            error: 'operation_not_allowed',
                            message: 'qr code not found',
                        },
                    },
                })
            default:
                return Promise.reject(new Error('not found'))
        }
    })
    mockGet.mockRejectedValue({ data: { error: 'dish_not_found' } })
    //   mockPost.mockResolvedValue(mockPostData);
    //mockedAxios.get.mockResolvedValueOnce(mockData);
    //something: jest.fn(() => Promise.resolve(Promise.resolve(mockData))),

    render(
        <BrowserRouter>
            <Return noTimer={true} />
        </BrowserRouter>,
    )

    const input = screen.getByPlaceholderText('Enter dish id #') as HTMLInputElement
    fireEvent.change(input, { target: { value: 6 } })
    const enterButton = screen.getByTestId('return-btn')
    fireEvent.click(enterButton)
    //   expect(screen.getByText("Borrow")).toBeInTheDocument();
    //   expect(screen.getByText("#6"));

    //   const borrowButton = screen.getByTestId("borrow-btn");
    //   fireEvent.click(borrowButton);
    await Promise.resolve()

    await waitFor(() => {
        expect(screen.getByText('qr code not found'))
        expect(screen.getByText('Please scan and try again'))
    })

    expect(mockPost.mock.calls).toEqual([
        [
            `/api/dish/return`,
            {
                returned: {
                    condition: 'good',
                },
            }, // your post body
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${process.env.REACT_APP_API_KEY}`,
                    'session-token': 'mocked-session-token',
                },
                params: { qid: '6' },
                baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
            },
        ],
    ])

    // Optionally, check if axios.post was called with the correct arguments
    expect(axios.get).toHaveBeenCalledWith(`/api/dish`, {
        headers: {
            'x-api-key': `${process.env.REACT_APP_API_KEY}`,
            'session-token': 'mocked-session-token',
        },
        params: { qid: '6' },
        baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
    })
})

test('Dish Not Borrowed', async () => {
    // Mock the API call for transactions
    mockPost.mockImplementation((url) => {
        switch (url) {
            case `/api/dish/return`:
                return Promise.reject({
                    response: {
                        data: {
                            error: 'operation_not_allowed',
                            message: 'Dish not borrowed',
                        },
                    },
                })
            default:
                return Promise.reject(new Error('not found'))
        }
    })
    mockGet.mockRejectedValue({ data: { error: 'dish_not_found' } })
    //   mockPost.mockResolvedValue(mockPostData);
    //mockedAxios.get.mockResolvedValueOnce(mockData);
    //something: jest.fn(() => Promise.resolve(Promise.resolve(mockData))),

    render(
        <BrowserRouter>
            <Return noTimer={true} />
        </BrowserRouter>,
    )

    const input = screen.getByPlaceholderText('Enter dish id #') as HTMLInputElement
    fireEvent.change(input, { target: { value: 6 } })
    const enterButton = screen.getByTestId('return-btn')
    fireEvent.click(enterButton)
    //   expect(screen.getByText("Borrow")).toBeInTheDocument();
    //   expect(screen.getByText("#6"));

    //   const borrowButton = screen.getByTestId("borrow-btn");
    //   fireEvent.click(borrowButton);
    await Promise.resolve()

    await waitFor(() => {
        expect(screen.getByText('Dish not borrowed'))
        expect(screen.getByText('Please scan and try again'))
    })

    expect(mockPost.mock.calls).toEqual([
        [
            `/api/dish/return`,
            {
                returned: {
                    condition: 'good',
                },
            }, // your post body
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${process.env.REACT_APP_API_KEY}`,
                    'session-token': 'mocked-session-token',
                },
                params: { qid: '6' },
                baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
            },
        ],
    ])

    // Optionally, check if axios.post was called with the correct arguments
    expect(axios.get).toHaveBeenCalledWith(`/api/dish`, {
        headers: {
            'x-api-key': `${process.env.REACT_APP_API_KEY}`,
            'session-token': 'mocked-session-token',
        },
        params: { qid: '6' },
        baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
    })
})
