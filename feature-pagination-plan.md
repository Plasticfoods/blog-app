# Feature Plan: Server-Side Pagination with Offset & Sorting

## Overview

**Objective**: Implement offset-based pagination on the homepage to fetch and display blog posts in chunks of 10, with support for page navigation, sorting, and category filtering.

**Approach**: 
- Backend: Modify `GET /posts` to accept `page`, `limit`, `sortBy`, `order`, and `category` query parameters
- Database: Add indexes on `uploadDate` and `category` for query optimization
- Frontend: Update `ShortBlogs.jsx` to support pagination controls and dynamic page fetching
- Response shape: Include metadata (`totalCount`, `totalPages`, `currentPage`) alongside blog array

**Scope**: Homepage pagination only. User profile pages (already fetch filtered blogs) are out of scope.

---

## Architecture Decision: Offset-Based Pagination

| Aspect | Decision |
|--------|----------|
| **Strategy** | Skip-based pagination: `skip = (page - 1) * limit` |
| **Query params** | `page`, `limit`, `sortBy` (`uploadDate` or `category`), `order` (`asc`/`desc`) |
| **Response** | `{ blogs: [...], pagination: {...} }` |
| **Default behavior** | `page=1`, `limit=10`, `sortBy=uploadDate`, `order=desc` |
| **Limits** | Min `limit=5`, max `limit=50` to prevent abuse |
| **DB Indexes** | Create compound index on `(uploadDate, _id)` and single index on `category` |

---

## Phase 1: Backend API Enhancement

### Step 1.1: Update Blog Model with Indexes
**File**: `server/models/Blog.js`

**Current state**: Schema defined, no indexes

**Changes required**:
```javascript
// Add after schema definition (after line 34):
blogSchema.index({ uploadDate: -1 });  // For sorting by date
blogSchema.index({ category: 1 });      // For category filtering
blogSchema.index({ uploadDate: -1, _id: -1 });  // Compound index for efficient pagination
```

**Why**: Without indexes, `skip()` becomes increasingly slow as page numbers grow. These indexes make pagination efficient up to 10,000+ posts.

---

### Step 1.2: Refactor `getBlogs` Controller
**File**: `server/controllers/blog.js`

**Current implementation** (lines 8-17):
```javascript
const getBlogs = async (req, res) => {
    try {
        const blogDocs = await Blog.find();
        setTimeout(() => {
            res.status(200).json(blogDocs);
        }, 4000);
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({message: 'Server Error'})
    }
}
```

**New implementation** (replace entire function):
```javascript
const getBlogs = async (req, res) => {
    try {
        // Parse query parameters
        const page = Math.max(1, parseInt(req.query.page) || 1);         // Default: page 1
        const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 10));  // Clamp 5-50
        const sortBy = ['uploadDate', 'category'].includes(req.query.sortBy) ? req.query.sortBy : 'uploadDate';
        const order = req.query.order === 'asc' ? 1 : -1;                // Default: desc
        const category = req.query.category ? req.query.category.trim() : null;

        // Build filter query
        const filter = {};
        if (category && category !== 'All') {
            filter.category = category;
        }

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Execute parallel queries for efficiency
        const [blogs, totalCount] = await Promise.all([
            Blog.find(filter)
                .sort({ [sortBy]: order, _id: -1 })  // Secondary sort by _id for consistency
                .skip(skip)
                .limit(limit)
                .lean(),  // Use lean() for faster queries since we don't modify docs
            Blog.countDocuments(filter)
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);

        // Validate page number
        if (page > totalPages && totalCount > 0) {
            return res.status(400).json({
                message: 'Page out of range',
                currentPage: page,
                totalPages: totalPages
            });
        }

        // Remove artificial delay (was line 11 in original)
        // Send response with pagination metadata
        res.status(200).json({
            blogs: blogs,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalCount: totalCount,
                limit: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } 
    catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
```

