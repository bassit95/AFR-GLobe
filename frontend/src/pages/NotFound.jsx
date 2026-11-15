import { Link } from "react-router-dom";
import PageBanner from "../components/Cards/PageBanner";


export default function NotFound() {
  return (

    <>
     <PageBanner 
        title="NotFound" 
        currentPage="NotFound" 
      />

      <main className="simple-page">
      <div className="section-label">404 / Africa Global</div>
      <h1>
        Page
        <br />
        <em>not found.</em>
      </h1>
      <Link className="text-link" to="/">
        Return home ↗
      </Link>
    </main>
    </>
    
  );
}
