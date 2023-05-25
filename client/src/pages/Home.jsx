import Header from '../components/Header'
import Hero from '../components/Hero'
import Main from '../components/Main'
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div className="home">
            <Header />
            <Hero />
            <Main />
            <Footer />
        </div>  
    );
}
