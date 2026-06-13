const Blog = require('../../models/Blog');
const { getBlogs } = require('../blog');

// Mock the Blog model
jest.mock('../../models/Blog');

describe('Blog Controller - getBlogs Pagination Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    // Test 1: Default pagination (no params)
    test('should return page 1 with 10 blogs when no query params provided', async () => {
        const mockBlogs = Array(10).fill({
            _id: 'blog1',
            title: 'Test Blog',
            uploadDate: new Date(),
            category: 'Technology'
        });

        Blog.find = jest.fn().mockReturnThis();
        Blog.find().sort = jest.fn().mockReturnThis();
        Blog.find().sort().skip = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit().lean = jest.fn().mockResolvedValue(mockBlogs);
        Blog.countDocuments = jest.fn().mockResolvedValue(100);

        await getBlogs(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        const response = res.json.mock.calls[0][0];
        expect(response.blogs.length).toBe(10);
        expect(response.pagination.currentPage).toBe(1);
        expect(response.pagination.limit).toBe(10);
        expect(response.pagination.totalCount).toBe(100);
        expect(response.pagination.totalPages).toBe(10);
    });

    // Test 2: Pagination with valid page
    test('should return page 2 with 5 blogs when page=2&limit=5', async () => {
        req.query = { page: '2', limit: '5' };
        const mockBlogs = Array(5).fill({ _id: 'blog1' });

        Blog.find = jest.fn().mockReturnThis();
        Blog.find().sort = jest.fn().mockReturnThis();
        Blog.find().sort().skip = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit().lean = jest.fn().mockResolvedValue(mockBlogs);
        Blog.countDocuments = jest.fn().mockResolvedValue(50);

        await getBlogs(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        const response = res.json.mock.calls[0][0];
        expect(response.pagination.currentPage).toBe(2);
        expect(response.pagination.limit).toBe(5);
    });

    // Test 3: Limit clamping (too high)
    test('should clamp limit to max 50 when limit=100', async () => {
        req.query = { limit: '100' };
        const mockBlogs = Array(50).fill({ _id: 'blog1' });

        Blog.find = jest.fn().mockReturnThis();
        Blog.find().sort = jest.fn().mockReturnThis();
        Blog.find().sort().skip = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit().lean = jest.fn().mockResolvedValue(mockBlogs);
        Blog.countDocuments = jest.fn().mockResolvedValue(200);

        await getBlogs(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        const response = res.json.mock.calls[0][0];
        expect(response.pagination.limit).toBe(50);
    });

    // Test 4: Limit clamping (too low)
    test('should clamp limit to min 5 when limit=1', async () => {
        req.query = { limit: '1' };
        const mockBlogs = Array(5).fill({ _id: 'blog1' });

        Blog.find = jest.fn().mockReturnThis();
        Blog.find().sort = jest.fn().mockReturnThis();
        Blog.find().sort().skip = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit().lean = jest.fn().mockResolvedValue(mockBlogs);
        Blog.countDocuments = jest.fn().mockResolvedValue(50);

        await getBlogs(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        const response = res.json.mock.calls[0][0];
        expect(response.pagination.limit).toBe(5);
    });

    // Test 5: Page out of range
    test('should return 400 error when page exceeds totalPages', async () => {
        req.query = { page: '15' };

        Blog.find = jest.fn().mockReturnThis();
        Blog.find().sort = jest.fn().mockReturnThis();
        Blog.find().sort().skip = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit().lean = jest.fn().mockResolvedValue([]);
        Blog.countDocuments = jest.fn().mockResolvedValue(100);  // 10 pages max

        await getBlogs(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.message).toBe('Page out of range');
        expect(response.currentPage).toBe(15);
        expect(response.totalPages).toBe(10);
    });

    // Test 6: Empty result set
    test('should return empty blogs array when no blogs exist', async () => {
        Blog.find = jest.fn().mockReturnThis();
        Blog.find().sort = jest.fn().mockReturnThis();
        Blog.find().sort().skip = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit().lean = jest.fn().mockResolvedValue([]);
        Blog.countDocuments = jest.fn().mockResolvedValue(0);

        await getBlogs(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        const response = res.json.mock.calls[0][0];
        expect(response.blogs.length).toBe(0);
        expect(response.pagination.totalCount).toBe(0);
    });

    // Test 7: Database error handling
    test('should return 500 error when database query fails', async () => {
        Blog.find = jest.fn().mockImplementation(() => {
            throw new Error('Database connection failed');
        });

        await getBlogs(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        const response = res.json.mock.calls[0][0];
        expect(response.message).toBe('Server Error');
    });

    // Test 8: Pagination metadata
    test('should include hasNextPage and hasPrevPage in response', async () => {
        req.query = { page: '2' };
        const mockBlogs = Array(10).fill({ _id: 'blog1' });

        Blog.find = jest.fn().mockReturnThis();
        Blog.find().sort = jest.fn().mockReturnThis();
        Blog.find().sort().skip = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit = jest.fn().mockReturnThis();
        Blog.find().sort().skip().limit().lean = jest.fn().mockResolvedValue(mockBlogs);
        Blog.countDocuments = jest.fn().mockResolvedValue(100);

        await getBlogs(req, res);

        const response = res.json.mock.calls[0][0];
        expect(response.pagination.hasNextPage).toBe(true);
        expect(response.pagination.hasPrevPage).toBe(true);
    });
});
