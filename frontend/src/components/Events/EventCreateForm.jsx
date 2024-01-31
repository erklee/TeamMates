import { useState } from "react";
import { useParams } from "react-router-dom";
import jwtFetch from "../../store/jwt";

export default function EventCreateForm() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [attendeesMax, setAttendeesMax] = useState(0);
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');

    const { id } = useParams();

    const handleSubmit = async e => {
        e.preventDefault();
        console.log({
            title,
            description,
            eventDate,
            attendeesMax,
            address1,
            address2,
            state,
            zipcode
        })
    }


    return (
        <form 
            htmlFor="event-create"
            onSubmit={handleSubmit}>
            <label htmlFor="title">Title:
                <input 
                    type="text"
                    className="event-title input"
                    value={title}
                    onChange={e => {
                        e.preventDefault();
                        setTitle(e.target.value);
                    }}/>
            </label>
            <label htmlFor="description">Description:
                <textarea 
                    className="event-description input" 
                    id="description-input" 
                    cols="30" 
                    rows="10"
                    value={description}
                    onChange={e => {
                        e.preventDefault();
                        setDescription(e.target.value);
                    }}></textarea>
            </label>
            <label htmlFor="date">Date:
                <input 
                    type="date" 
                    className="event-date input"
                    value={eventDate}
                    onChange={e => {
                        e.preventDefault();
                        setEventDate(e.target.value);
                    }}/>
            </label>
            <label htmlFor="max-attendees">Max Attendees:
                    <input 
                        type="number" 
                        className="event-max-attendees input"
                        value={attendeesMax}
                        onChange={e => {
                            e.preventDefault();
                            setAttendeesMax(e.target.value);
                        }}/>
            </label>
            <div id="address-input wrapper">
                <label htmlFor="address-line-1">Address Line 1:
                    <input 
                        type="text" 
                        className="address-line-1 input" 
                        value={address1}
                        onChange={e => {
                            e.preventDefault();
                            setAddress1(e.target.value);
                        }}/>
                </label>
                <label htmlFor="address-line-2">Address Line 2:
                    <input 
                        type="text" 
                        className="address-line-2 input"
                        value={address2}
                        onChange={e => {
                            e.preventDefault();
                            setAddress2(e.target.value);
                        }} />
                </label>
                <label htmlFor="address-state">State:
                    <select 
                        className="address-state input" 
                        id="address-state-select"
                        value={state.length ? state : "AL"}
                        onChange={e => {
                            e.preventDefault();
                            setState(e.target.value);
                        }}>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                    </select>
                </label>
            </div>
            <label htmlFor="zipcode">Zipcode:
                <input 
                    type="text"
                    className="zipcode input"
                    value={zipcode}
                    onChange={e => {
                        e.preventDefault();
                        setZipcode(e.target.value);
                    }} />
            </label>
            
        </form>
    )
}