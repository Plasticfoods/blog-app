import './CategoryFeed.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header2 from '../../components/Header2';
import CategoryHeaderTabs from '../../components/CategoryHeaderTabs';
import CategoryFeedBlogs from '../../components/CategoryFeedBlogs';
import { api_url } from '../../helper/variables';


function CategoryFeed() {
    const { categoryName } = useParams();
    const [user, setUser]           = useState(null);
    const [loggedIn, setLoggedIn]   = useState(false);

    // Fetch logged-in user state for the header (same pattern as Profile.jsx)
    useEffect(() => {
        axios.get(`${api_url}myprofile`, {
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => {
            setUser(res.data.userData);
            setLoggedIn(res.data.loggedIn);
        })
        .catch(err => console.error(err));
    }, []);

    return (
        <div className="category-feed-page">
            {/* Sticky top navigation — reused as-is */}
            <Header2 user={user} loggedIn={loggedIn} />

            {/* Hero banner */}
            <section className="category-hero">
                <h1 className="category-hero-title">{categoryName}</h1>
                <p className="category-hero-subtitle">
                    Stories about {categoryName} from the Skeleton community.
                </p>
            </section>

            {/* Horizontal category tab bar — directly below the hero */}
            <CategoryHeaderTabs activeCategoryName={categoryName} />

            {/* Single-column reading feed */}
            <main className="category-feed-main">
                <CategoryFeedBlogs categoryName={categoryName} />
            </main>
        </div>
    );
}

export default CategoryFeed;
