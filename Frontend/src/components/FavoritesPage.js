import React, { useState, SyntheticEvent } from 'react';
import './FavoritesPage.css';
import DeleteIcon from '@mui/icons-material/Delete';


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

function FavoritesPage() {
    const [change_favorite, setChange_favorite] = useState(false);
    const update_favorite = (index) => {
        favorite_list.splice(index, 1);
        localStorage.setItem("favorite_list", JSON.stringify(favorite_list));
        alert("Removed from favorites!");
        setChange_favorite(!change_favorite);
    };
    var favorite_list = JSON.parse(localStorage.getItem("favorite_list"));
    if(favorite_list != null && favorite_list.length > 0) {
        return (
            <div className="favorites-page">
                <h4 className='text-center'>List of your favorite events</h4>
                <div className='d-flex container justify-content-center'>
                    <div className='tab mt-4 table-responsive'>
                        <table className='table table-hover rounded rounded-3 text-center overflow-hidden bg-white'>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Event</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Venue</th>
                                    <th scope="col">Favorite</th>
                                </tr>
                            </thead>
                            <tbody>
                                {favorite_list.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index+1}</th>
                                        <td>{item.dates.start.localDate}</td>
                                        <td>{item.name}</td>
                                        <td>{item.classifications?<p>{genre_value(item.classifications)}</p>:<p className="empty"></p>}</td>
                                        <td>{item._embedded.venues?<p>{item._embedded.venues[0].name}</p>:<p className="empty"></p>}</td>
                                        <td onClick={() => {update_favorite(index)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" ><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="no-data-found col-10 mx-auto mt-4" style={{color: 'red', backgroundColor: 'white', borderRadius: '15px', textAlign: 'center', fontSize: '18px' }}>
                <b>No favorite events to show</b>
            </div>
        );  
    }
};

export default FavoritesPage;