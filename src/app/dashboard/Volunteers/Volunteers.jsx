import React from "react";
import { connect } from "react-redux";

const DashboardVolunteers = () => {
  return <div>Hello world</div>;
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.firebase.auth,
  };
};

export default connect(mapStateToProps)(DashboardVolunteers);
