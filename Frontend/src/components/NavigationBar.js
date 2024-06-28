import React from "react";

function NavigationBar() {
    const path = window.location.pathname;
    
    const component_selected = {
        border: "1px solid white",
        borderRadius: "10px",
        color: "white",
        padding: "7px",
    };

    const component_not_selected = {
        color: "white",
        padding: "7px",
    };

    return (
        <nav className="navbar bg-transparent w-100">
            <div className="container-fluid justify-content-end">
                <a className="navbar-brand" href="/search-page" style={path=="/" || path=="/search-page" ? component_selected : component_not_selected}>Search</a>
                <a className="navbar-brand" href="/favorites-page" style={path=="/favorites-page" ? component_selected : component_not_selected}>Favorites</a>
            </div>
        </nav>
    );
};

export default NavigationBar;