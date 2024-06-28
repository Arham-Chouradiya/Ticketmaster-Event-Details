import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToggleButton } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import './SearchPage.css';


const IP_API = "e4bf73fa48f81d"
const GEO_API = "AIzaSyD4xkDb4JjGhcKW4CTAt5ytSYfej38q3cQ"
const code_color = { "onsale":"green", "offsale":"red", "cancelled":"black", "postponed":"orange", "rescheduled":"orange" };
const code_text = { "onsale":"On Sale", "offsale":"Off Sale", "cancelled":"Canceled", "postponed":"Postponed", "rescheduled":"Rescheduled" };

function genre_value(genre_list)    {
    var return_string = "";
    if(genre_list[0].segment && genre_list[0].segment.name && genre_list[0].segment.name!=="Undefined")
        return_string += genre_list[0].segment.name;

    if(genre_list[0].genre && genre_list[0].genre.name && genre_list[0].genre.name!=="Undefined")    {
        if(return_string)
            return_string += " | ";
        return_string += genre_list[0].genre.name;
    }

    if(genre_list[0].subGenre && genre_list[0].subGenre.name && genre_list[0].subGenre.name!=="Undefined")    {
        if(return_string)
            return_string += " | ";
        return_string += genre_list[0].subGenre.name;
    }

    if(genre_list[0].type && genre_list[0].type.name && genre_list[0].type.name!=="Undefined")    {
        if(return_string)
            return_string += " | ";
        return_string += genre_list[0].type.name;
    }

    if(genre_list[0].subType && genre_list[0].subType.name && genre_list[0].subType.name!=="Undefined")    {
        if(return_string)
            return_string += " | ";
        return_string += genre_list[0].subType.name;
    }

    return return_string;
};

function display_address(address_list)    {
    var return_string = "";
    if(address_list.address.line1)
        return_string += address_list.address.line1;
    if(address_list.city.name)  {
        if(return_string)
            return_string += ", ";
        return_string += address_list.city.name;
    }
    if(address_list.state.name)    {
        if(return_string)
            return_string += ", ";
        return_string += address_list.state.name;
    }
    return return_string;
}

