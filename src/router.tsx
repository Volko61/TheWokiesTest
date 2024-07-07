import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/home/home.page";
import {InvitePage} from "./pages/invite/invite.page";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/invite" element={<InvitePage/>}/>
                <Route path="/" element={<HomePage/>}/>
            </Routes>
        </Router>
    )
}