**Key changes**:
- Lines 10-14: Parse and validate query parameters with safe defaults
- Lines 16-19: Build filter for category (if provided)
- Lines 21-22: Calculate skip value
- Lines 24-32: Parallel queries for blogs + count (more efficient)
- Lines 34-35: Calculate total pages
- Lines 37-41: Validate page number, return error if out of range
- Lines 46-57: New response structure with pagination metadata
- Line removed: 4-second `setTimeout` (performance improvement)

**Error cases handled**:
- Invalid `page` (non-numeric): defaults to 1
- Invalid `limit` (out of bounds): clamped to [5, 50]
- Invalid `sortBy`: defaults to `uploadDate`
- Page > totalPages: returns 400 with useful metadata
- Database error: returns 500 with error message

---

### Step 1.3: Update Post Route (No changes needed)
**File**: `server/routes/post.js`

**Current state** (line 13):
```javascript
router.get("/", blogController.getBlogs);
```

**Action**: No changes required. Route already handles all query parameters via `req.query`, which the controller now processes.

---

## Phase 2: Frontend Implementation

### Step 2.1: Update ShortBlogs Component
**File**: `client/src/components/ShortBlogs.jsx`

**Current implementation** (lines 29-46):
```javascript
useEffect(() => {
    const fetchBlogsData = async() => {
        setLoading(true)
        try {
            const response = await axios.get(`${api_url}posts`)
            setBlogs(response.data)
        } catch (err) { ... }
        finally {
            setLoading(false)
        }
    }
    fetchBlogsData()
}, [])
```

**New implementation** (replace lines 29-46):

Add state management (top of component, after existing imports):
```javascript
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [selectedCategory, setSelectedCategory] = useState('All');
const [sortBy, setSortBy] = useState('uploadDate');  // 'uploadDate' or 'category'
const [order, setOrder] = useState('desc');  // 'desc' or 'asc'
const [loading, setLoading] = useState(false);
const [blogs, setBlogs] = useState([]);
```

Replace useEffect hook (lines 29-46):
```javascript
useEffect(() => {
    fetchBlogsData(currentPage, selectedCategory, sortBy, order);
}, [currentPage, selectedCategory, sortBy, order]);

const fetchBlogsData = async (page, category, sort, direction) => {
    setLoading(true);
    try {
        const params = new URLSearchParams({
            page: page,
            limit: 10,
            sortBy: sort,
            order: direction,
            category: category
        });

        const response = await axios.get(`${api_url}posts?${params}`);
        
        // Handle new response structure with pagination metadata
        if (response.data.pagination) {
            setBlogs(response.data.blogs);
            setTotalPages(response.data.pagination.totalPages);
        } else {
            // Fallback for legacy API responses (if needed during transition)
            setBlogs(response.data);
            setTotalPages(1);
        }
    } catch (err) {
        console.error('Error fetching blogs:', err);
        setBlogs([]);
        setTotalPages(1);
        // Keep existing error handling UI
    } finally {
        setLoading(false);
    }
};
```

Add pagination handlers (before return statement):
```javascript
const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });  // Scroll to top on page change
    }
};

const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);  // Reset to page 1 when sort changes
};

const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
    setCurrentPage(1);
};

const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);  // Reset to page 1 when category changes
};
```

