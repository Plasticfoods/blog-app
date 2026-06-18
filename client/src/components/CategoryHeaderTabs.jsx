import { Link } from 'react-router-dom';
import categories from '../helper/categories';

/**
 * CategoryHeaderTabs
 * Horizontal scrolling navigation bar listing all categories.
 * Rendered directly under the hero banner on the Category Feed page.
 *
 * @param {string} activeCategoryName - the currently-viewed category name
 */
export default function CategoryHeaderTabs({ activeCategoryName }) {
    return (
        <nav className="category-tabs" aria-label="Category navigation">
            <div className="category-tabs-inner">
                {categories.map(cat => {
                    const isActive =
                        cat.toLowerCase() === activeCategoryName?.toLowerCase();
                    return (
                        <Link
                            key={cat}
                            to={`/posts/tag/${cat}`}
                            className={`category-tab-item${isActive ? ' category-tab-item--active' : ''}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {cat}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
