import React from 'react';
import { render, waitFor } from '@testing-library/react';

import App from './App';
import { fetchUsername } from './api';

jest.mock('./api');

test('renders username correctly', async () => {
    const mockData = 'Mocked Data';
    fetchUsername.mockResolvedValue(mockData);

    const { getByText } = render(<App />);

    // Ensure loading state is rendered initially
    expect(getByText(/Loading.. please wait!/i)).toBeInTheDocument();

    // Wait for the component to update with the mocked data
    await waitFor(() => {
        expect(`Hello ${mockData}`).toBeInTheDocument();
    });
});

test('handles API error correctly', async () => {
    const errorMessage = 'API Error';
    fetchUsername.mockRejectedValue(new Error(errorMessage));

    const { getByText } = render(<App />);

    // Ensure loading state is rendered initially
    expect(getByText(/Loading.. please wait!/i)).toBeInTheDocument();

    // Wait for the component to update with the mocked data
    await waitFor(() => {
        expect(`Hello ${errorMessage}`).toBeInTheDocument();
    });
});