Update JSX return (add pagination controls before/after blogs list):
```javascript
// Before blogs list: Category/Sort controls
<div className="pagination-controls mb-6 flex gap-4 flex-wrap items-center">
    {/* Category selector (use existing Tag component if available) */}
    <select 
        value={selectedCategory} 
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="px-3 py-2 border rounded"
    >
        <option value="All">All Categories</option>
        <option value="Technology">Technology</option>
        <option value="Travel">Travel</option>
        <option value="Food">Food</option>
        <option value="Lifestyle">Lifestyle</option>
        <option value="Other">Other</option>
    </select>

    {/* Sort selector */}
    <select 
        value={sortBy} 
        onChange={(e) => handleSortChange(e.target.value)}
        className="px-3 py-2 border rounded"
    >
        <option value="uploadDate">Sort by Date</option>
        <option value="category">Sort by Category</option>
    </select>

    {/* Order toggle */}
    <button 
        onClick={() => handleOrderChange(order === 'desc' ? 'asc' : 'desc')}
        className="px-3 py-2 border rounded"
    >
        {order === 'desc' ? '↓ Newest' : '↑ Oldest'}
    </button>
</div>

// After blogs list: Pagination controls
<div className="pagination-footer mt-8 flex justify-center gap-2 items-center">
    <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded disabled:opacity-50"
    >
        ← Previous
    </button>
    
    <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
    </span>
    
    <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded disabled:opacity-50"
    >
        Next →
    </button>
</div>
```

**Key changes**:
- Lines (state): Added pagination-related state variables
- Lines (useEffect): Now dependency array triggers on pagination/filter changes
- Lines (fetchBlogsData): Constructs query params, handles new response structure
- Lines (handlers): Pagination, sort, category, order handlers
- Lines (JSX): Category/sort controls + pagination buttons

**Integration points**:
- Uses existing `Tag` component pattern if available (optional enhancement)
- Uses existing loading/error UI patterns
- Maintains Tailwind CSS classes for consistency

---

### Step 2.2: Update Main Component (if needed)
**File**: `client/src/components/Main.jsx`

**Current state**: Passes `blogs` prop to `ShortBlogs` component (line 19)

**Action**: Verify that `Main.jsx` simply passes data to `ShortBlogs.jsx` without filtering. If it does custom filtering, remove it and rely on backend filtering instead. No code changes expected if component already delegates to ShortBlogs.

---

## Phase 3: Database Optimization

### Step 3.1: Add Database Indexes

**File**: `server/models/Blog.js` (already covered in Step 1.1)

**MongoDB queries to verify** (run in MongoDB CLI after deployment):
```javascript
// Check indexes were created
db.blogs.getIndexes()

// Expected output should include:
// { "key": { "uploadDate": -1 }, "name": "uploadDate_-1" }
// { "key": { "category": 1 }, "name": "category_1" }
// { "key": { "uploadDate": -1, "_id": -1 }, "name": "uploadDate_-1__id_-1" }
```

**Performance baseline** (before/after comparison):
- Before: `db.blogs.find().skip(500).limit(10)` → ~50-100ms (no index)
- After: `db.blogs.find().skip(500).limit(10)` → ~5-10ms (with index)

---

## Phase 4: Error Handling & Edge Cases

### Backend Error Responses

| Scenario | Status | Response |
|----------|--------|----------|
| Valid request | 200 | `{ blogs: [...], pagination: {...} }` |
| Page out of range | 400 | `{ message: 'Page out of range', currentPage: 5, totalPages: 3 }` |
| Invalid limit | 200 | Auto-clamped to [5, 50]; request processed |
| Category not found | 200 | Returns `{ blogs: [], pagination: { totalCount: 0, ... } }` |
| Database error | 500 | `{ message: 'Server Error' }` |

### Frontend Error Handling

| Scenario | Behavior |
|----------|----------|
| Network error on fetch | Keeps current page, shows error toast/message |
| Page out of range (400 response) | Redirect to last valid page, show message |
| No blogs found | Show "No blogs" message; pagination controls disabled |
| Slow network | Loading spinner shown during fetch |

---

## API Contract & Examples

### Request Format
```
GET /posts?page=2&limit=10&sortBy=uploadDate&order=desc&category=Technology
```

