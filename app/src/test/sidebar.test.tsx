import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

import { Sidebar } from "../widgets/sidebar";

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

test("Renders sidebar without crashing", () => {
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

    render(
        <Router>
            <Sidebar />
        </Router>
    )
});

describe("Customer sidebar", () => {
    beforeEach(async () => {
        // Mock useAuth implementation for a customer role
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

        // Render the sidebar for testing
        render(
            <Router>
                <Sidebar />
            </Router>
        )

    });

    it("Checks if sidebar is displayed with the correct components", async () => {
        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            // These should appear for customers
            expect(screen.getByText("DishZero")).toBeInTheDocument();
            expect(screen.getByText("MENU")).toBeInTheDocument();
            expect(screen.getByText("Home")).toBeInTheDocument();
            expect(screen.getByText("How it works")).toBeInTheDocument();
            expect(screen.getByText("Our impact")).toBeInTheDocument();
            expect(screen.getByText("Logout")).toBeInTheDocument();
    
            // These should NOT appear for customers
            expect(screen.queryByText("VOLUNTEERS")).not.toBeInTheDocument();
            expect(screen.queryByText("Admin panel")).not.toBeInTheDocument();
            expect(screen.queryByText("Return Dishes")).not.toBeInTheDocument();
        });
    });

    it("Checks if each component redirects the user to the right page", async () => {
        const homeButton = screen.getByText("Home");
        const homeLink = homeButton.closest('a');

        const howItWorksButton = screen.getByText("How it works");
        const howItWorksLink = howItWorksButton.closest('a');

        const ourImpactButton = screen.getByText("Our impact");
        const ourImpactLink = ourImpactButton.closest('a');

        const logoutButton = screen.getByText("Logout");
        const logoutLink = logoutButton.closest('a');

        expect(homeLink?.getAttribute('href')).toBe('/home');
        expect(howItWorksLink?.getAttribute('href')).toBe('https://www.dishzero.ca/how-it-works-1')
        expect(ourImpactLink?.getAttribute('href')).toBe('https://www.dishzero.ca/impact')
        expect(logoutLink?.getAttribute('href')).toBe('/login')
    });

});

describe("Admin sidebar", () => {
    beforeEach(async () => {
        // Mock useAuth implementation for an admin role
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

    render(
        <Router>
            <Sidebar />
        </Router>
    )
    });

    it("Checks if sidebar is displayed with the correct components", async () => {
        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });
    
        await waitFor(() => {
            expect(screen.getByText("DishZero")).toBeInTheDocument();
            expect(screen.getByText("MENU")).toBeInTheDocument();
            expect(screen.getByText("Home")).toBeInTheDocument();

            expect(screen.getByText("VOLUNTEERS")).toBeInTheDocument();
            expect(screen.getByText("Admin panel")).toBeInTheDocument();
            expect(screen.getByText("Return Dishes")).toBeInTheDocument();

            expect(screen.getByText("How it works")).toBeInTheDocument();
            expect(screen.getByText("Our impact")).toBeInTheDocument();
            expect(screen.getByText("Logout")).toBeInTheDocument();
    
        });
    });

    it("Checks if each component redirects the user to the right page", async () => {
        const homeButton = screen.getByText("Home");
        const homeLink = homeButton.closest('a');

        const howItWorksButton = screen.getByText("How it works");
        const howItWorksLink = howItWorksButton.closest('a');

        const ourImpactButton = screen.getByText("Our impact");
        const ourImpactLink = ourImpactButton.closest('a');
        
        const adminPanelButton = screen.getByText("Admin panel");
        const adminPanelLink = adminPanelButton.closest('a');

        const returnDishesButton = screen.getByText("Return Dishes");
        const returnDishesLink = returnDishesButton.closest('a');

        const logoutButton = screen.getByText("Logout");
        const logoutLink = logoutButton.closest('a');

        expect(homeLink?.getAttribute('href')).toBe('/home');
        expect(adminPanelLink?.getAttribute('href')).toBe('/admin');
        expect(returnDishesLink?.getAttribute('href')).toBe('/volunteer/return');
        
        expect(howItWorksLink?.getAttribute('href')).toBe('https://www.dishzero.ca/how-it-works-1')
        expect(ourImpactLink?.getAttribute('href')).toBe('https://www.dishzero.ca/impact')

        expect(logoutLink?.getAttribute('href')).toBe('/login')
    });

});

describe("Volunteer sidebar", () => {
    beforeEach(async () => {
        // Mock useAuth implementation for a volunteer role
        useAuthMock.mockImplementation(() => ({
            currentUser: {
                id: 'mocked-user-id',
                role: 'volunteer',
                email: 'mocked-email@ualberta.ca'
            },
            sessionToken: 'mocked-session-token',
            login: jest.fn(),
            logout: jest.fn(),
        }));

        render(
            <Router>
                <Sidebar />
            </Router>
        )

    });

    it("Checks if sidebar is displayed with the correct components", async () => {
        await waitFor(() => {
            expect(screen.queryByTestId('ball-triangle-loading')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("DishZero")).toBeInTheDocument();
            expect(screen.getByText("MENU")).toBeInTheDocument();
            expect(screen.getByText("Home")).toBeInTheDocument();

            expect(screen.getByText("VOLUNTEERS")).toBeInTheDocument();
            expect(screen.getByText("Admin panel")).toBeInTheDocument();
            expect(screen.getByText("Return Dishes")).toBeInTheDocument();

            expect(screen.getByText("How it works")).toBeInTheDocument();
            expect(screen.getByText("Our impact")).toBeInTheDocument();
            expect(screen.getByText("Logout")).toBeInTheDocument();
        });
    });

    it("Checks if each component redirects the user to the right page", async () => {
        const homeButton = screen.getByText("Home");
        const homeLink = homeButton.closest('a');
     
        const howItWorksButton = screen.getByText("How it works");
        const howItWorksLink = howItWorksButton.closest('a');
     
        const ourImpactButton = screen.getByText("Our impact");
        const ourImpactLink = ourImpactButton.closest('a');
        
        const adminPanelButton = screen.getByText("Admin panel");
        const adminPanelLink = adminPanelButton.closest('a');
     
        const returnDishesButton = screen.getByText("Return Dishes");
        const returnDishesLink = returnDishesButton.closest('a');
     
        const logoutButton = screen.getByText("Logout");
        const logoutLink = logoutButton.closest('a');
     
        expect(homeLink?.getAttribute('href')).toBe('/home');
        expect(adminPanelLink?.getAttribute('href')).toBe('/admin');
        expect(returnDishesLink?.getAttribute('href')).toBe('/volunteer/return');
        
        expect(howItWorksLink?.getAttribute('href')).toBe('https://www.dishzero.ca/how-it-works-1')
        expect(ourImpactLink?.getAttribute('href')).toBe('https://www.dishzero.ca/impact')
     
        expect(logoutLink?.getAttribute('href')).toBe('/login')
    });

});