function display_number(number_list)    {
    var re = /(?:[-+() ]*\d){10,13}/gm; 
    var return_string = number_list.match(re).map(function(s){return s.trim();});
    return return_string[0];
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function google_map_url(address_list)   {
    var address = display_address(address_list);
    var address_pass = address.split(" ").join("+");
    address_pass.replace('&', '%26');
    var url = "https://www.google.com/maps/embed/v1/place?key=" + GEO_API + "&q=" + address_pass;
    return url;
}

function check_favorite(event_content)   {
    var favorite_list = JSON.parse(localStorage.getItem("favorite_list"));
    if(favorite_list)   {
        for(var i=0; i<favorite_list.length; i++)  {
            if(event_content.id===favorite_list[i].id)
                return true;
        }
    }
    return false;
}

function update_favorite(event_content)   {
    var favorite_list = JSON.parse(localStorage.getItem("favorite_list"));
    if(favorite_list)   {
        for(var i=0; i<favorite_list.length; i++)  {
            if(event_content.id===favorite_list[i].id)  {
                favorite_list.splice(i, 1);
                localStorage.setItem("favorite_list", JSON.stringify(favorite_list));
                alert("Removed from favorite list");
                return false;
            }
        }
        favorite_list.push(event_content);
        localStorage.setItem("favorite_list", JSON.stringify(favorite_list));
        alert("Added to favorite list");
        console.log(localStorage.getItem("favorite_list").length);
        return true;
    }
    else    {
        favorite_list = [];
        favorite_list.push(event_content);
        localStorage.setItem("favorite_list", JSON.stringify(favorite_list));
        alert("Added to favorite list");
        return true;
    }
}

function print_spotify(data, first_spotify) {
    return <div className={first_spotify === data.name ? "carousel-item active" : "carousel-item"}>
            <div className='container mt-4'>
                <div className='row mb-4 mx-5'>
                    <div className='col-md-3 d-flex justify-content-center text-center'>
                        {data.name?
                        <span>
                            <img src={data.images[0].url} alt="artist" className='rounded-circle img-fluid'/>
                            <div className="artist-name-value" style={{fontSize:"30px"}}>{data.name}</div>
                        </span>
                        :<span></span>}
                    </div>
                    <div className='col-md-3 mt-3 mx-auto d-flex justify-content-center text-center'>
                        {data.popularity?
                        <span >
                            <div className='popularity-value'>Popularity</div>
                            <div className='mx-auto mt-3' style={{width:"60px", height:"60px"}}>
                                <CircularProgressbar
                                value={data.popularity}
                                text={data.popularity}
                                        strokeWidth={5}
                                        styles={buildStyles({
                                        textColor: "white",
                                        pathColor: "red",
                                        textSize: "32px",
                                        })}
                                />
                            </div>
                        </span>

                        :<span></span>}
                    </div>
                     <div className='col-md-3 mt-3 d-flex justify-content-center text-center' >
                        {data.followers.total?
                        <span>
                        <div className='followers-value'>Followers</div>
                        <div className='followers-data mt-3'>{numberWithCommas(data.followers.total)}</div>
                        </span>
                        :<span></span>}
                    </div>

                    

                    <div className='col-md-3 mt-3 d-flex justify-content-center text-center'>
                        {data.external_urls.spotify?
                        <span>
                            <div className='spotify-link-value'>Spotify Link</div>
                        <span className='mt-3'><a href={data.external_urls.spotify} target="_blank" rel="noopener noreferrer"><svg style={{color: "rgb(0, 128, 0)"}} xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-spotify" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" fill="#008000"></path> </svg>

                            <i class="fa-brands fa-spotify" style={{fontSize:35+"px",color:"green"}}></i>
                        </a></span>
                        </span>
                        :<span></span>}
                    </div>

 


                <div className='row mt-5 mx-auto'>
                            <div className='ms-1 artist-albm-values mb-2' style={{textAlign:"left"}}>Album featuring {data.name}</div>
                            {data.albums?
                            
                            data.albums.map((album,i) =>
                            <span key={i} className='col-md-4 mb-3'>
                                <img src={album.images[0].url} alt="album-missing" className='img-fluid'/>
                            </span>
                            )
                            :<span></span>}
                </div>

                </div>
        </div>
        </div>;
}

// Search Page
function SearchPage() {
    const [search_event, set_search_event] = useState({
        keyword: "",
        distance: 10,
        category: "Default",
        location: "",
        latitude: "",
        longitude: "",
    });

    
    const { keyword, distance, category, location, latitude, longitude } = search_event;
    const [auto_detect_location_checked, set_auto_detect_location_checked] = useState(false);
    const [table_content, set_table_content] = useState([]);
    const [event_content, set_event_content] = useState([]);
    const [venue_content, set_venue_content] = useState([]);
    const [spotify_content, set_spotify_content] = useState([]);
    const [suggestions, set_suggestions] = useState([]);
    const [display_table, set_display_table] = useState(false);
    const [display_event, set_display_event] = useState(false);
    const [favorite_event, set_favorite_event] = useState(false);
    const [first_spotify, set_first_spotify] = useState([]);
    const [display_opening_hours_less, set_display_opening_hours_less] = useState(true);
    const [display_general_rule_less, set_display_general_rule_less] = useState(true);
    const [display_child_rule_less, set_display_child_rule_less] = useState(true);
    const [value, setValue] = useState("1");
    const handleChange = (event, newValue) => { setValue(newValue); };
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const onSuggestHandler = (suggest) => { set_search_event({...search_event, keyword: suggest}); };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '450px',
        width: '98%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        borderRadius: 3,
        boxShadow: 24,
        p: 2,
      };
    const theme = createTheme({ palette: { red: { main: '#d32f2f', contrastText: '#fff', }, black: { main: '#000', contrastText: '#fff', }}, });

    // Change the value of the input
    const change_value = (event) => {
        set_search_event({...search_event, [event.target.name]: event.target.value});
        if(event.target.name === "keyword") {
            if(event.target.value.length > 2)
                get_suggestions_data(event.target.value);
            else
                set_suggestions([]);
        }
    }

    const clear_function = async () => {
        set_auto_detect_location_checked(false);
        set_table_content([]);
        set_event_content([]);
        set_venue_content([]);
        set_spotify_content([]);
        set_suggestions([]);
        set_display_table(false);
        set_display_event(false);
        set_favorite_event(false);
        set_first_spotify([]);
        set_display_opening_hours_less(true);
        set_display_general_rule_less(true);
        set_display_child_rule_less(true);
        set_search_event({
            keyword: "",
            distance: 10,
            category: "Default",
            location: "",
            latitude: "",
            longitude: "",
        });
    }

    // Change the value of the category
    const change_category = (event) => {
        set_search_event({...search_event, category: event.target.value});
    }

    // Get the suggestions data
    const get_suggestions_data = async (keyword) => {
        const suggestions_request = await axios.get(`https://csci-571-hw8-backend-382602.wl.r.appspot.com/suggestions?keyword=${keyword}`);
        if(suggestions_request.data._embedded === undefined) {
            set_suggestions([]);
            return;
        }
        const suggestions_json = suggestions_request.data._embedded.attractions;
        var suggestions_list = [];
        for(var i = 0; i < suggestions_json.length; i++) {
            suggestions_list.push(suggestions_json[i].name);
        }
        set_suggestions(suggestions_list);
    }

    // Get the table data
    const get_table_data = async (event) => {
        event.preventDefault();
        let latitude = -1000, longitude = -1000;
        if (auto_detect_location_checked)   {
            const ip_location_request = await axios.get(`https://ipinfo.io/json?token=${IP_API}`);
            const location_json =  ip_location_request.data.loc.split(",");
            latitude = location_json[0];
            longitude = location_json[1];
        }
        else    {
            const geo_location_request = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GEO_API}`);
            if(geo_location_request.data.status !== "ZERO_RESULTS")    {
                const location_json = geo_location_request.data.results[0].geometry.location;
                latitude = location_json.lat;
                longitude = location_json.lng;
            }
        }
        
        const search_result = await axios.get(`https://csci-571-hw8-backend-382602.wl.r.appspot.com/search_events?keyword=${keyword}&distance=${distance}&category=${category}&latitude=${latitude}&longitude=${longitude}`);
        if(search_result.data._embedded)  
            set_table_content(search_result.data._embedded.events.sort((a, b) => (a.dates.start.localDate > b.dates.start.localDate) ? 1 : -1));
        else
            set_table_content([]);
        set_display_table(true);
    }

    // Get the event data
    const get_event_data = async (event_id, venue_name, event_content) => {
        const event_result = await axios.get(`https://csci-571-hw8-backend-382602.wl.r.appspot.com/event_details?event_id=${event_id}`);
        set_event_content(event_result.data);
        const venue_result = await axios.get(`https://csci-571-hw8-backend-382602.wl.r.appspot.com/venue_details?keyword=${venue_name}`);
        set_venue_content(venue_result.data);  
        var spotify_data_array = [];      
        var spotify_data = {};
        // Add condition for no spotify links
        if(event_content._embedded.attractions !== undefined) {
        for(var i = 0; i < event_content._embedded.attractions.length; i++) {
                const spotify_result = await axios.get(`https://csci-571-hw8-backend-382602.wl.r.appspot.com/spotify_details?keyword=${event_content._embedded.attractions[i].name}`);
                spotify_data[i] = spotify_result.data;
                if(i===0) {set_first_spotify(spotify_data[i].name)};
                const spotify_album_data = await axios.get(`https://csci-571-hw8-backend-382602.wl.r.appspot.com/spotify_album_details?keyword=${spotify_result.data.id}`);
                spotify_data[i].albums = spotify_album_data.data;
                spotify_data_array.push(spotify_data[i]);
            }
        }
        set_favorite_event(check_favorite(event_id));
        set_spotify_content(spotify_data_array);
        set_display_event(true);
        set_display_table(false);
    }
    
    // Return the search page
    return (
        <div className="search_page mt-3">
            <div className='d-flex container justify-content-center'>
                <form className="card event_search_box p-4" onSubmit={get_table_data} onReset={clear_function}>
                    <h1 className='d-flex justify-content-center event-search'>Events Search</h1>
                    <hr />
                        <div className="keyword-division row">
                            <div className='col-12'>
                                <label className="form-label" htmlFor="keyword">Keyword <span style={{color:"red"}}>*</span></label>
                                <input className="form-control" type="text" name="keyword" id="keyword" required onChange={change_value} value={keyword} onBlur={() => set_suggestions([])} />
                                {
                                    suggestions && suggestions.map((suggestion, index) => {
                                        return <div key={index.toString()} className="suggestion col justify-content-sm-center" name="suggestion" id="suggestion" onMouseDown={() =>{onSuggestHandler(suggestion)}}>{suggestion}</div>
                                    })
                                }
                            </div>
                        </div>

                        <div className="distance-category-division row">
                            <div className="distance-division col-md-6 mt-2">
                                <label className="form-label" htmlFor="distance">Distance</label>
                                <input className="form-control" type="number" name="distance" id="distance" defaultValue={10} required onChange={change_value} />
                            </div>

                            <div className="category-division col-md-5 mt-2">
                                <label className="form-label" htmlFor="category">Category</label>
                                <select className="form-select" name="category" id="category" onChange={change_category} value={category} >
                                    <option value="Default">Default</option>
                                    <option value="Music">Music</option>
                                    <option value="Sports">Sports</option>
                                    <option value="ArtsAndTheatre">Arts & Theatre</option>
                                    <option value="Film">Film</option>
                                    <option value="Miscellaneous">Miscellaneous</option>
                                </select>
                            </div>
                        </div>

                        <div className="location-division row mt-2">
                            <div className='col-12'>
                                <label className="form-label" htmlFor="location">Location <span style={{color:"red"}}>*</span></label>
                                <input className="form-control" type="text" name="location" id="location" onChange={change_value} disabled={auto_detect_location_checked} value={location} required={!auto_detect_location_checked} />
                            </div>
                        </div>

                        <div className="auto-detect-location-division row mt-2">
                            <div className='col-12'>
                                <input className="form-check-input" type="checkbox" name="auto_detect_location" id="auto_detect_location" onClick={() => { set_auto_detect_location_checked(!auto_detect_location_checked); set_search_event({...search_event, location: ""}); }} />
                                <label className="form-check-label" htmlFor="auto_detect_location">&nbsp; Auto Detect Location</label>
                            </div>
                        </div>

                        <div className="search-clear-button d-flex justify-content-center mx-auto mt-2">
                            <div className="search-division me-4">
                                <button className="btn btn-danger" type="submit">Search</button>
                            </div>
                            <div className="clear-division">
                                <button className="btn btn-primary" type="reset">Clear</button>
                            </div>
                        </div>
                </form>    
            </div>

            {
                display_table ? (
                    table_content.length > 0 ? (
                        <div className='d-flex container justify-content-center mt-3 mb-3'>
                            <div className='tab table-responsive'>
                                <table className="display-table tab table-division table overflow-hidden table-striped table-hover text-center table-dark container px-2">
                                    <thead>
                                        <tr>
                                            <th scope="col" className='date-column'>Date/Time</th>
                                            <th scope="col">Icon</th>
                                            <th scope="col">Event</th>
                                            <th scope="col" className='date-column'>Genre</th>
                                            <th scope="col">Venue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            table_content.map((event) => {
                                                return (
                                                    <tr key={event.id} style={{cursor:'pointer'}} onClick={() => get_event_data(event.id, event._embedded.venues[0].name, event) }>
                                                        <td><p>{event.dates.start.localDate} <br />{event.dates.start.localTime}</p></td>
                                                        <td><img src={event.images[0].url} alt="event icon" style={{width:'80px', height:'80px'}} /></td>
                                                        <td>{event.name}</td>
                                                        <td>{event.classifications[0].segment.name}</td>
                                                        <td>{event._embedded.venues[0].name}</td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) :(
                        <div className="no-data-found col-10 mx-auto mt-3 mb-3" style={{color: 'red', backgroundColor: 'white', borderRadius: '15px', textAlign: 'center', fontSize: '18px' }}>
                            <b>No results available</b>
                        </div>
                    )
                ) : display_event ? (
                    <div className='d-flex container justify-content-center mb-3'>
                        <div className='card d-flex justify-content-center event_details_box container mx-auto mt-3'>
                            <p onClick={() => {set_display_event(false); set_display_table(true); set_display_child_rule_less(true); set_display_general_rule_less(true); set_display_opening_hours_less(true); }} className="back-arrow"><i class="arrow-left"></i>Back</p>
                            <div className='d-flex justify-content-center'>
                                <h3 className='event-name-box mx-3'>{event_content.name}</h3>
                                <div className=''>
                                    {
                                        check_favorite(event_content) ? (
                                            <ToggleButton  value="check" selected={check_favorite(event_content)} sx={{borderRadius:"30px", borderColor:"white"}} onChange={() => {update_favorite(event_content); set_favorite_event(!favorite_event)}} ><FavoriteIcon sx={{color:"red"}}/></ToggleButton>
                                        ) : (
                                            <ToggleButton  value="check" selected={check_favorite(event_content)} sx={{borderRadius:"30px", borderColor:"white"}} onChange={() => {update_favorite(event_content); set_favorite_event(!favorite_event)}} ><FavoriteIcon sx={{color:"white"}}/></ToggleButton>
                                        )
                                    }
                                </div>
                            </div>
                            
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} sx={{background:"#22c98a", marginTop:"20px"}} centered>
                                        <Tab label="Event" value="1" sx={{color:"white"}} />
                                        <Tab label="Artist/Teams" value="2" sx={{color:"white"}} />
                                        <Tab label="Venue" value="3" sx={{color:"white"}} />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <div className='row d-flex'>
                                        <div className='col-md-6'>
                                            <div className="date-available text-center">
                                                {event_content.dates.start.localDate
                                                    ?<><p className="date-data">Date</p>
                                                    <p className="date-value">{event_content.dates.start.localDate}</p></>
                                                    :<p className="empty"></p>
                                                }
                                            </div>

                                            <div className="artist-available text-center">
                                                {event_content._embedded.attractions
                                                    ?<><p className="artist-data">Artist/Team</p>
                                                        <p className="artist-value">{
                                                            (event_content._embedded.attractions.map((artist) => {
                                                                return artist.name;
                                                            }).join(' | '))
                                                        }</p></>
                                                    :<p className="empty"></p>
                                                }
                                            </div>

                                            <div className="venue-availabl text-center">
                                                {event_content._embedded.venues
                                                    ?<><p className="venue-data">Venue</p>
                                                        <p className="venue-value">{event_content._embedded.venues[0].name}</p></>
                                                    :<p className="empty"></p>
                                                }
                                            </div>

                                            <div className="genre-available text-center">
                                                {event_content.classifications
                                                    ?<><p className="genre-data-2">Genres</p>
                                                        <p className="genre-value">{genre_value(event_content.classifications)}</p></>
                                                    :<p className="empty"></p>
                                                }
                                            </div>

                                            <div className="price-available text-center">
                                                {event_content.priceRanges
                                                    ?<><p className="price-data">Price Ranges</p>
                                                        <p className="price-value">{event_content.priceRanges[0].min}-{event_content.priceRanges[0].max}</p></>
                                                    :<p className="empty"></p>
                                                }
                                            </div>
                                            <div className="ticket-available text-center">
                                                {(event_content.dates.status.code)
                                                    ?<><p className="ticket-data">Ticket Status</p>
                                                        <button className='btn' style={{backgroundColor: code_color[event_content.dates.status.code], color:"white"}}>{code_text[event_content.dates.status.code]}</button></>
                                                    :<p className="empty"></p>
                                                }
                                            </div>
                                            
                                            <div className="buy-available text-center">
                                            {event_content.url
                                                ?<><p className="ticket-data">Buy Ticket At:</p>
                                                    <p className="ticket-value"><a href={event_content.url} target="_blank" rel="noreferrer noopener">Ticketmaster</a></p></>
                                                :<p className="empty"></p>
                                            }
                                            </div>
                                        </div>
                                        <div className='col-md-6 m-auto'>
                                        <div className="seatmap-available">
                                                {(event_content.seatmap && event_content.seatmap.staticUrl)
                                                    ?<><img src={event_content.seatmap.staticUrl} className='img-fluid'></img></>
                                                    :<span className="empty"></span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text-center icontwt'>
                                        <span className='share-value'>Share on: </span>
                                        <a href={`https://twitter.com/intent/tweet?text=Check ${event_content.name} on TicketMaster. ${event_content.url}`} className='twtcolor' target = "_blank" rel="noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-twitter " viewBox="0 0 16 16">
                                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                                    </svg>
                                        </a>
                                        <span>&nbsp;&nbsp;</span>
                                        <a href={`https://www.facebook.com/sharer/sharer.php?display=page&u= ${event_content.url}`} className='twtcolor' target = "_blank" rel="noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-facebook fabcolor" viewBox="0 0 16 16">
                                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                                        </svg>
                                        </a>
                                    </div>
                                </TabPanel>
                                <TabPanel value="2">
                                    {
                                        spotify_content.length === 0 ? (
                                            <div className="no-data-found col-10 mx-auto mt-3" style={{color: 'red', backgroundColor: 'white', borderRadius: '15px', textAlign: 'center', fontSize: '18px' }}>
                                                <b>No music related artist details to show</b>
                                            </div>
                                        ) : (
                                            <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                                                <div class="carousel-inner">
                                                    {
                                                        spotify_content.map((data) => {
                                                            return print_spotify(data, first_spotify)})
                                                    }
                                                </div>
                                                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev" style={{visibility:(spotify_content.length === 1 ? "hidden": "visible")}}>
                                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                </a>
                                                <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next" style={{visibility:(spotify_content.length === 1 ? "hidden": "visible")}}>
                                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                </a>
                                            </div>
                                        )
                                    }
                                
                                </TabPanel>
                                <TabPanel value="3">
                                    <div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className="venue-name-available text-center">
                                                    {venue_content._embedded.venues[0].name
                                                        ?<><p className="venue-name-data">Name</p>
                                                        <p className="venue-name-value">{venue_content._embedded.venues[0].name}</p></>
                                                        :<p className="empty"></p>
                                                    }
                                                </div>

                                                <div className="venue-address-available text-center">
                                                    {venue_content._embedded.venues[0].address.line1
                                                        ?<><p className="venue-address-data">Address</p>
                                                            <p className="venue-address-value">{display_address(venue_content._embedded.venues[0])}</p></>
                                                        :<p className="empty"></p>
                                                    }
                                                </div>

                                                <div className="phone-available text-center">
                                                    {venue_content._embedded.venues[0].boxOfficeInfo && venue_content._embedded.venues[0].boxOfficeInfo.phoneNumberDetail
                                                        ?<><p className="phone-data">Phone Number</p>
                                                            <p className="phone-value">{display_number(venue_content._embedded.venues[0].boxOfficeInfo.phoneNumberDetail)}</p></>
                                                        :<p className="empty"></p>
                                                    }
                                                </div>
                                            </div>

                                            <div className='col-md-6'>
                                                <div className="opening-hours-available text-center">
                                                    {venue_content._embedded.venues[0].boxOfficeInfo && venue_content._embedded.venues[0].boxOfficeInfo.openHoursDetail
                                                        ?<><p className="opening-hours-data">Opening Hours</p>
                                                            <p className="opening-hours-value">{
                                                                display_opening_hours_less ? 
                                                                (<>
                                                                    <p className='mb-0'>{venue_content._embedded.venues[0].boxOfficeInfo.openHoursDetail.split(" ").slice(0,15).join(" ")}</p>
                                                                </>) : (<>
                                                                    <p className='mb-0'>{venue_content._embedded.venues[0].boxOfficeInfo.openHoursDetail}</p>
                                                                </>)
                                                            }{
                                                                display_opening_hours_less ?
                                                                (<>
                                                                    <p onClick={() => {set_display_opening_hours_less(false)}} style={{color:"#6495ED", textDecorationLine: 'underline'}}>Show More&nbsp;<i class="arrow-down"></i></p>
                                                                </>) : (<>
                                                                    <p onClick={() => {set_display_opening_hours_less(true)}} style={{color:"#6495ED", textDecorationLine: 'underline'}}>Show Less&nbsp;<i class="arrow-up"></i></p>
                                                                </>)
                                                            }</p></>
                                                        :<p className="empty"></p>
                                                    }
                                                </div>

                                                <div className="general-rule-available text-center">
                                                    {venue_content._embedded.venues[0].generalInfo && venue_content._embedded.venues[0].generalInfo.generalRule
                                                        ?<><p className="general-rule-data">General Rule</p>
                                                            <p className="general-rule-value">{
                                                                display_general_rule_less ?
                                                                (<>
                                                                    <p className='mb-0'>{venue_content._embedded.venues[0].generalInfo.generalRule.split(" ").slice(0,15).join(" ")}</p>
                                                                </>) : (<>
                                                                    <p className='mb-0'>{venue_content._embedded.venues[0].generalInfo.generalRule}</p>
                                                                </>)
                                                            }{
                                                                display_general_rule_less ?
                                                                (<>
                                                                    <p onClick={() => {set_display_general_rule_less(false)}} style={{color:"#6495ED", textDecorationLine: 'underline'}}>Show More&nbsp;<i class="arrow-down"></i></p>
                                                                </>) : (<>
                                                                    <p onClick={() => {set_display_general_rule_less(true)}} style={{color:"#6495ED", textDecorationLine: 'underline'}}>Show Less&nbsp;<i class="arrow-up"></i></p>
                                                                </>)
                                                            }</p></>
                                                        :<p className="empty"></p>
                                                    }
                                                </div>

                                                <div className="child-rule-available text-center">
                                                    {venue_content._embedded.venues[0].generalInfo && venue_content._embedded.venues[0].generalInfo.childRule
                                                        ?<><p className="child-rule-data">Child Rule</p>
                                                            <p className="child-rule-value">{
                                                                display_child_rule_less ?
                                                                (<>
                                                                    <p className='mb-0'>{venue_content._embedded.venues[0].generalInfo.childRule.split(" ").slice(0,15).join(" ")}</p>
                                                                </>) : (<>
                                                                    <p className='mb-0'>{venue_content._embedded.venues[0].generalInfo.childRule}</p>
                                                                </>)
                                                            }{
                                                                display_child_rule_less ?
                                                                (<>
                                                                    <p onClick={() => {set_display_child_rule_less(false)}} style={{color:"#6495ED", textDecorationLine: 'underline'}}>Show More&nbsp;<i class="arrow-down"></i></p>
                                                                </>) : (<>
                                                                    <p onClick={() => {set_display_child_rule_less(true)}} style={{color:"#6495ED", textDecorationLine: 'underline'}}>Show Less&nbsp;<i class="arrow-up"></i></p>
                                                                </>)
                                                            }</p></>
                                                        :<p className="empty"></p>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className='google-map d-flex justify-content-center mt-2'>
                                            <ThemeProvider theme={theme}>
                                                <Button color='red' variant='contained' onClick={handleOpen}>Show venue on Google map</Button>
                                                <Modal open={open}>
                                                    <Box sx={style}>
                                                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontSize:"25px"}}>
                                                        <strong>Event Venue</strong>
                                                    </Typography>
                                                    <hr style={{color:"black"}}/>
                                                    <iframe src={google_map_url(venue_content._embedded.venues[0])} width="100%" height="450" frameBorder="0" allowFullScreen></iframe>
                                                    <Button className='mt-2' color='black' variant='contained' onClick={handleClose}>Close</Button>
                                                    </Box>
                                                </Modal>
                                            </ThemeProvider>
                                        </div>
                                    </div>
                                </TabPanel>
                            </TabContext>
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
};

export default SearchPage;