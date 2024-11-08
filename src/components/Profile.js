import avatar from "../images/avatar.jpg";

function Profile() {
    return (
        <div className="profile">
            <div className="profile__info">
                <img className="profile__avatar" alt="avatar" src={avatar}/>
                <div className="profile__text">
                    <p className="profile__text_name">Anna</p>
                    <p className="profile__text_nick">@anlnv</p>
                </div>
            </div>
            <div className="profile__actions">
                <button className="profile__button">Follow</button>
                <button className="profile__button">Message</button>
            </div>
            <div className="profile__stats">
                <div className="profile__stat">1.2K<p className="profile__stat-text">Followers</p></div>
                <div className="profile__stat">2.3K<p className="profile__stat-text">Following</p></div>
                <div className="profile__stat">2.3K<p className="profile__stat-text">Friends</p></div>
            </div>
        </div>
    )
}

export default Profile;