### Response Format (Success - 200)
```json
{
  "blogs": [
    {
      "_id": "64a2f8c1b9d2e1a5c3f7e4b1",
      "title": "My First Blog Post",
      "summary": "A quick summary...",
      "content": "Full blog content...",
      "userId": "64a2f1a9b9d2e1a5c3f7e4b0",
      "username": "johndoe",
      "name": "John Doe",
      "imageUrl": "https://cloudinary.com/...",
      "uploadDate": "2025-06-01T10:30:00Z",
      "category": "Technology"
    },
    ...
  ],
  "pagination": {
    "currentPage": 2,
    "totalPages": 15,
    "totalCount": 147,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

### Response Format (Error - 400)
```json
{
  "message": "Page out of range",
  "currentPage": 20,
  "totalPages": 15
}
```

---

## Test Cases & Validation

### Backend Unit Tests (Jest + Supertest)

**File to create**: `server/controllers/__tests__/blog.test.js`

**Test cases**:

1. **Default pagination (no params)**
   - Request: `GET /posts`
   - Expected: Page 1, 10 blogs, descending by uploadDate
   - Assert: `response.status === 200`, `response.body.pagination.currentPage === 1`, `response.body.blogs.length <= 10`

2. **Pagination with valid page**
   - Request: `GET /posts?page=2&limit=5`
   - Expected: Page 2 with 5 blogs (if exists)
   - Assert: `response.body.pagination.currentPage === 2`, `response.body.pagination.limit === 5`

3. **Limit clamping (too high)**
   - Request: `GET /posts?limit=100`
   - Expected: Clamped to max 50
   - Assert: `response.body.pagination.limit === 50`

4. **Limit clamping (too low)**
   - Request: `GET /posts?limit=1`
   - Expected: Clamped to min 5
   - Assert: `response.body.pagination.limit === 5`

5. **Page out of range**
   - Setup: 100 blogs, 10 per page (10 pages max)
   - Request: `GET /posts?page=15`
   - Expected: 400 error
   - Assert: `response.status === 400`, `response.body.message === 'Page out of range'`

6. **Sorting by uploadDate descending**
   - Request: `GET /posts?sortBy=uploadDate&order=desc`
   - Expected: Newest blogs first
   - Assert: First blog's `uploadDate > second blog's uploadDate`

