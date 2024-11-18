function Statistics() {
    return (
        <div className="statistics">
            <p style={{ margin: "10px 0" }}>Statistics</p>
            <div className="statistics__item">
                <div className="statistics__label">
                    Total Game Completion <span className="statistics__value">80%</span>
                </div>
                <div className="progress">
                    <div className="progress__fill" style={{ width: "80%" }}></div>
                </div>
            </div>
            <div className="statistics__item">
                <div className="statistics__label">
                    Total Achievements <span className="statistics__value">700/1000</span>
                </div>
                <div className="progress">
                    <div className="progress__fill" style={{ width: "70%" }}></div>
                </div>
            </div>
            <div className="statistics__item">
                <div className="statistics__label">
                    Total Game Time <span className="statistics__value">90/100 hours</span>
                </div>
                <div className="progress">
                    <div className="progress__fill" style={{ width: "90%" }}></div>
                </div>
            </div>
        </div>

    )
}

export default Statistics;