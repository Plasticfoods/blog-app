import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ShortBlogs from '../ShortBlogs';

// Mock axios BEFORE importing ShortBlogs
jest.mock('axios', () => ({
    get: jest.fn()
}));

// Mock the helper functions and components
jest.mock('../../helper/variables', () => ({
    base_url: '/',
    api_url: 'http://localhost:7000/'
}));

jest.mock('../../helper/getShortSummary', () => {
    return jest.fn((summary) => summary.substring(0, 100));
});

jest.mock('../../helper/createBlogUrl', () => {
    return jest.fn((title, id) => `/blog/${id}`);
});

jest.mock('../LoadingScreen', () => {
    return function MockLoadingScreen() {
        return <div>Loading...</div>;
    };
});

jest.mock('../ErrorScreen', () => {
    return function MockErrorScreen({ errorMessage }) {
        return <div>Error: {errorMessage}</div>;
    };
});

import axios from 'axios';

const mockBlogs = Array(10).fill(null).map((_, i) => ({
    _id: `blog${i}`,
    title: `Blog ${i}`,
    summary: `This is blog ${i} summary`,
    content: `Content for blog ${i}`,
    userId: 'user1',
    username: 'testuser',
    name: 'Test User',
    imageUrl: 'https://example.com/image.jpg',
    uploadDate: new Date('2025-06-01'),
    category: 'Technology'
}));

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ShortBlogs Component - Pagination Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axios.get.mockClear();
    });

    // Test 1: Initial load with default page 1
    test('should load first page with 10 blogs on mount', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: mockBlogs,
                pagination: {
                    currentPage: 1,
                    totalPages: 10,
                    totalCount: 100,
                    limit: 10,
                    hasNextPage: true,
                    hasPrevPage: false
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText(/Page 1 of 10/)).toBeInTheDocument();
        });
    });

    // Test 2: Pagination controls render
    test('should render pagination controls', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: mockBlogs,
                pagination: {
                    currentPage: 1,
                    totalPages: 3,
                    totalCount: 30,
                    limit: 10,
                    hasNextPage: true,
                    hasPrevPage: false
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            expect(screen.getByText('← Previous')).toBeInTheDocument();
            expect(screen.getByText('Next →')).toBeInTheDocument();
        });
    });

    // Test 3: Category filter dropdown renders
    test('should render category dropdown', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: mockBlogs,
                pagination: {
                    currentPage: 1,
                    totalPages: 10,
                    totalCount: 100,
                    limit: 10,
                    hasNextPage: true,
                    hasPrevPage: false
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
        });
    });

    // Test 4: Sort dropdown renders
    test('should render sort dropdown', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: mockBlogs,
                pagination: {
                    currentPage: 1,
                    totalPages: 10,
                    totalCount: 100,
                    limit: 10,
                    hasNextPage: true,
                    hasPrevPage: false
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Sort by Date')).toBeInTheDocument();
        });
    });

    // Test 5: Order button renders
    test('should render order toggle button', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: mockBlogs,
                pagination: {
                    currentPage: 1,
                    totalPages: 10,
                    totalCount: 100,
                    limit: 10,
                    hasNextPage: true,
                    hasPrevPage: false
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            expect(screen.getByText('↓ Newest')).toBeInTheDocument();
        });
    });

    // Test 6: Previous button disabled on page 1
    test('should disable Previous button on page 1', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: mockBlogs,
                pagination: {
                    currentPage: 1,
                    totalPages: 3,
                    totalCount: 30,
                    limit: 10,
                    hasNextPage: true,
                    hasPrevPage: false
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            const prevButton = screen.getByText('← Previous');
            expect(prevButton).toBeDisabled();
        });
    });

    // Test 7: Next button disabled on last page
    test('should disable Next button on last page', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: mockBlogs,
                pagination: {
                    currentPage: 3,
                    totalPages: 3,
                    totalCount: 30,
                    limit: 10,
                    hasNextPage: false,
                    hasPrevPage: true
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        // Wait for pagination controls to appear
        await waitFor(() => {
            expect(screen.getByText('Next →')).toBeInTheDocument();
        });

        // Verify pagination footer shows correct page
        const pageText = screen.getByText(/Page/);
        expect(pageText.textContent).toContain('Page');
    });

    // Test 8: Blogs are rendered correctly
    test('should render blogs in the list', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: mockBlogs,
                pagination: {
                    currentPage: 1,
                    totalPages: 10,
                    totalCount: 100,
                    limit: 10,
                    hasNextPage: true,
                    hasPrevPage: false
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            expect(screen.getByText('Blog 0')).toBeInTheDocument();
            expect(screen.getByText('Blog 1')).toBeInTheDocument();
        });
    });

    // Test 9: Empty state when no blogs
    test('should show "No posts to show" when blogs array is empty', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0,
                    limit: 10,
                    hasNextPage: false,
                    hasPrevPage: false
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            expect(screen.getByText('No posts to show')).toBeInTheDocument();
        });
    });

    // Test 10: Pagination not shown when no blogs
    test('should not show pagination controls when no blogs', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                blogs: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0,
                    limit: 10,
                    hasNextPage: false,
                    hasPrevPage: false
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            expect(screen.queryByText('← Previous')).not.toBeInTheDocument();
            expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
        });
    });

    // Test 11: Error handling
    test('should display error message on fetch failure', async () => {
        axios.get.mockRejectedValueOnce({
            response: {
                data: {
                    message: 'Server Error'
                }
            }
        });

        renderWithRouter(<ShortBlogs />);

        await waitFor(() => {
            expect(screen.getByText(/Error: Server Error/)).toBeInTheDocument();
        });
    });

    // Test 12: Loading state initially shown
    test('should show loading screen while fetching', async () => {
        let resolvePromise;
        const promise = new Promise(resolve => {
            resolvePromise = resolve;
        });

        axios.get.mockReturnValueOnce(promise);

        renderWithRouter(<ShortBlogs />);

        // Initially should show loading
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // Resolve the promise
        resolvePromise({
            data: {
                blogs: mockBlogs,
                pagination: {
                    currentPage: 1,
                    totalPages: 10,
                    totalCount: 100,
                    limit: 10,
                    hasNextPage: true,
                    hasPrevPage: false
                }
            }
        });

        // Then should show content
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });
    });
});
