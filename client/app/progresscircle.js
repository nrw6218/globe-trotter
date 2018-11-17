class CircularProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    //Number of seconds in a day
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;

    //Dates
    const start_date = new Date(this.props.start);
    const current_date = new Date();
    let daysLeft;
    let dashOffset;
    let measure;
    if((start_date.getTime() - current_date.getTime()) > 0) {
      daysLeft = Math.round(Math.abs(start_date.getTime() - current_date.getTime()) / oneDay);
      dashOffset = dashArray - dashArray * (Math.abs(daysLeft - this.props.total)/this.props.total);
    } else {
      daysLeft = 0;
      dashOffset = 0;
    }

    if (daysLeft > 1) {
      measure = "days";
    } else if (daysLeft == 1) {
      measure = "day";
    } else {
      measure = "";
    }

    return (
      <svg
          width={this.props.sqSize}
          height={this.props.sqSize}
          viewBox={viewBox}>
          <circle
            className="circle-background"
            cx={this.props.sqSize / 2}
            cy={this.props.sqSize / 2}
            r={radius}
            strokeWidth={`${this.props.strokeWidth}px`} />
          <circle
            className="circle-progress"
            cx={this.props.sqSize / 2}
            cy={this.props.sqSize / 2}
            r={radius}
            strokeWidth={`${this.props.strokeWidth}px`}
            // Start progress marker at 12 O'Clock
            transform={`rotate(-90 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
            style={{
              stroke: (daysLeft > 0 ? this.props.color : "rgba(150,206,180,1)"),
              strokeDasharray: dashArray,
              strokeDashoffset: dashOffset
            }} />
          <text
            className="circle-text"
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle">
            {`${daysLeft > 0 ? daysLeft : 'CHARTED'} ${measure}`}
          </text>
      </svg>
    );
  }
}