7. **Sorting by uploadDate ascending**
   - Request: `GET /posts?sortBy=uploadDate&order=asc`
   - Expected: Oldest blogs first
   - Assert: First blog's `uploadDate < second blog's uploadDate`

8. **Category filter**
   - Request: `GET /posts?category=Technology`
   - Expected: Only blogs with `category === 'Technology'`
   - Assert: All blogs in response have `category === 'Technology'`

9. **Category filter + pagination**
   - Request: `GET /posts?category=Technology&page=2&limit=5`
   - Expected: Page 2 of Technology blogs, 5 per page
   - Assert: All conditions combined work correctly

10. **Invalid sortBy parameter (falls back to default)**
    - Request: `GET /posts?sortBy=invalid`
    - Expected: Defaults to uploadDate
    - Assert: Blogs sorted by uploadDate desc

11. **Empty result set**
    - Request: `GET /posts?category=NonExistentCategory`
    - Expected: Empty blogs array, totalCount=0
    - Assert: `response.body.blogs.length === 0`, `response.body.pagination.totalCount === 0`

12. **Database error handling**
    - Setup: Mock Blog.find() to throw error
    - Expected: 500 response
    - Assert: `response.status === 500`, `response.body.message === 'Server Error'`

### Frontend Integration Tests (React Testing Library)

**File to create**: `client/src/components/__tests__/ShortBlogs.test.jsx`

**Test cases**:

1. **Initial load with default page 1**
   - Action: Component mounts
   - Expected: Calls API with `page=1&limit=10`
   - Assert: Blogs rendered, "Page 1 of X" displayed

2. **Next button increments page**
   - Setup: Render component with mocked API (3 pages total)
   - Action: Click "Next →" button
   - Expected: Calls API with `page=2`
   - Assert: Page counter updates to "Page 2 of 3"

3. **Previous button decrements page**
   - Setup: Initial page is 2
   - Action: Click "← Previous" button
   - Expected: Calls API with `page=1`
   - Assert: Page counter updates to "Page 1 of 3"

4. **Previous button disabled on page 1**
   - Setup: Page is 1
   - Expected: "← Previous" button has `disabled` attribute
   - Assert: Button cannot be clicked

5. **Next button disabled on last page**
   - Setup: Page is 3 (totalPages=3)
   - Expected: "Next →" button has `disabled` attribute
   - Assert: Button cannot be clicked

6. **Category filter changes page to 1**
   - Setup: Currently on page 3
   - Action: Change category dropdown
   - Expected: API called with new category AND `page=1`
   - Assert: currentPage state resets to 1

7. **Sort changes trigger new fetch**
   - Action: Change sort dropdown
   - Expected: API called with new `sortBy` parameter
   - Assert: Blogs re-rendered with new sort order

8. **Order toggle affects sort direction**
   - Action: Click order toggle (↓ Newest → ↑ Oldest)
   - Expected: API called with `order=asc` instead of `order=desc`
   - Assert: Button label changes

9. **Scroll to top on page change**
   - Action: Click "Next →" button
   - Expected: `window.scrollTo({ top: 0, behavior: 'smooth' })` called
   - Assert: Page scrolls to top

10. **Loading spinner shown during fetch**
    - Setup: Slow mock API response
    - Expected: Loading spinner visible before response
    - Assert: Spinner disappears after response received

11. **Error handling (network failure)**
    - Setup: Mock API to reject
    - Action: Component tries to fetch
    - Expected: Blogs array empty, error state handled
    - Assert: Component shows error message or empty state

12. **Pagination metadata parsed correctly**
    - Setup: Mock API returns `pagination: { totalPages: 5, hasNextPage: true, ... }`
    - Expected: totalPages state = 5, next button enabled
    - Assert: State updated correctly

### End-to-End Test Scenario

**File to create**: `e2e/pagination.spec.js` (using Cypress or Playwright)

```javascript
describe('Homepage Pagination Flow', () => {
  it('should load first page of blogs, navigate to page 2, and filter by category', () => {
    cy.visit('http://localhost:3000/');
    
    // Wait for initial load
    cy.get('[data-testid="blog-item"]').should('have.length', 10);
    cy.contains('Page 1 of').should('be.visible');
    
    // Verify first page blogs are loaded
    cy.get('[data-testid="blog-title"]').first().should('contain', 'Blog Title');
    
    // Navigate to page 2
    cy.contains('Next →').click();
    cy.contains('Page 2 of').should('be.visible');
    cy.get('[data-testid="blog-item"]').should('have.length', 10);
    
    // Filter by category
    cy.get('select').first().select('Technology');
    cy.contains('Page 1 of').should('be.visible');  // Should reset to page 1
    cy.get('[data-testid="blog-item"]').each(blog => {
      cy.wrap(blog).should('contain', 'Technology');
    });
    
    // Change sort order
    cy.get('button:contains("↓ Newest")').click();
    cy.get('button:contains("↑ Oldest")').should('be.visible');
  });
});
```

---

## Implementation Steps Summary

### Backend (Phase 1)
- [ ] Step 1.1: Add indexes to Blog model
- [ ] Step 1.2: Refactor getBlogs controller with pagination logic
- [ ] Step 1.3: Verify route requires no changes

### Frontend (Phase 2)
- [ ] Step 2.1: Update ShortBlogs.jsx with state management, fetch function, handlers, and UI
- [ ] Step 2.2: Verify Main.jsx doesn't need changes

### Database (Phase 3)
- [ ] Step 3.1: Create indexes and verify query performance

### Testing (Phase 4)
- [ ] Create backend unit tests
- [ ] Create frontend integration tests
- [ ] Create e2e test scenario
- [ ] Run all tests and verify coverage

### Verification Checklist (Phase 5)
- [ ] Manually test pagination: default load, next/prev navigation
- [ ] Verify category filtering works and resets page to 1
- [ ] Verify sorting (by date, ascending/descending) works correctly
- [ ] Confirm page-out-of-range error handling (400 response)
- [ ] Check database performance: indexes created, queries optimized
- [ ] Verify no artificial delay remains in response
- [ ] Confirm all query parameters are sanitized and validated
- [ ] Test edge cases: 0 blogs, 1 blog, exactly 10 blogs, 11+ blogs
- [ ] Verify Tailwind CSS styling is consistent
- [ ] Check responsive design on mobile (pagination controls stack properly)
- [ ] Verify error messages display correctly on network failure
- [ ] Confirm all tests pass with >80% coverage

---

## Rollback & Migration Strategy

If issues arise in production:

1. **Revert backend**: Restore original `getBlogs` function (still accepts new query params but ignores them)
   - Old clients: Still work with plain `GET /posts` → returns all blogs
   - New clients: Can degrade gracefully if API reverted

2. **Remove frontend pagination**: Revert `ShortBlogs.jsx` to simple all-blogs fetch
   - State: `setBlogs(response.data.blogs)` or `setBlogs(response.data)` if reverted endpoint

3. **Keep database indexes**: Leaving indexes doesn't hurt; they're beneficial if/when re-enabled

4. **Timeline**: Should take <30 minutes to fully revert if needed

---

## Performance Expectations

| Metric | Before | After |
|--------|--------|-------|
| Initial page load | ~4sec (artificial delay) + network | ~500-1000ms |
| Page 1 response size | All blogs (variable) | 10 blogs + metadata (~50KB) |
| Database query time | Full collection scan | <10ms (with indexes) |
| Frontend rendering | All blogs at once | 10 blogs per page (much faster) |
| User experience | Wait, then full page | Pagination controls + quick navigation |

---

## Known Limitations & Future Enhancements

1. **No full-text search**: Consider adding search param in future iteration
2. **No favorites/bookmarks**: Pagination doesn't interfere with this feature
3. **No infinite scroll**: Offset-based doesn't lend itself well; consider Option B if needed later
4. **Single-column list**: If multi-column grid is needed, pagination UI may need adjustment
5. **Cache invalidation**: No caching layer; each request hits DB (acceptable for this volume)

---

## Files Modified Summary

| File | Type | Changes |
|------|------|---------|
| `server/models/Blog.js` | Schema | +3 indexes |
| `server/controllers/blog.js` | Logic | Replace getBlogs function (+60 lines) |
| `server/routes/post.js` | Routes | No changes |
| `client/src/components/ShortBlogs.jsx` | Component | +state, +handlers, +API call logic, +UI controls (+80 lines) |
| `client/src/components/Main.jsx` | Component | No changes |
| `server/controllers/__tests__/blog.test.js` | Tests | New file (12 test cases) |
| `client/src/components/__tests__/ShortBlogs.test.jsx` | Tests | New file (12 test cases) |
| `e2e/pagination.spec.js` | Tests | New file (1 scenario) |

---

## Glossary

- **Offset**: Number of records to skip before returning results (e.g., page 2 = skip 10 records)
- **Limit**: Maximum number of records to return per request (e.g., 10 blogs per page)
- **Index**: Database structure for fast lookups on specific fields (uploadDate, category)
- **Lean query**: Mongoose optimization that returns plain JS objects instead of full documents
- **Pagination metadata**: `totalPages`, `currentPage`, `hasNextPage`, `hasPrevPage`, etc.
- **Sort order**: `asc` (ascending/oldest first) or `desc` (descending/newest first)
- **Filter**: Query constraint (e.g., `category=Technology`) to reduce result set

---

## Questions Before Implementation?

If any step is unclear or requires clarification, flag it now before handoff to implementation agent. This plan is designed to be self-contained and directly usable as implementation prompt context.
