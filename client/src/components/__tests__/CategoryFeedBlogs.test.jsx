import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';

// ─── Mocks (must be declared before importing the component under test) ───────

jest.mock('axios', () => ({
    get: jest.fn()
}));

jest.mock('../../helper/variables', () => ({
    base_url: '/',
    api_url: 'http://localhost:7000/'
}));

jest.mock('../../helper/getShortSummary', () => {
    return jest.fn((summary) => summary);
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

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import axios from 'axios';
import CategoryFeedBlogs from '../CategoryFeedBlogs';
import CategoryHeaderTabs from '../CategoryHeaderTabs';

// ─── Shared test data ─────────────────────────────────────────────────────────

const makeMockBlogs = (count = 10, category = 'Technology') =>
    Array(count).fill(null).map((_, i) => ({
        _id: `blog${i}`,
        title: `Blog ${i}`,
        summary: `Summary for blog ${i}`,
        content: `Content ${i}`,
        userId: 'user1',
        username: 'testuser',
        name: 'Test User',
        imageUrl: 'https://example.com/image.jpg',
        uploadDate: new Date('2025-06-01'),
        category
    }));

const makePaginationResponse = (blogs, currentPage = 1, totalPages = 10) => ({
    data: {
        blogs,
        pagination: {
            currentPage,
            totalPages,
            totalCount: blogs.length * totalPages,
            limit: 10,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        }
    }
});

// ─── Render helpers ───────────────────────────────────────────────────────────

const renderWithRouter = (component) =>
    render(<BrowserRouter>{component}</BrowserRouter>);

const renderCategoryFeedBlogs = (categoryName) =>
    render(
        <MemoryRouter initialEntries={[`/posts/tag/${categoryName}`]}>
            <Routes>
                <Route
                    path="/posts/tag/:categoryName"
                    element={<CategoryFeedBlogs categoryName={categoryName} />}
                />
            </Routes>
        </MemoryRouter>
    );

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('CategoryFeedBlogs — core fetch and render', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ── Test 1 ────────────────────────────────────────────────────────────────
    test('1: reads URL param and calls API with category=Technology', async () => {
        const mockBlogs = makeMockBlogs(10, 'Technology');
        axios.get.mockResolvedValueOnce(makePaginationResponse(mockBlogs, 1, 5));

        renderCategoryFeedBlogs('Technology');

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('category=Technology')
            );
        });
    });

    // ── Test 2 ────────────────────────────────────────────────────────────────
    test('2: renders all 10 short blog items', async () => {
        const mockBlogs = makeMockBlogs(10, 'Technology');
        axios.get.mockResolvedValueOnce(makePaginationResponse(mockBlogs, 1, 5));

        renderCategoryFeedBlogs('Technology');

        await waitFor(() => {
            expect(screen.getByText('Blog 0')).toBeInTheDocument();
            expect(screen.getByText('Blog 9')).toBeInTheDocument();
        });
    });

    // ── Test 3 ────────────────────────────────────────────────────────────────
    test('3: category change resets page to 1 and refetches', async () => {
        const techBlogs = makeMockBlogs(10, 'Technology');
        const sciBlogs  = makeMockBlogs(10, 'Science');

        axios.get
            .mockResolvedValueOnce(makePaginationResponse(techBlogs, 1, 3))
            .mockResolvedValueOnce(makePaginationResponse(sciBlogs,  1, 2));

        const { rerender } = render(
            <BrowserRouter>
                <CategoryFeedBlogs categoryName="Technology" />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getByText('Blog 0')).toBeInTheDocument());

        rerender(
            <BrowserRouter>
                <CategoryFeedBlogs categoryName="Science" />
            </BrowserRouter>
        );

        await waitFor(() => {
            const secondCall = axios.get.mock.calls[1][0];
            expect(secondCall).toContain('category=Science');
            expect(secondCall).toContain('page=1');
        });
    });

    // ── Test 4 ────────────────────────────────────────────────────────────────
    test('4: shows "No posts to show" when blogs array is empty', async () => {
        axios.get.mockResolvedValueOnce(makePaginationResponse([], 1, 1));

        renderCategoryFeedBlogs('Technology');

        await waitFor(() => {
            expect(screen.getByText('No posts to show')).toBeInTheDocument();
        });
    });

    // ── Test 5 ────────────────────────────────────────────────────────────────
    test('5: shows loading state while fetching', async () => {
        let resolvePromise;
        const pending = new Promise(resolve => { resolvePromise = resolve; });
        axios.get.mockReturnValueOnce(pending);

        renderCategoryFeedBlogs('Technology');

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        resolvePromise(makePaginationResponse(makeMockBlogs(10), 1, 5));

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });
    });

    // ── Test 6 ────────────────────────────────────────────────────────────────
    test('6: shows error message on fetch failure', async () => {
        axios.get.mockRejectedValueOnce({
            response: { data: { message: 'Server Error' } }
        });

        renderCategoryFeedBlogs('Technology');

        await waitFor(() => {
            expect(screen.getByText('Error: Server Error')).toBeInTheDocument();
        });
    });
});


describe('CategoryFeedBlogs — pagination controls', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ── Test 7 ────────────────────────────────────────────────────────────────
    test('7: renders pagination controls when totalPages > 1', async () => {
        axios.get.mockResolvedValueOnce(makePaginationResponse(makeMockBlogs(10), 1, 3));

        renderCategoryFeedBlogs('Technology');

        await waitFor(() => {
            expect(screen.getByText('← Previous')).toBeInTheDocument();
            expect(screen.getByText('Next →')).toBeInTheDocument();
        });
    });

    // ── Test 8 ────────────────────────────────────────────────────────────────
    test('8: Previous button is disabled on page 1', async () => {
        axios.get.mockResolvedValueOnce(makePaginationResponse(makeMockBlogs(10), 1, 3));

        renderCategoryFeedBlogs('Technology');

        await waitFor(() => {
            expect(screen.getByText('← Previous')).toBeDisabled();
        });
    });

    // ── Test 9 ────────────────────────────────────────────────────────────────
    test('9: clicking Next triggers fetch with page=2 and same category', async () => {
        axios.get
            .mockResolvedValueOnce(makePaginationResponse(makeMockBlogs(10), 1, 3))
            .mockResolvedValueOnce(makePaginationResponse(makeMockBlogs(10), 2, 3));

        renderCategoryFeedBlogs('Technology');

        await waitFor(() => expect(screen.getByText('Next →')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Next →'));

        await waitFor(() => {
            const secondCall = axios.get.mock.calls[1][0];
            expect(secondCall).toContain('page=2');
            expect(secondCall).toContain('category=Technology');
        });
    });
});


describe('CategoryHeaderTabs — active tab styling', () => {
    // ── Test 10 ───────────────────────────────────────────────────────────────
    test('10: active tab has category-tab-item--active class; others do not', () => {
        renderWithRouter(
            <CategoryHeaderTabs activeCategoryName="Science" />
        );

        // 'Science' is in the static categories.js list — it should be active
        const activeLink = screen.getByText('Science');
        expect(activeLink).toHaveClass('category-tab-item--active');

        // Other tabs must NOT have the active class
        const sportsLink = screen.getByText('Sports');
        expect(sportsLink).not.toHaveClass('category-tab-item--active');

        const programmingLink = screen.getByText('Programming');
        expect(programmingLink).not.toHaveClass('category-tab-item--active');
    });
});
